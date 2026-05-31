import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
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
  saveGameState
} from "../domain/storage";
import { calculateMarketStatus } from "../domain/marketStatusEngine";
import type { AppConfig, BailoutChoice, GameState, Round, RoundResult, Wildcard } from "../domain/types";
import { isPositiveWildcard, useWildcard as applyWildcard } from "../domain/wildcardEngine";
import { copy } from "../lang";
import { availableWildcards, defaultConfig, roundDeck } from "../data/gameContent";

interface GameContextValue {
  config: AppConfig;
  state: GameState;
  rounds: Round[];
  currentRound: Round;
  availableWildcards: Wildcard[];
  drawnWildcardOffer: Wildcard | null;
  hasStartedGame: boolean;
  updateMergerTargetScore: (score: number) => void;
  startNewGame: () => void;
  resolveCurrentRound: (result: RoundResult) => void;
  goToNextRound: () => void;
  useWildcardById: (wildcardId: string) => void;
  drawWildcard: () => void;
  keepDrawnWildcard: () => void;
  useDrawnWildcardNow: () => void;
  dismissDrawnWildcard: () => void;
  applyMergerResult: (successfulPhases: number) => void;
  applyBailout: (choice: BailoutChoice) => void;
  clearSavedGame: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

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
  const [config, setConfig] = useState<AppConfig>(() => buildEffectiveConfig(defaultConfig, loadSavedSettings()));
  const [state, setState] = useState<GameState>(() => {
    const initialConfig = buildEffectiveConfig(defaultConfig, loadSavedSettings());
    const loadedState = loadGameState();
    return loadedState ? normalizeStateForConfig(loadedState, initialConfig) : createFreshState(initialConfig);
  });
  const [hasStarted, setHasStarted] = useState(() => hasSavedGame());
  const [drawnWildcardOffer, setDrawnWildcardOffer] = useState<Wildcard | null>(null);

  useEffect(() => {
    if (hasStarted) {
      saveGameState(state);
      return;
    }

    clearGameState();
  }, [hasStarted, state]);

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

  const applyMergerResult = useCallback((successfulPhases: number) => {
    setState((previousState) => applyMergerAttemptResult(previousState, successfulPhases, config));
  }, [config]);

  const applyBailout = useCallback((choice: BailoutChoice) => {
    setState((previousState) => applyBailoutChoice(previousState, choice, config));
  }, [config]);

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
      clearSavedGame
    }),
    [
      state,
      drawnWildcardOffer,
      hasStarted,
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
