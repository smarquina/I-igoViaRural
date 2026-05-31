import { MERGER_FAILURE_DRINKS, MERGER_FAILURE_SCORE_PENALTY } from "./constants";
import { decrementRoundEffects } from "./effectEngine";
import { calculateMarketStatus } from "./marketStatusEngine";
import { calculateRoundResultScore } from "./scoreEngine";
import type { AppConfig, BailoutChoice, GameState, Round, RoundResult, Wildcard } from "./types";

function createScorePoint(score: number, event: string) {
  return {
    score,
    timestamp: new Date().toISOString(),
    event
  };
}

export function buildRoundDeck(rounds: Round[], auditQuestions: Round[]): Round[] {
  const deck: Round[] = [];
  const maxLength = Math.max(rounds.length, auditQuestions.length);

  for (let index = 0; index < maxLength; index += 1) {
    if (rounds[index]) {
      deck.push(rounds[index]);
    }

    if (auditQuestions[index]) {
      deck.push(auditQuestions[index]);
    }
  }

  return deck;
}

export function createInitialGameState(config: AppConfig, initialWildcards: Wildcard[] = []): GameState {
  return {
    groomName: config.groomName,
    brideName: config.brideName,
    score: config.initialScore,
    currentRoundIndex: 0,
    roundNumber: 1,
    marketStatus: calculateMarketStatus(config.initialScore, config),
    accumulatedWildcards: initialWildcards,
    activeEffects: [],
    hasUsedWildcardThisRound: false,
    hasDrawnWildcardThisRound: false,
    scoreHistory: [config.initialScore],
    scoreTimeline: [createScorePoint(config.initialScore, "Apertura de sesión")],
    totalDrinks: 0,
    totalSuccesses: 0,
    totalFailures: 0,
    totalPartialSuccesses: 0,
    usedWildcardIds: [],
    shownRoundIds: [],
    resolvedRoundIds: [],
    isGameFinished: false,
    gameResult: "IN_PROGRESS",
    phase: "ANSWERING",
    lastScoreDelta: 0,
    lastDrinkPenalty: 0
  };
}

export function getCurrentRound(rounds: Round[], currentRoundIndex: number): Round {
  return rounds[currentRoundIndex % rounds.length];
}

export function getNextRandomRoundIndex(
  rounds: Round[],
  resolvedRoundIds: string[],
  random: () => number = Math.random
): number {
  if (rounds.length === 0) {
    return 0;
  }

  const resolvedIds = new Set(resolvedRoundIds);
  const availableIndexes = rounds
    .map((round, index) => ({ round, index }))
    .filter(({ round }) => !resolvedIds.has(round.id))
    .map(({ index }) => index);
  const pool = availableIndexes.length > 0 ? availableIndexes : rounds.map((_, index) => index);
  const randomIndex = Math.floor(random() * pool.length);

  return pool[randomIndex] ?? 0;
}

export function resolveRound(state: GameState, round: Round, result: RoundResult, config?: AppConfig): GameState {
  if (state.phase === "RESOLVED") {
    return state;
  }

  const scoreResult = calculateRoundResultScore(state, round, result);
  const nextScore = state.score + scoreResult.scoreDelta;

  return {
    ...state,
    score: nextScore,
    marketStatus: calculateMarketStatus(nextScore, config),
    scoreHistory: [...state.scoreHistory, nextScore],
    scoreTimeline: [...state.scoreTimeline, createScorePoint(nextScore, `Ronda ${state.roundNumber}: ${round.title}`)],
    totalDrinks: state.totalDrinks + scoreResult.drinks,
    totalSuccesses: state.totalSuccesses + (result === "SUCCESS" ? 1 : 0),
    totalFailures: state.totalFailures + (result === "FAILURE" ? 1 : 0),
    totalPartialSuccesses: state.totalPartialSuccesses + (result === "PARTIAL_SUCCESS" ? 1 : 0),
    resolvedRoundIds: [...state.resolvedRoundIds, round.id],
    phase: "RESOLVED",
    lastScoreDelta: scoreResult.scoreDelta,
    lastDrinkPenalty: scoreResult.drinks,
    lastEventMessage:
      scoreResult.appliedEffectLabels.length > 0
        ? `Efectos aplicados: ${scoreResult.appliedEffectLabels.join(", ")}.`
        : undefined
  };
}

export function advanceRound(
  state: GameState,
  rounds?: Round[],
  config?: AppConfig,
  random?: () => number
): GameState {
  const nextRoundIndex = rounds
    ? getNextRandomRoundIndex(rounds, state.shownRoundIds, random)
    : state.currentRoundIndex + 1;
  const nextRound = rounds?.[nextRoundIndex];

  return {
    ...state,
    currentRoundIndex: nextRoundIndex,
    roundNumber: state.roundNumber + 1,
    shownRoundIds: nextRound ? [...state.shownRoundIds, nextRound.id] : state.shownRoundIds,
    activeEffects: decrementRoundEffects(state.activeEffects),
    hasUsedWildcardThisRound: false,
    hasDrawnWildcardThisRound: false,
    phase: "ANSWERING",
    lastScoreDelta: 0,
    lastDrinkPenalty: 0,
    lastEventMessage: undefined,
    marketStatus: calculateMarketStatus(state.score, config)
  };
}

