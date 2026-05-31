import { hasLimitedLiquidity, upsertEffect } from "./effectEngine";
import { calculateMarketStatus } from "./marketStatusEngine";
import type { AppConfig, GameEffect, GameState, Wildcard } from "./types";
import { copy } from "../lang";

function createScorePoint(score: number, event: string) {
  return {
    score,
    timestamp: new Date().toISOString(),
    event
  };
}

export function canUseWildcard(state: GameState, wildcard: Wildcard): boolean {
  if (state.phase !== "ANSWERING" || state.hasUsedWildcardThisRound) {
    return false;
  }

  if (wildcard.isDefensive && hasLimitedLiquidity(state.activeEffects)) {
    return false;
  }

  return true;
}

export function isPositiveWildcard(wildcard: Wildcard): boolean {
  return wildcard.type === "GOOD" || wildcard.type === "SPECIAL";
}

export function applyMarketReset(state: GameState, drinks = 0, wildcardId = "wildcard-market-reset"): GameState {
  return {
    ...state,
    accumulatedWildcards: [],
    activeEffects: [],
    hasUsedWildcardThisRound: true,
    totalDrinks: state.totalDrinks + drinks,
    lastDrinkPenalty: drinks,
    lastEventMessage:
      drinks > 0
        ? copy.messages.marketResetWithCost(drinks)
        : copy.messages.marketReset,
    usedWildcardIds: [...state.usedWildcardIds, wildcardId]
  };
}

function createRoundEffect(wildcard: Wildcard): GameEffect | null {
  if (wildcard.effect.kind === "LIMIT_ROUND_LOSS") {
    return {
      id: `${wildcard.id}-effect`,
      type: "LOSS_LIMIT",
      label: wildcard.name,
      remainingRounds: 1,
      sourceWildcardId: wildcard.id,
      maxScorePenalty: wildcard.effect.maxScorePenalty,
      maxDrinks: wildcard.effect.maxDrinks
    };
  }

  if (wildcard.effect.kind === "ADD_SCORE_ON_SUCCESS") {
    return {
      id: `${wildcard.id}-effect`,
      type: "ADD_SCORE_ON_SUCCESS",
      label: wildcard.name,
      remainingRounds: 1,
      sourceWildcardId: wildcard.id,
      extraScore: wildcard.effect.extraScore
    };
  }

  if (wildcard.effect.kind === "TRANSFER_DRINKS_ON_FAILURE") {
    return {
      id: `${wildcard.id}-effect`,
      type: "TRANSFER_DRINKS_ON_FAILURE",
      label: wildcard.name,
      remainingRounds: 1,
      sourceWildcardId: wildcard.id,
      transferBaseDrinks: wildcard.effect.transferBaseDrinks,
      transferExtraDrinks: wildcard.effect.transferExtraDrinks
    };
  }

  if (
    wildcard.effect.kind === "ON_SUCCESS_DRINK_ASSIGNMENT" ||
    wildcard.effect.kind === "DELEGATE_ANSWER" ||
    wildcard.effect.kind === "GROUP_HELP" ||
    wildcard.effect.kind === "SECOND_OPINION"
  ) {
    return {
      id: `${wildcard.id}-effect`,
      type: "ROUND_RULE",
      label: wildcard.name,
      remainingRounds: 1,
      sourceWildcardId: wildcard.id,
      onSuccessDrinks:
        wildcard.effect.kind === "ON_SUCCESS_DRINK_ASSIGNMENT"
          ? wildcard.effect.drinks
          : undefined,
      onFailureDrinks:
        wildcard.effect.kind === "DELEGATE_ANSWER"
          ? wildcard.effect.onDelegateFailure?.extraDrinks
          : wildcard.effect.kind === "GROUP_HELP"
            ? wildcard.effect.helperCount * (wildcard.effect.onFailure?.helperDrinks ?? 0)
            : undefined
    };
  }

  return null;
}

export function useWildcard(state: GameState, wildcard: Wildcard, config?: AppConfig): GameState {
  if (!canUseWildcard(state, wildcard)) {
    throw new Error(copy.errors.oneWildcardPerRound);
  }

  const removeUsedWildcard = state.accumulatedWildcards.filter((item) => item.id !== wildcard.id);
  const usedWildcardIds = [...state.usedWildcardIds, wildcard.id];

  if (wildcard.effect.kind === "MARKET_RESET") {
    return {
      ...applyMarketReset(state, wildcard.effect.drinks ?? 0, wildcard.id),
      usedWildcardIds,
      accumulatedWildcards: []
    };
  }

  if (wildcard.effect.kind === "ADD_EFFECT") {
    return {
      ...state,
      accumulatedWildcards: removeUsedWildcard,
      activeEffects: upsertEffect(state.activeEffects, {
        ...wildcard.effect.effect,
        sourceWildcardId: wildcard.id
      }),
      hasUsedWildcardThisRound: true,
      usedWildcardIds,
      lastEventMessage: copy.messages.wildcardActivated(wildcard.name)
    };
  }

  const roundEffect = createRoundEffect(wildcard);

  if (roundEffect) {
    return {
      ...state,
      accumulatedWildcards: removeUsedWildcard,
      activeEffects: upsertEffect(state.activeEffects, roundEffect),
      hasUsedWildcardThisRound: true,
      usedWildcardIds,
      lastEventMessage:
        wildcard.effect.kind === "LIMIT_ROUND_LOSS"
          ? copy.messages.wildcardLimitsLoss(wildcard.name)
          : copy.messages.wildcardActivated(wildcard.name)
    };
  }

  if (wildcard.effect.kind !== "ADJUST_SCORE") {
    return {
      ...state,
      accumulatedWildcards: removeUsedWildcard,
      hasUsedWildcardThisRound: true,
      usedWildcardIds,
      lastEventMessage: copy.messages.wildcardActivated(wildcard.name)
    };
  }

  const drinks = wildcard.effect.drinks ?? 0;
  const nextScore = state.score + wildcard.effect.scoreDelta;

  return {
    ...state,
    score: nextScore,
    scoreHistory: [...state.scoreHistory, nextScore],
    scoreTimeline: [...state.scoreTimeline, createScorePoint(nextScore, wildcard.name)],
    marketStatus: calculateMarketStatus(nextScore, config),
    accumulatedWildcards: removeUsedWildcard,
    hasUsedWildcardThisRound: true,
    usedWildcardIds,
    totalDrinks: state.totalDrinks + drinks,
    lastScoreDelta: wildcard.effect.scoreDelta,
    lastDrinkPenalty: drinks,
    lastEventMessage: copy.messages.wildcardApplied(wildcard.name)
  };
}
