import { calculateRoundResultScore } from "./scoreEngine";
import { createSampleState, sampleRound } from "../test/fixtures";

describe("calculateRoundResultScore", () => {
  it("applies the extra penalty while the market is in critical zone", () => {
    const result = calculateRoundResultScore(
      createSampleState({ score: 65, marketStatus: "CRITICAL_ZONE" }),
      sampleRound,
      "FAILURE"
    );

    expect(result.scoreDelta).toBe(-20);
    expect(result.drinks).toBe(4);
    expect(result.appliedEffectLabels).toContain("Recargo por Zona Crítica");
  });
});

