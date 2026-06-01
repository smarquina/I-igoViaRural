import { hasLimitedLiquidity, upsertEffect } from "./effectEngine";
import { calculateMarketStatus } from "./marketStatusEngine";
import type { AppConfig, GameEffect, GameState, Wildcard, WildcardEffect } from "./types";
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

type RoundEffectFactory = (wildcard: Wildcard) => GameEffect | null;

function createBaseRoundEffect(wildcard: Wildcard): Pick<GameEffect, "id" | "label" | "remainingRounds" | "sourceWildcardId"> {
  return {
    id: `${wildcard.id}-effect`,
    label: wildcard.name,
    remainingRounds: 1,
    sourceWildcardId: wildcard.id
  };
}

function getRoundRuleDrinks(effect: WildcardEffect) {
  if (effect.kind === "ON_SUCCESS_DRINK_ASSIGNMENT") {
    return { onSuccessDrinks: effect.drinks };
  }

  if (effect.kind === "DELEGATE_ANSWER") {
    return { onFailureDrinks: effect.onDelegateFailure?.extraDrinks };
  }

  if (effect.kind === "GROUP_HELP") {
    return { onFailureDrinks: effect.helperCount * (effect.onFailure?.helperDrinks ?? 0) };
  }

  return {};
}

const roundEffectFactories: Partial<Record<WildcardEffect["kind"], RoundEffectFactory>> = {
  LIMIT_ROUND_LOSS: (wildcard) => wildcard.effect.kind === "LIMIT_ROUND_LOSS"
    ? {
        ...createBaseRoundEffect(wildcard),
        type: "LOSS_LIMIT",
        maxScorePenalty: wildcard.effect.maxScorePenalty,
        maxDrinks: wildcard.effect.maxDrinks
      }
    : null,
  ADD_SCORE_ON_SUCCESS: (wildcard) => wildcard.effect.kind === "ADD_SCORE_ON_SUCCESS"
    ? {
        ...createBaseRoundEffect(wildcard),
        type: "ADD_SCORE_ON_SUCCESS",
        extraScore: wildcard.effect.extraScore
      }
    : null,
  TRANSFER_DRINKS_ON_FAILURE: (wildcard) => wildcard.effect.kind === "TRANSFER_DRINKS_ON_FAILURE"
    ? {
        ...createBaseRoundEffect(wildcard),
        type: "TRANSFER_DRINKS_ON_FAILURE",
        transferBaseDrinks: wildcard.effect.transferBaseDrinks,
        transferExtraDrinks: wildcard.effect.transferExtraDrinks
      }
    : null,
  ON_SUCCESS_DRINK_ASSIGNMENT: (wildcard) => ({
    ...createBaseRoundEffect(wildcard),
    type: "ROUND_RULE",
    ...getRoundRuleDrinks(wildcard.effect)
  }),
  DELEGATE_ANSWER: (wildcard) => ({
    ...createBaseRoundEffect(wildcard),
    type: "ROUND_RULE",
    ...getRoundRuleDrinks(wildcard.effect)
  }),
  GROUP_HELP: (wildcard) => ({
    ...createBaseRoundEffect(wildcard),
    type: "ROUND_RULE",
    ...getRoundRuleDrinks(wildcard.effect)
  }),
  SECOND_OPINION: (wildcard) => ({
    ...createBaseRoundEffect(wildcard),
    type: "ROUND_RULE"
  })
};

function createRoundEffect(wildcard: Wildcard): GameEffect | null {
  return roundEffectFactories[wildcard.effect.kind]?.(wildcard) ?? null;
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
