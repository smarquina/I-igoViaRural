import { isPositiveWildcard, useWildcard } from "../../src/domain/wildcardEngine";
import { sampleWildcard } from "../fixtures";
import type { Wildcard } from "../../src/domain/types";
import { createSampleState } from "../fixtures";

const badWildcard: Wildcard = {
  ...sampleWildcard,
  id: "wildcard-negative",
  name: "Liquidez limitada",
  type: "BAD",
  description: "Bloquea catalizadores defensivos durante dos rondas.",
  isDefensive: false,
  effect: {
    kind: "ADD_EFFECT",
    effect: {
      id: "effect-limited-liquidity",
      type: "LIMITED_LIQUIDITY",
      label: "Liquidez limitada",
      remainingRounds: 2
    }
  }
};

describe("wildcardEngine", () => {
  it("classifies good and special cards as positive decisions", () => {
    expect(isPositiveWildcard(sampleWildcard)).toBe(true);
    expect(isPositiveWildcard({ ...sampleWildcard, type: "SPECIAL" })).toBe(true);
  });

  it("classifies bad and mixed cards as immediate negative effects", () => {
    expect(isPositiveWildcard(badWildcard)).toBe(false);
    expect(isPositiveWildcard({ ...badWildcard, type: "MIXED" })).toBe(false);
  });

  it("turns round-scoped score catalysts into active effects", () => {
    const wildcard: Wildcard = {
      ...sampleWildcard,
      id: "wildcard-dividendo-extraordinario",
      name: "Dividendo extraordinario",
      effect: {
        kind: "ADD_SCORE_ON_SUCCESS",
        extraScore: 8
      }
    };
    const nextState = useWildcard(createSampleState({ accumulatedWildcards: [wildcard] }), wildcard);

    expect(nextState.accumulatedWildcards).toEqual([]);
    expect(nextState.hasUsedWildcardThisRound).toBe(true);
    expect(nextState.activeEffects).toContainEqual(
      expect.objectContaining({
        type: "ADD_SCORE_ON_SUCCESS",
        label: "Dividendo extraordinario",
        extraScore: 8,
        remainingRounds: 1
      })
    );
  });

  it("turns supported round-rule catalysts into active effects without changing score", () => {
    const wildcard: Wildcard = {
      ...sampleWildcard,
      id: "wildcard-ampliacion-capital",
      name: "Ampliación de capital",
      effect: {
        kind: "GROUP_HELP",
        helperCount: 2,
        forbiddenRoundTypes: ["INTERNAL_AUDIT"],
        resultAppliesToGroom: true,
        onFailure: {
          helperDrinks: 1
        }
      }
    };
    const nextState = useWildcard(createSampleState({ accumulatedWildcards: [wildcard] }), wildcard);

    expect(nextState.score).toBe(100);
    expect(nextState.scoreHistory).toEqual([100, 100]);
    expect(nextState.activeEffects).toContainEqual(
      expect.objectContaining({
        type: "ROUND_RULE",
        label: "Ampliación de capital",
        onFailureDrinks: 2,
        remainingRounds: 1
      })
    );
  });
});