export function resolveAndAdvanceRound(
  state: GameState,
  rounds: Round[],
  round: Round,
  result: RoundResult,
  config?: AppConfig,
  random?: () => number
): GameState {
  const resolvedState = resolveRound(state, round, result, config);

  if (resolvedState === state) {
    return state;
  }

  const nextRoundIndex = getNextRandomRoundIndex(rounds, resolvedState.shownRoundIds, random);
  const nextRound = getCurrentRound(rounds, nextRoundIndex);

  return {
    ...resolvedState,
    currentRoundIndex: nextRoundIndex,
    roundNumber: resolvedState.roundNumber + 1,
    activeEffects: decrementRoundEffects(resolvedState.activeEffects),
    hasUsedWildcardThisRound: false,
    hasDrawnWildcardThisRound: false,
    phase: "ANSWERING",
    marketStatus: calculateMarketStatus(resolvedState.score, config),
    shownRoundIds: [...resolvedState.shownRoundIds, nextRound.id]
  };
}

export function applyMergerAttemptResult(state: GameState, successfulPhases: number, config?: AppConfig): GameState {
  if (successfulPhases >= 2) {
    return {
      ...state,
      isGameFinished: true,
      gameResult: "MERGER_APPROVED",
      lastEventMessage: "Fusión aprobada por el Consejo de Administración."
    };
  }

  const nextScore = state.score - MERGER_FAILURE_SCORE_PENALTY;

  return {
    ...state,
    score: nextScore,
    scoreHistory: [...state.scoreHistory, nextScore],
    scoreTimeline: [...state.scoreTimeline, createScorePoint(nextScore, "Cierre de Fusión fallido")],
    marketStatus: calculateMarketStatus(nextScore, config),
    totalDrinks: state.totalDrinks + MERGER_FAILURE_DRINKS,
    lastScoreDelta: -MERGER_FAILURE_SCORE_PENALTY,
    lastDrinkPenalty: MERGER_FAILURE_DRINKS,
    lastEventMessage: "La fusión no se cierra todavía. Vuelve el mercado."
  };
}

export function applyBailoutChoice(state: GameState, choice: BailoutChoice, config?: AppConfig): GameState {
  if (choice === "LIQUIDITY") {
    const nextScore = state.score + 20;
    return {
      ...state,
      score: nextScore,
      scoreHistory: [...state.scoreHistory, nextScore],
      scoreTimeline: [...state.scoreTimeline, createScorePoint(nextScore, "Rescate con liquidez")],
      marketStatus: calculateMarketStatus(nextScore, config),
      totalDrinks: state.totalDrinks + 5,
      lastScoreDelta: 20,
      lastDrinkPenalty: 5,
      lastEventMessage: "Rescate con liquidez ejecutado."
    };
  }

  if (choice === "SELL_ASSETS") {
    const nextScore = state.score + 25;
    return {
      ...state,
      score: nextScore,
      scoreHistory: [...state.scoreHistory, nextScore],
      scoreTimeline: [...state.scoreTimeline, createScorePoint(nextScore, "Venta de activos")],
      marketStatus: calculateMarketStatus(nextScore, config),
      accumulatedWildcards: [],
      lastScoreDelta: 25,
      lastDrinkPenalty: 0,
      lastEventMessage: "Venta de activos ejecutada. Catalizadores liquidados."
    };
  }

  if (choice === "EXTRA_AUDIT_SUCCESS") {
    return {
      ...state,
      score: 90,
      scoreHistory: [...state.scoreHistory, 90],
      scoreTimeline: [...state.scoreTimeline, createScorePoint(90, "Auditoría extraordinaria superada")],
      marketStatus: calculateMarketStatus(90, config),
      lastScoreDelta: 90 - state.score,
      lastDrinkPenalty: 0,
      lastEventMessage: "Auditoría extraordinaria superada."
    };
  }

  return {
    ...state,
    score: 50,
    scoreHistory: [...state.scoreHistory, 50],
    scoreTimeline: [...state.scoreTimeline, createScorePoint(50, "Auditoría extraordinaria fallida")],
    marketStatus: calculateMarketStatus(50, config),
    totalDrinks: state.totalDrinks + 5,
    lastScoreDelta: 50 - state.score,
    lastDrinkPenalty: 5,
    lastEventMessage: "Auditoría extraordinaria fallida."
  };
}
