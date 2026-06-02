import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  advanceRound,
  applyBailoutChoice,
  applyMergerAttemptResult,
  createInitialGameState,
  getCurrentRound,
  getNextRandomRoundIndex,
  resolveAndAdvanceRound
} from "../domain/roundEngine";
import {
  buildEffectiveConfig,
  clearGameState,
  clearStoredAppData,
  hasSavedGame,
  loadSavedSettings,
  loadGameState,
  markGameAsStarted,
  saveMergerTargetScore,
  saveGameState,
  stampGameState
} from "../domain/storage";
import { calculateMarketStatus } from "../domain/marketStatusEngine";
import type { AppConfig, BailoutChoice, GameState, MergerAttemptResolution, Round, RoundResult, Wildcard } from "../domain/types";
import { isPositiveWildcard, useWildcard as applyWildcard } from "../domain/wildcardEngine";
import { copy } from "../lang";
import { availableWildcards, bailoutOptions, defaultConfig, roundDeck } from "../data/gameContent";
import { ensureAnonymousSession } from "../services/cloudSync/firebaseAuth";
import {
  hydrateFromLocalAndCloud,
  queueCloudSync,
  registerConnectivitySync,
  synchronizeGameStateByTimestamp
} from "../services/cloudSync/syncManager";
import { isFirebaseConfigured } from "../services/cloudSync/firebaseApp";

interface GameContextValue {
  config: AppConfig;
  state: GameState;
  rounds: Round[];
  currentRound: Round;
  availableWildcards: Wildcard[];
  drawnWildcardOffer: Wildcard | null;
  hasStartedGame: boolean;
  isLoading: boolean;
  updateMergerTargetScore: (score: number) => void;
  startNewGame: () => void;
  resolveCurrentRound: (result: RoundResult) => void;
  goToNextRound: () => void;
  useWildcardById: (wildcardId: string) => void;
  drawWildcard: () => void;
  keepDrawnWildcard: () => void;
  useDrawnWildcardNow: () => void;
  dismissDrawnWildcard: () => void;
  applyMergerResult: (resolution: MergerAttemptResolution) => void;
  applyBailout: (choice: BailoutChoice) => void;
  synchronizeGame: () => Promise<void>;
  clearSavedGame: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);
const INITIAL_CLOUD_HYDRATION_TIMEOUT_MS = 2500;
const INITIAL_CLOUD_HYDRATION_DELAY_MS = 100;
const CLOUD_AUTH_START_DELAY_MS = 500;

function scheduleIdleTask(task: () => void, delayMs: number): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  let idleId: number | undefined;
  const timeoutId = window.setTimeout(() => {
    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(task, { timeout: 5000 });
      return;
    }

    task();
  }, delayMs);

  return () => {
    window.clearTimeout(timeoutId);
    if (idleId !== undefined && "cancelIdleCallback" in window) {
      window.cancelIdleCallback(idleId);
    }
  };
}

function createFreshState(config: AppConfig): GameState {
  const initialRoundIndex = getNextRandomRoundIndex(roundDeck, []);
  const initialRound = getCurrentRound(roundDeck, initialRoundIndex);

  return {
    ...createInitialGameState(config, []),
    currentRoundIndex: initialRoundIndex,
    shownRoundIds: [initialRound.id]
  };
}

