import type { GameEffect } from "./types";

export function decrementRoundEffects(effects: GameEffect[]): GameEffect[] {
  return effects
    .map((effect) => {
      if (effect.remainingRounds === undefined) {
        return effect;
      }

      return {
        ...effect,
        remainingRounds: effect.remainingRounds - 1
      };
    })
    .filter((effect) => effect.remainingRounds === undefined || effect.remainingRounds > 0);
}

export function upsertEffect(effects: GameEffect[], nextEffect: GameEffect): GameEffect[] {
  const existing = effects.find((effect) => effect.type === nextEffect.type);

  if (!existing) {
    return [...effects, nextEffect];
  }

  return effects.map((effect) => {
    if (effect.type !== nextEffect.type) {
      return effect;
    }

    return {
      ...effect,
      label: nextEffect.label,
      level: Math.min((effect.level ?? 1) + (nextEffect.level ?? 1), 5),
      remainingRounds: Math.max(effect.remainingRounds ?? 0, nextEffect.remainingRounds ?? 0) || undefined,
      maxScorePenalty: nextEffect.maxScorePenalty ?? effect.maxScorePenalty,
      maxDrinks: nextEffect.maxDrinks ?? effect.maxDrinks
    };
  });
}

export function hasLimitedLiquidity(effects: GameEffect[]): boolean {
  return effects.some((effect) => effect.type === "LIMITED_LIQUIDITY");
}

