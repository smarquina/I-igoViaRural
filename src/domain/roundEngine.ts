import { decrementRoundEffects } from "./effectEngine";
import { calculateMarketStatus } from "./marketStatusEngine";
import { calculateRoundResultScore } from "./scoreEngine";
import type { AppConfig, BailoutChoice, BailoutMessage, BailoutOption, BailoutTimelineEvent, GameState, MergerAttemptResolution, Round, RoundResult, Wildcard } from "./types";
import { copy } from "../lang";

const bailoutTimelineEvents: Record<BailoutTimelineEvent, string> = {
  bailoutLiquidity: copy.timeline.bailoutLiquidity,
  assetSale: copy.timeline.assetSale,
  streetChallengeBailout: copy.timeline.streetChallengeBailout,
  extraordinaryGroupAudit: copy.timeline.extraordinaryGroupAudit,
  groupBeerBailout: copy.timeline.groupBeerBailout
};

const bailoutMessages: Record<BailoutMessage, string> = {
  bailoutLiquidity: copy.messages.bailoutLiquidity,
  assetSale: copy.messages.assetSale,
  streetChallengeBailout: copy.messages.streetChallengeBailout,
  extraordinaryGroupAudit: copy.messages.extraordinaryGroupAudit,
  groupBeerBailout: copy.messages.groupBeerBailout
};

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
  const createdAt = new Date().toISOString();

  return {
    updatedAt: createdAt,
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
    scoreTimeline: [
      {
        score: config.initialScore,
        timestamp: createdAt,
        event: copy.timeline.sessionOpening
      }
    ],
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
  const breaksNegotiations = nextScore <= (config?.negotiationBreakScore ?? 0);

  return {
    ...state,
    score: nextScore,
    marketStatus: calculateMarketStatus(nextScore, config),
    scoreHistory: [...state.scoreHistory, nextScore],
    scoreTimeline: [...state.scoreTimeline, createScorePoint(nextScore, copy.timeline.roundEvent(state.roundNumber, round.title))],
    totalDrinks: state.totalDrinks + scoreResult.drinks,
    totalSuccesses: state.totalSuccesses + (result === "SUCCESS" ? 1 : 0),
    totalFailures: state.totalFailures + (result === "FAILURE" ? 1 : 0),
    totalPartialSuccesses: state.totalPartialSuccesses + (result === "PARTIAL_SUCCESS" ? 1 : 0),
    resolvedRoundIds: [...state.resolvedRoundIds, round.id],
    phase: "RESOLVED",
    isGameFinished: breaksNegotiations,
    gameResult: breaksNegotiations ? "NEGOTIATIONS_BROKEN" : state.gameResult,
    lastScoreDelta: scoreResult.scoreDelta,
    lastDrinkPenalty: scoreResult.drinks,
    lastEventMessage:
      breaksNegotiations ? copy.messages.negotiationsBroken : scoreResult.appliedEffectLabels.length > 0
        ? copy.messages.appliedEffects(scoreResult.appliedEffectLabels)
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

  if (resolvedState.isGameFinished) {
    return resolvedState;
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

export function applyMergerAttemptResult(state: GameState, resolution: MergerAttemptResolution, config?: AppConfig): GameState {
  const successScore = resolution.passedPhases.reduce((total, phase) => total + phase.successScore, 0);
  const partialScore = resolution.partialPhases.reduce((total, phase) => total + (phase.partialSuccessScore ?? 0), 0);
  const earnedScore = successScore + partialScore;

  if (resolution.successfulPhases >= 2) {
    const nextScore = state.score + earnedScore;

    return {
      ...state,
      score: nextScore,
      scoreHistory: [...state.scoreHistory, nextScore],
      scoreTimeline: [...state.scoreTimeline, createScorePoint(nextScore, copy.messages.mergerApproved)],
      marketStatus: calculateMarketStatus(nextScore, config),
      isGameFinished: true,
      gameResult: "MERGER_APPROVED",
      lastScoreDelta: earnedScore,
      lastDrinkPenalty: 0,
      lastEventMessage: copy.messages.mergerApproved
    };
  }

  const scorePenalty = resolution.failedPhases.reduce((total, phase) => total + phase.failureScorePenalty, 0);
  const drinks = resolution.failedPhases.reduce((total, phase) => total + phase.failureDrinks, 0);
  const scoreDelta = earnedScore - scorePenalty;
  const nextScore = state.score + scoreDelta;

  return {
    ...state,
    score: nextScore,
    scoreHistory: [...state.scoreHistory, nextScore],
    scoreTimeline: [...state.scoreTimeline, createScorePoint(nextScore, copy.timeline.mergerFailed)],
    marketStatus: calculateMarketStatus(nextScore, config),
    totalDrinks: state.totalDrinks + drinks,
    lastScoreDelta: scoreDelta,
    lastDrinkPenalty: drinks,
    lastEventMessage: copy.messages.mergerFailedWithPenalty(scorePenalty, earnedScore, drinks)
  };
}

export function applyBailoutChoice(
  state: GameState,
  choice: BailoutChoice,
  bailoutOptions: BailoutOption[],
  config?: AppConfig
): GameState {
  const option = bailoutOptions.find((item) => item.id === choice);

  if (!option) {
    return state;
  }

  const nextScore = option.effect.scoreMode === "SET"
    ? option.effect.targetScore ?? state.score
    : state.score + (option.effect.scoreDelta ?? 0);

  return {
    ...state,
    score: nextScore,
    scoreHistory: [...state.scoreHistory, nextScore],
    scoreTimeline: [...state.scoreTimeline, createScorePoint(nextScore, bailoutTimelineEvents[option.effect.timelineEvent])],
    marketStatus: calculateMarketStatus(nextScore, config),
    totalDrinks: state.totalDrinks + option.effect.drinks,
    accumulatedWildcards: option.effect.clearsWildcards ? [] : state.accumulatedWildcards,
    lastScoreDelta: nextScore - state.score,
    lastDrinkPenalty: option.effect.drinks,
    lastEventMessage: bailoutMessages[option.effect.message]
  };
}
