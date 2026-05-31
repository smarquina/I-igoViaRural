import {
  CRITICAL_ZONE_EXTRA_DRINKS,
  CRITICAL_ZONE_EXTRA_SCORE_PENALTY,
  ORDINARY_MAX_DRINKS
} from "./constants";
import type { GameEffect, GameState, Round, RoundResult, ScoreResult } from "./types";
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

function applyScoringEffect(result: ScoreResult, effect: GameEffect, round: Round, roundResult: RoundResult): ScoreResult {
  const next = { ...result, appliedEffectLabels: [...result.appliedEffectLabels] };

  if (effect.type === "RISK_PREMIUM" && roundResult === "FAILURE") {
    next.drinks += effect.level ?? 1;
    next.appliedEffectLabels.push(effect.label);
  }

  if (effect.type === "BEAR_MARKET" && roundResult === "FAILURE") {
    next.drinks += effect.level ?? 1;
    next.appliedEffectLabels.push(effect.label);
  }

  if (effect.type === "BULL_MARKET" && roundResult === "SUCCESS") {
    next.scoreDelta += (effect.level ?? 1) * 3;
    next.appliedEffectLabels.push(effect.label);
  }

  if (effect.type === "VOLATILITY") {
    const modifier = (effect.level ?? 1) * 2;
    next.scoreDelta += next.scoreDelta >= 0 ? modifier : -modifier;
    next.appliedEffectLabels.push(effect.label);
  }

  if (effect.type === "LEVERAGE") {
    next.scoreDelta *= 2;
    if (roundResult === "FAILURE") {
      next.drinks *= 2;
    }
    next.appliedEffectLabels.push(effect.label);
  }

  if (effect.type === "ADD_SCORE_ON_SUCCESS" && roundResult === "SUCCESS") {
    next.scoreDelta += effect.extraScore ?? 0;
    next.appliedEffectLabels.push(effect.label);
  }

  if (effect.type === "TRANSFER_DRINKS_ON_FAILURE" && roundResult === "FAILURE") {
    let transferredDrinks = 0;

    if (effect.transferBaseDrinks) {
      transferredDrinks += Math.min(round.failureDrinks, next.drinks);
    }

    if (effect.transferExtraDrinks) {
      transferredDrinks = next.drinks;
    }

    next.drinks = Math.max(0, next.drinks - transferredDrinks);
    next.appliedEffectLabels.push(effect.label);
  }

  if (effect.type === "ROUND_RULE") {
    if (roundResult === "SUCCESS" && effect.onSuccessDrinks) {
      next.drinks += effect.onSuccessDrinks;
      next.appliedEffectLabels.push(effect.label);
    }

    if (roundResult === "FAILURE" && effect.onFailureDrinks) {
      next.drinks += effect.onFailureDrinks;
      next.appliedEffectLabels.push(effect.label);
    }
  }

  return next;
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
