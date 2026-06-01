import {
  CRITICAL_ZONE_EXTRA_DRINKS,
  CRITICAL_ZONE_EXTRA_SCORE_PENALTY,
  ORDINARY_MAX_DRINKS
} from "./constants";
import type { ActiveEffectType, GameEffect, GameState, Round, RoundResult, ScoreResult } from "./types";
import { copy } from "../lang";

function getBaseScore(round: Round, result: RoundResult): ScoreResult {
  if (result === "SUCCESS") {
    return {
      scoreDelta: round.successScore,
      drinks: 0,
      appliedEffectLabels: []
    };
  }

  if (result === "PARTIAL_SUCCESS") {
    return {
      scoreDelta: round.partialSuccessScore ?? Math.floor(round.successScore / 2),
      drinks: 0,
      appliedEffectLabels: []
    };
  }

  return {
    scoreDelta: -round.failureScorePenalty,
    drinks: round.failureDrinks,
    appliedEffectLabels: []
  };
}

function cloneScoreResult(result: ScoreResult): ScoreResult {
  return { ...result, appliedEffectLabels: [...result.appliedEffectLabels] };
}

function markEffectApplied(result: ScoreResult, effect: GameEffect): ScoreResult {
  result.appliedEffectLabels.push(effect.label);
  return result;
}

function applyFailureDrinkPremium(result: ScoreResult, effect: GameEffect, roundResult: RoundResult): ScoreResult {
  if (roundResult !== "FAILURE") {
    return result;
  }

  result.drinks += effect.level ?? 1;
  return markEffectApplied(result, effect);
}

function applyTransferDrinksOnFailure(
  result: ScoreResult,
  effect: GameEffect,
  round: Round,
  roundResult: RoundResult
): ScoreResult {
  if (roundResult !== "FAILURE") {
    return result;
  }

  const baseTransfer = effect.transferBaseDrinks ? Math.min(round.failureDrinks, result.drinks) : 0;
  const transferredDrinks = effect.transferExtraDrinks ? result.drinks : baseTransfer;
  result.drinks = Math.max(0, result.drinks - transferredDrinks);
  return markEffectApplied(result, effect);
}

function applyRoundRule(result: ScoreResult, effect: GameEffect, roundResult: RoundResult): ScoreResult {
  const drinks = roundResult === "SUCCESS"
    ? effect.onSuccessDrinks
    : roundResult === "FAILURE"
      ? effect.onFailureDrinks
      : undefined;

  if (!drinks) {
    return result;
  }

  result.drinks += drinks;
  return markEffectApplied(result, effect);
}

type ScoringEffectHandler = (
  result: ScoreResult,
  effect: GameEffect,
  round: Round,
  roundResult: RoundResult
) => ScoreResult;

const scoringEffectHandlers: Partial<Record<ActiveEffectType, ScoringEffectHandler>> = {
  RISK_PREMIUM: (result, effect, _round, roundResult) => applyFailureDrinkPremium(result, effect, roundResult),
  BEAR_MARKET: (result, effect, _round, roundResult) => applyFailureDrinkPremium(result, effect, roundResult),
  BULL_MARKET: (result, effect, _round, roundResult) => {
    if (roundResult !== "SUCCESS") {
      return result;
    }

    result.scoreDelta += (effect.level ?? 1) * 3;
    return markEffectApplied(result, effect);
  },
  VOLATILITY: (result, effect) => {
    const modifier = (effect.level ?? 1) * 2;
    result.scoreDelta += result.scoreDelta >= 0 ? modifier : -modifier;
    return markEffectApplied(result, effect);
  },
  LEVERAGE: (result, effect, _round, roundResult) => {
    result.scoreDelta *= 2;
    result.drinks = roundResult === "FAILURE" ? result.drinks * 2 : result.drinks;
    return markEffectApplied(result, effect);
  },
  ADD_SCORE_ON_SUCCESS: (result, effect, _round, roundResult) => {
    if (roundResult !== "SUCCESS") {
      return result;
    }

    result.scoreDelta += effect.extraScore ?? 0;
    return markEffectApplied(result, effect);
  },
  TRANSFER_DRINKS_ON_FAILURE: applyTransferDrinksOnFailure,
  ROUND_RULE: (result, effect, _round, roundResult) => applyRoundRule(result, effect, roundResult)
};

function applyScoringEffect(result: ScoreResult, effect: GameEffect, round: Round, roundResult: RoundResult): ScoreResult {
  const handler = scoringEffectHandlers[effect.type];
  const next = cloneScoreResult(result);

  return handler ? handler(next, effect, round, roundResult) : next;
}

function applyLossLimit(result: ScoreResult, effect: GameEffect, roundResult: RoundResult): ScoreResult {
  const next = { ...result, appliedEffectLabels: [...result.appliedEffectLabels] };

  if (effect.type === "LOSS_LIMIT" && roundResult === "FAILURE") {
    const limitedScoreDelta = Math.max(next.scoreDelta, -(effect.maxScorePenalty ?? 5));
    next.scoreDelta = Object.is(limitedScoreDelta, -0) ? 0 : limitedScoreDelta;
    next.drinks = Math.min(next.drinks, effect.maxDrinks ?? 1);
    next.appliedEffectLabels.push(effect.label);
  }

  return next;
}

export function calculateRoundResultScore(
  state: GameState,
  round: Round,
  roundResult: RoundResult
): ScoreResult {
  const baseResult = getBaseScore(round, roundResult);
  const lossLimitEffects = state.activeEffects.filter((effect) => effect.type === "LOSS_LIMIT");
  const scoringEffects = state.activeEffects.filter((effect) => effect.type !== "LOSS_LIMIT");
  const withScoringEffects = scoringEffects.reduce(
    (result, effect) => applyScoringEffect(result, effect, round, roundResult),
    baseResult
  );

  const withCriticalZone = roundResult === "FAILURE" && state.marketStatus === "CRITICAL_ZONE"
    ? {
        scoreDelta: withScoringEffects.scoreDelta - CRITICAL_ZONE_EXTRA_SCORE_PENALTY,
        drinks: withScoringEffects.drinks + CRITICAL_ZONE_EXTRA_DRINKS,
        appliedEffectLabels: [...withScoringEffects.appliedEffectLabels, copy.messages.criticalZoneSurcharge]
      }
    : withScoringEffects;

  const withLossLimits = lossLimitEffects.reduce(
    (result, effect) => applyLossLimit(result, effect, roundResult),
    withCriticalZone
  );

  if (roundResult === "FAILURE" && state.marketStatus === "CRITICAL_ZONE") {
    return {
      ...withLossLimits,
      drinks: Math.min(withLossLimits.drinks, ORDINARY_MAX_DRINKS)
    };
  }

  return {
    ...withLossLimits,
    drinks: Math.min(withLossLimits.drinks, ORDINARY_MAX_DRINKS)
  };
}
