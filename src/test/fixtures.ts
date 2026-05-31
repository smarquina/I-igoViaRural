import { calculateMarketStatus } from "../domain/marketStatusEngine";
import type { AppConfig, GameState, Round, Wildcard } from "../domain/types";

export const sampleConfig: AppConfig = {
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
  theme: "rural-broker",
  dataVersion: "test"
};

export const sampleRound: Round = {
  id: "round-test",
  type: "INTERNAL_AUDIT",
  title: "Auditoría interna de Rocío",
  text: "¿Cuál es la respuesta auditada?",
  answer: "La respuesta correcta.",
  successScore: 20,
  partialSuccessScore: 10,
  failureScorePenalty: 15,
  failureDrinks: 3,
  allowsPartial: true,
  requiresAnswerReveal: true
};

export const sampleWildcard: Wildcard = {
  id: "wildcard-stop-loss",
  name: "Stop Loss",
  type: "GOOD",
  timing: "BEFORE_ANSWER",
  description: "Limita la pérdida de esta ronda.",
  effect: {
    kind: "LIMIT_ROUND_LOSS",
    maxScorePenalty: 5,
    maxDrinks: 1
  },
  isImmediate: false,
  isAccumulated: true,
  isDefensive: true
};

export function createSampleState(overrides: Partial<GameState> = {}): GameState {
  const score = overrides.score ?? 100;

  return {
    groomName: "Iñigo",
    brideName: "Rocío",
    score,
    currentRoundIndex: 0,
    marketStatus: calculateMarketStatus(score),
    accumulatedWildcards: [sampleWildcard],
    activeEffects: [],
    hasUsedWildcardThisRound: false,
    hasDrawnWildcardThisRound: false,
    scoreHistory: [100, score],
    scoreTimeline: [
      { score: 100, timestamp: "2026-05-30T09:00:00.000Z", event: "Apertura de sesión" },
      { score, timestamp: "2026-05-30T09:05:00.000Z", event: "Ronda de prueba" }
    ],
    totalDrinks: 0,
    totalSuccesses: 0,
    totalFailures: 0,
    totalPartialSuccesses: 0,
    usedWildcardIds: [],
    shownRoundIds: [sampleRound.id],
    resolvedRoundIds: [],
    isGameFinished: false,
    gameResult: "IN_PROGRESS",
    phase: "ANSWERING",
    lastScoreDelta: 0,
    lastDrinkPenalty: 0,
    ...overrides
  };
}
