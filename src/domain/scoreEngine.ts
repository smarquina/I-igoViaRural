import {
  CRITICAL_ZONE_EXTRA_DRINKS,
  CRITICAL_ZONE_EXTRA_SCORE_PENALTY,
  ORDINARY_MAX_DRINKS
} from "./constants";
import type { GameEffect, GameState, Round, RoundResult, ScoreResult } from "./types";

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

function applyEffect(result: ScoreResult, effect: GameEffect, roundResult: RoundResult): ScoreResult {
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

  if (effect.type === "LOSS_LIMIT" && roundResult === "FAILURE") {
    next.scoreDelta = Math.max(next.scoreDelta, -(effect.maxScorePenalty ?? 5));
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
  const withEffects = state.activeEffects.reduce(
    (result, effect) => applyEffect(result, effect, roundResult),
    baseResult
  );

  if (roundResult === "FAILURE" && state.marketStatus === "CRITICAL_ZONE") {
    return {
      scoreDelta: withEffects.scoreDelta - CRITICAL_ZONE_EXTRA_SCORE_PENALTY,
      drinks: Math.min(withEffects.drinks + CRITICAL_ZONE_EXTRA_DRINKS, ORDINARY_MAX_DRINKS),
      appliedEffectLabels: [...withEffects.appliedEffectLabels, "Recargo por Zona Crítica"]
    };
  }

  return {
    ...withEffects,
    drinks: Math.min(withEffects.drinks, ORDINARY_MAX_DRINKS)
  };
}