function normalizeStateForConfig(state: GameState, config: AppConfig): GameState {
  const currentRound = getCurrentRound(roundDeck, state.currentRoundIndex);
  const shownRoundIds = state.shownRoundIds?.length
    ? state.shownRoundIds
    : [...state.resolvedRoundIds, currentRound.id];

  return {
    ...state,
    shownRoundIds,
    marketStatus: calculateMarketStatus(state.score, config)
  };
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [shouldHydrateInitialGame] = useState(() => hasSavedGame());
  const shouldPreserveNextPersistedState = useRef(false);
  const [shouldCheckCloudOnStart] = useState(() => isFirebaseConfigured());
  const [isInitialHydrationComplete, setIsInitialHydrationComplete] = useState(() => !shouldCheckCloudOnStart);
  const [config, setConfig] = useState<AppConfig>(() => buildEffectiveConfig(defaultConfig, loadSavedSettings()));
  const initialHydrationConfig = useRef(config);
  const [state, setState] = useState<GameState>(() => {
    const initialConfig = buildEffectiveConfig(defaultConfig, loadSavedSettings());
    const loadedState = loadGameState();
    return loadedState ? normalizeStateForConfig(loadedState, initialConfig) : createFreshState(initialConfig);
  });
  const [hasStarted, setHasStarted] = useState(shouldHydrateInitialGame);
  const [drawnWildcardOffer, setDrawnWildcardOffer] = useState<Wildcard | null>(null);

  useEffect(() => {
    const unregisterConnectivitySync = registerConnectivitySync();
    const cancelAuthWarmup = shouldCheckCloudOnStart
      ? scheduleIdleTask(() => {
          void ensureAnonymousSession();
        }, CLOUD_AUTH_START_DELAY_MS)
      : () => undefined;

    return () => {
      cancelAuthWarmup();
      unregisterConnectivitySync();
    };
  }, [shouldCheckCloudOnStart]);

  useEffect(() => {
    if (!shouldCheckCloudOnStart) {
      return;
    }

    let isCancelled = false;
    let fallbackTimer: number | undefined;
    const cancelHydration = scheduleIdleTask(() => {
      fallbackTimer = window.setTimeout(() => {
        if (!isCancelled) {
          setIsInitialHydrationComplete(true);
        }
      }, INITIAL_CLOUD_HYDRATION_TIMEOUT_MS);

      void hydrateFromLocalAndCloud().then((loadedState) => {
        if (isCancelled) {
          return;
        }

        window.clearTimeout(fallbackTimer);
        if (loadedState) {
          markGameAsStarted();
          shouldPreserveNextPersistedState.current = true;
          setHasStarted(true);
          setState(normalizeStateForConfig(loadedState, initialHydrationConfig.current));
        }
        setIsInitialHydrationComplete(true);
      }).catch(() => {
        if (isCancelled) {
          return;
        }

        window.clearTimeout(fallbackTimer);
        setIsInitialHydrationComplete(true);
      });
    }, INITIAL_CLOUD_HYDRATION_DELAY_MS);

    return () => {
      isCancelled = true;
      cancelHydration();
      if (fallbackTimer !== undefined) {
        window.clearTimeout(fallbackTimer);
      }
    };
  }, [shouldCheckCloudOnStart]);

  useEffect(() => {
    if (!isInitialHydrationComplete) {
      if (hasStarted) {
        saveGameState(state);
      }
      return;
    }

    if (hasStarted) {
      if (shouldPreserveNextPersistedState.current) {
        shouldPreserveNextPersistedState.current = false;
        saveGameState(state);
        return;
      }

      const timestampedState = stampGameState(state);
      saveGameState(timestampedState);
      queueCloudSync(timestampedState);
      return;
    }

    clearGameState();
  }, [hasStarted, isInitialHydrationComplete, state]);

  const currentRound = useMemo(
    () => getCurrentRound(roundDeck, state.currentRoundIndex),
    [state.currentRoundIndex]
  );

  const startNewGame = useCallback(() => {
    markGameAsStarted();
    setHasStarted(true);
    setDrawnWildcardOffer(null);
    setState(createFreshState(config));
  }, [config]);

  const resolveCurrentRound = useCallback((result: RoundResult) => {
    setDrawnWildcardOffer(null);
    setState((previousState) =>
      resolveAndAdvanceRound(
        previousState,
        roundDeck,
        getCurrentRound(roundDeck, previousState.currentRoundIndex),
        result,
        config
      )
    );
  }, [config]);

  const goToNextRound = useCallback(() => {
    setState((previousState) => advanceRound(previousState, roundDeck, config));
  }, [config]);

  const useWildcardById = useCallback((wildcardId: string) => {
    setState((previousState) => {
      const wildcard = previousState.accumulatedWildcards.find((item) => item.id === wildcardId);

      if (!wildcard) {
        return previousState;
      }

      return applyWildcard(previousState, wildcard, config);
    });
  }, [config]);

  const drawWildcard = useCallback(() => {
    setState((previousState) => {
      if (
        drawnWildcardOffer ||
        previousState.hasDrawnWildcardThisRound ||
        previousState.hasUsedWildcardThisRound ||
        previousState.phase !== "ANSWERING"
      ) {
        return {
          ...previousState,
          lastEventMessage: copy.wildcards.onlyAtRoundStart
        };
      }

      const ownedIds = new Set([
        ...previousState.accumulatedWildcards.map((wildcard) => wildcard.id),
        ...previousState.usedWildcardIds
      ]);
      const nextWildcard = availableWildcards.find((wildcard) => !ownedIds.has(wildcard.id));

      if (!nextWildcard) {
        return {
          ...previousState,
          hasDrawnWildcardThisRound: true,
          lastEventMessage: copy.wildcards.deckEmpty
        };
      }

      if (isPositiveWildcard(nextWildcard)) {
        setDrawnWildcardOffer(nextWildcard);
        return {
          ...previousState,
          hasDrawnWildcardThisRound: true,
          lastEventMessage: copy.wildcards.positiveDrawn(nextWildcard.name)
        };
      }

      const stateWithDrawFlag = {
        ...previousState,
        hasDrawnWildcardThisRound: true
      };
      setDrawnWildcardOffer(nextWildcard);

      return {
        ...applyWildcard(stateWithDrawFlag, nextWildcard, config),
        lastEventMessage: copy.wildcards.negativeApplied(nextWildcard.name)
      };
    });
  }, [config, drawnWildcardOffer]);

  const keepDrawnWildcard = useCallback(() => {
    setState((previousState) => {
      if (!drawnWildcardOffer) {
        return previousState;
      }

      return {
        ...previousState,
        accumulatedWildcards: [...previousState.accumulatedWildcards, drawnWildcardOffer],
        lastEventMessage: copy.wildcards.saved(drawnWildcardOffer.name)
      };
    });
    setDrawnWildcardOffer(null);
  }, [drawnWildcardOffer]);

  const useDrawnWildcardNow = useCallback(() => {
    setState((previousState) => {
      if (!drawnWildcardOffer) {
        return previousState;
      }

      return applyWildcard(previousState, drawnWildcardOffer, config);
    });
    setDrawnWildcardOffer(null);
  }, [config, drawnWildcardOffer]);

  const dismissDrawnWildcard = useCallback(() => {
    setDrawnWildcardOffer(null);
  }, []);

  const applyMergerResult = useCallback((resolution: MergerAttemptResolution) => {
    setState((previousState) => applyMergerAttemptResult(previousState, resolution, config));
  }, [config]);

  const applyBailout = useCallback((choice: BailoutChoice) => {
    setState((previousState) => applyBailoutChoice(previousState, choice, bailoutOptions, config));
  }, [config]);

  const synchronizeGame = useCallback(async () => {
    if (!hasStarted) {
      return;
    }

    const synchronizedState = await synchronizeGameStateByTimestamp(state);

    if (synchronizedState) {
      shouldPreserveNextPersistedState.current = true;
      setState(normalizeStateForConfig(synchronizedState, config));
    }
  }, [config, hasStarted, state]);

  const updateMergerTargetScore = useCallback((score: number) => {
    const nextConfig = {
      ...config,
      mergerTargetScore: score
    };

    saveMergerTargetScore(score);
    setConfig(nextConfig);
    setState((previousState) => normalizeStateForConfig(previousState, nextConfig));
  }, [config]);

  const clearSavedGame = useCallback(() => {
    clearStoredAppData();
    const resetConfig = buildEffectiveConfig(defaultConfig, {});
    setConfig(resetConfig);
    setHasStarted(false);
    setDrawnWildcardOffer(null);
    setState(createFreshState(resetConfig));
  }, []);

  const value = useMemo<GameContextValue>(
    () => ({
      config,
      state,
      rounds: roundDeck,
      currentRound,
      availableWildcards,
      drawnWildcardOffer,
      hasStartedGame: hasStarted,
      isLoading: !isInitialHydrationComplete,
      updateMergerTargetScore,
      startNewGame,
      resolveCurrentRound,
      goToNextRound,
      useWildcardById,
      drawWildcard,
      keepDrawnWildcard,
      useDrawnWildcardNow,
      dismissDrawnWildcard,
      applyMergerResult,
      applyBailout,
      synchronizeGame,
      clearSavedGame
    }),
    [
      state,
      drawnWildcardOffer,
      hasStarted,
      isInitialHydrationComplete,
      currentRound,
      config,
      updateMergerTargetScore,
      startNewGame,
      resolveCurrentRound,
      goToNextRound,
      useWildcardById,
      drawWildcard,
      keepDrawnWildcard,
      useDrawnWildcardNow,
      dismissDrawnWildcard,
      applyMergerResult,
      applyBailout,
      synchronizeGame,
      clearSavedGame
    ]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const value = useContext(GameContext);

  if (!value) {
    throw new Error(copy.errors.gameProviderRequired);
  }

  return value;
}
