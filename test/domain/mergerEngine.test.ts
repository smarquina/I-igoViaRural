import { buildMergerAttempt, resolveMergerAttempt } from "../../src/domain/mergerEngine";
import type { GeneralCultureQuestion, StreetChallenge } from "../../src/domain/types";
import { sampleRound } from "../fixtures";

const sampleChallenge: StreetChallenge = {
  id: "street-challenge-test",
  title: "Reto de calle",
  text: "Completa un reto.",
  instructions: ["Pedir ayuda", "Resolver el reto"],
  examplePitch: "¿Nos ayudas con una prueba?",
  successCriteria: "Superado si participa alguien externo.",
  failureCriteria: "Fallido si nadie participa.",
  successScore: 15,
  failureScorePenalty: 10,
  failureDrinks: 2,
  safetyNote: "No insistir."
};

const sampleCultureQuestion: GeneralCultureQuestion = {
  id: "culture-test",
  type: "GENERAL_CULTURE",
  title: "Cultura general",
  text: "¿Capital de Francia?",
  answer: "París.",
  successScore: 15,
  partialSuccessScore: 8,
  failureScorePenalty: 10,
  failureDrinks: 2,
  allowsPartial: true,
  requiresAnswerReveal: true
};

describe("mergerEngine", () => {
  it("builds the due diligence with bride question, street challenge and general culture", () => {
    const phases = buildMergerAttempt([sampleRound], [sampleChallenge], [sampleCultureQuestion], () => 0);

    expect(phases.map((phase) => phase.kind)).toEqual(["BRIDE_QUESTION", "STREET_CHALLENGE", "GENERAL_CULTURE"]);
    expect(phases[0].text).toBe(sampleRound.text);
    expect(phases[1].instructions).toEqual(sampleChallenge.instructions);
    expect(phases[2].answer).toBe(sampleCultureQuestion.answer);
  });

  it("resolves failed phases so penalties can be applied by the game engine", () => {
    const phases = buildMergerAttempt([sampleRound], [sampleChallenge], [sampleCultureQuestion], () => 0);
    const resolution = resolveMergerAttempt(phases, [
      { phaseId: phases[0].id, outcome: "SUCCESS" },
      { phaseId: phases[1].id, outcome: "PARTIAL" },
      { phaseId: phases[2].id, outcome: "FAILURE" }
    ]);

    expect(resolution.successfulPhases).toBe(1);
    expect(resolution.passedPhases.map((phase) => phase.kind)).toEqual(["BRIDE_QUESTION"]);
    expect(resolution.partialPhases.map((phase) => phase.kind)).toEqual(["STREET_CHALLENGE"]);
    expect(resolution.failedPhases.map((phase) => phase.kind)).toEqual(["GENERAL_CULTURE"]);
  });
});
