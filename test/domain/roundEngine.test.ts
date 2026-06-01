import { applyBailoutChoice, applyMergerAttemptResult, createInitialGameState, getNextRandomRoundIndex, resolveAndAdvanceRound } from "../../src/domain/roundEngine";
import { bailoutOptions } from "../../src/data/gameContent";
import type { AppConfig, Round } from "../../src/domain/types";
import { sampleRound, sampleWildcard } from "../fixtures";

const sampleConfig: AppConfig = {
  gameTitle: "Despedida ViaRural Broker",
  groomName: "Iñigo",
  brideName: "Rocío",
  initialScore: 100,
  mergerTargetScore: 190,
  hotMarketScore: 130,
  stableMarketScore: 90,
  criticalZoneScore: 70,
  bailoutScore: 40,
  ordinaryMaxDrinks: 10,
  allowPartialSuccess: true,
  maxWildcardsPerRound: 1,
  theme: "viarural",
  dataVersion: "test"
};

describe("roundEngine", () => {
  it("starts a new game without accumulated wildcards", () => {
    const state = createInitialGameState(sampleConfig);

    expect(state.accumulatedWildcards).toEqual([]);
    expect(state.hasDrawnWildcardThisRound).toBe(false);
    expect(state.lastEventMessage).toBeUndefined();
  });

  it("keeps explicit initial wildcards only when provided", () => {
    const state = createInitialGameState(sampleConfig, [sampleWildcard]);

    expect(state.accumulatedWildcards).toEqual([sampleWildcard]);
  });

  it("resolves the current question and advances to the next round", () => {
    const state = createInitialGameState(sampleConfig, [sampleWildcard]);
    const nextRound: Round = { ...sampleRound, id: "round-next", title: "Siguiente ronda" };
    const nextState = resolveAndAdvanceRound(
      {
        ...state,
        shownRoundIds: [sampleRound.id],
        hasDrawnWildcardThisRound: true,
        hasUsedWildcardThisRound: true
      },
      [sampleRound, nextRound],
      sampleRound,
      "SUCCESS",
      sampleConfig,
      () => 0
    );

    expect(nextState.currentRoundIndex).toBe(1);
    expect(nextState.roundNumber).toBe(2);
    expect(nextState.phase).toBe("ANSWERING");
    expect(nextState.score).toBe(120);
    expect(nextState.hasDrawnWildcardThisRound).toBe(false);
    expect(nextState.hasUsedWildcardThisRound).toBe(false);
    expect(nextState.shownRoundIds).toEqual([sampleRound.id, nextRound.id]);
    expect(nextState.resolvedRoundIds).toContain(sampleRound.id);
  });

  it("selects a random unresolved round index and skips already resolved IDs", () => {
    const rounds: Round[] = [
      { ...sampleRound, id: "round-1" },
      { ...sampleRound, id: "round-2" },
      { ...sampleRound, id: "round-3" }
    ];

    expect(getNextRandomRoundIndex(rounds, ["round-1"], () => 0)).toBe(1);
    expect(getNextRandomRoundIndex(rounds, ["round-1"], () => 0.99)).toBe(2);
  });

  it("penalizes failed merger phases when due diligence is not approved", () => {
    const state = createInitialGameState({ ...sampleConfig, initialScore: 190 });
    const nextState = applyMergerAttemptResult(
      state,
      {
        successfulPhases: 1,
        passedPhases: [
          {
            id: "merger-bride-test",
            kind: "BRIDE_QUESTION",
            title: "Rocío",
            text: "Pregunta acertada",
            successScore: 20,
            failureScorePenalty: 15,
            failureDrinks: 3
          }
        ],
        partialPhases: [],
        failedPhases: [
          {
            id: "merger-challenge-test",
            kind: "STREET_CHALLENGE",
            title: "Reto",
            text: "Reto fallido",
            successScore: 15,
            failureScorePenalty: 10,
            failureDrinks: 2
          },
          {
            id: "merger-culture-test",
            kind: "GENERAL_CULTURE",
            title: "Cultura",
            text: "Pregunta fallida",
            successScore: 15,
            failureScorePenalty: 12,
            failureDrinks: 3
          }
        ]
      },
      sampleConfig
    );

    expect(nextState.score).toBe(188);
    expect(nextState.totalDrinks).toBe(5);
    expect(nextState.lastScoreDelta).toBe(-2);
    expect(nextState.lastDrinkPenalty).toBe(5);
    expect(nextState.isGameFinished).toBe(false);
  });

  it("moves bailout challenge success to 80 points", () => {
    const state = createInitialGameState({ ...sampleConfig, initialScore: 35 });
    const nextState = applyBailoutChoice(state, "STREET_CHALLENGE_SUCCESS", bailoutOptions, sampleConfig);

    expect(nextState.score).toBe(80);
    expect(nextState.lastScoreDelta).toBe(45);
    expect(nextState.lastDrinkPenalty).toBe(0);
  });

  it("applies the collective bailout to 60 points with group beer penalty", () => {
    const state = createInitialGameState({ ...sampleConfig, initialScore: 35 });
    const nextState = applyBailoutChoice(state, "GROUP_BEER_FAILURE", bailoutOptions, sampleConfig);

    expect(nextState.score).toBe(60);
    expect(nextState.totalDrinks).toBe(5);
    expect(nextState.lastScoreDelta).toBe(25);
    expect(nextState.lastDrinkPenalty).toBe(5);
  });
});
