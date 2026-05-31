import { calculateRoundResultScore } from "../../src/domain/scoreEngine";
import { createSampleState, sampleRound } from "../fixtures";

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

  it("applies a one-round loss limit after all failure penalties", () => {
    const result = calculateRoundResultScore(
      createSampleState({
        score: 65,
        marketStatus: "CRITICAL_ZONE",
        activeEffects: [
          {
            id: "wildcard-stop-loss-effect",
            type: "LOSS_LIMIT",
            label: "Stop Loss",
            remainingRounds: 1,
            maxScorePenalty: 0,
            maxDrinks: 1
          }
        ]
      }),
      sampleRound,
      "FAILURE"
    );

    expect(result.scoreDelta).toBe(0);
    expect(result.drinks).toBe(1);
    expect(result.appliedEffectLabels).toEqual(["Recargo por Zona Crítica", "Stop Loss"]);
  });

  it("applies success score catalysts from active effects", () => {
    const result = calculateRoundResultScore(
      createSampleState({
        activeEffects: [
          {
            id: "wildcard-dividendo-extraordinario-effect",
            type: "ADD_SCORE_ON_SUCCESS",
            label: "Dividendo extraordinario",
            remainingRounds: 1,
            extraScore: 8
          }
        ]
      }),
      sampleRound,
      "SUCCESS"
    );

    expect(result.scoreDelta).toBe(28);
    expect(result.appliedEffectLabels).toContain("Dividendo extraordinario");
  });

  it("transfers failure drinks without removing the score penalty", () => {
    const result = calculateRoundResultScore(
      createSampleState({
        activeEffects: [
          {
            id: "wildcard-seguro-de-credito-effect",
            type: "TRANSFER_DRINKS_ON_FAILURE",
            label: "Seguro de crédito",
            remainingRounds: 1,
            transferBaseDrinks: true,
            transferExtraDrinks: false
          }
        ]
      }),
      sampleRound,
      "FAILURE"
    );

    expect(result.scoreDelta).toBe(-15);
    expect(result.drinks).toBe(0);
    expect(result.appliedEffectLabels).toContain("Seguro de crédito");
  });

  it("applies round-rule drinks on their matching result", () => {
    const successResult = calculateRoundResultScore(
      createSampleState({
        activeEffects: [
          {
            id: "wildcard-profit-taking-effect",
            type: "ROUND_RULE",
            label: "Recogida de beneficios",
            remainingRounds: 1,
            onSuccessDrinks: 3
          }
        ]
      }),
      sampleRound,
      "SUCCESS"
    );
    const failureResult = calculateRoundResultScore(
      createSampleState({
        activeEffects: [
          {
            id: "wildcard-ampliacion-capital-effect",
            type: "ROUND_RULE",
            label: "Ampliación de capital",
            remainingRounds: 1,
            onFailureDrinks: 2
          }
        ]
      }),
      sampleRound,
      "FAILURE"
    );

    expect(successResult.drinks).toBe(3);
    expect(successResult.appliedEffectLabels).toContain("Recogida de beneficios");
    expect(failureResult.drinks).toBe(5);
    expect(failureResult.appliedEffectLabels).toContain("Ampliación de capital");
  });
});
