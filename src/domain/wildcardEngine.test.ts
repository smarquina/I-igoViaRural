import { isPositiveWildcard } from "./wildcardEngine";
import { sampleWildcard } from "../test/fixtures";
import type { Wildcard } from "./types";

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
});
