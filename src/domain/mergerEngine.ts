import type { GeneralCultureQuestion, MergerAttemptResolution, MergerPhase, MergerPhaseKind, MergerPhaseResult, Round, StreetChallenge } from "./types";

function selectRandomItem<T>(items: T[], random: () => number): T | null {
  if (items.length === 0) {
    return null;
  }

  return items[Math.floor(random() * items.length) % items.length];
}

function buildBridePhase(round: Round): MergerPhase {
  return {
    id: `merger-bride-${round.id}`,
    kind: "BRIDE_QUESTION",
    title: round.title,
    text: round.text,
    answer: round.answer,
    successScore: round.successScore,
    failureScorePenalty: round.failureScorePenalty,
    failureDrinks: round.failureDrinks
  };
}

function buildStreetChallengePhase(challenge: StreetChallenge): MergerPhase {
  return {
    id: `merger-challenge-${challenge.id}`,
    kind: "STREET_CHALLENGE",
    title: challenge.title,
    text: challenge.text,
    instructions: challenge.instructions,
    examples: challenge.requiredWordExamples ?? challenge.questionExamples ?? challenge.titleReasonExamples,
    examplePitch: challenge.examplePitch,
    successCriteria: challenge.successCriteria,
    failureCriteria: challenge.failureCriteria,
    safetyNote: challenge.safetyNote,
    successScore: challenge.successScore,
    failureScorePenalty: challenge.failureScorePenalty,
    failureDrinks: challenge.failureDrinks
  };
}

function buildGeneralCulturePhase(question: GeneralCultureQuestion | null): MergerPhase {
  if (!question) {
    return {
      id: "merger-general-culture-placeholder",
      kind: "GENERAL_CULTURE",
      title: "Pregunta de cultura general",
      text: "Pregunta pendiente de configurar. El Consejo puede formular una pregunta de cultura general manualmente.",
      successScore: 15,
      failureScorePenalty: 10,
      failureDrinks: 2
    };
  }

  return {
    id: `merger-culture-${question.id}`,
    kind: "GENERAL_CULTURE",
    title: question.title,
    text: question.text,
    answer: question.answer,
    successScore: question.successScore,
    partialSuccessScore: question.partialSuccessScore,
    failureScorePenalty: question.failureScorePenalty,
    failureDrinks: question.failureDrinks,
    allowsPartial: question.allowsPartial,
    requiresAnswerReveal: question.requiresAnswerReveal
  };
}

function buildUnavailablePhase(kind: MergerPhaseKind, title: string): MergerPhase {
  return {
    id: `merger-unavailable-${kind.toLowerCase()}`,
    kind,
    title,
    text: "Contenido pendiente de configurar. El Consejo puede formular esta fase manualmente.",
    successScore: 15,
    failureScorePenalty: 10,
    failureDrinks: 2
  };
}

export function buildMergerAttempt(
  brideQuestions: Round[],
  streetChallenges: StreetChallenge[],
  generalCultureQuestions: GeneralCultureQuestion[],
  random: () => number = Math.random
): MergerPhase[] {
  const brideQuestion = selectRandomItem(brideQuestions, random);
  const streetChallenge = selectRandomItem(streetChallenges, random);
  const generalCultureQuestion = selectRandomItem(generalCultureQuestions, random);

  return [
    brideQuestion ? buildBridePhase(brideQuestion) : buildUnavailablePhase("BRIDE_QUESTION", "Pregunta de Rocío"),
    streetChallenge ? buildStreetChallengePhase(streetChallenge) : buildUnavailablePhase("STREET_CHALLENGE", "Reto"),
    buildGeneralCulturePhase(generalCultureQuestion)
  ];
}

export function resolveMergerAttempt(phases: MergerPhase[], results: MergerPhaseResult[]): MergerAttemptResolution {
  const resultByPhaseId = new Map(results.map((result) => [result.phaseId, result.outcome]));
  const passedPhases = phases.filter((phase) => resultByPhaseId.get(phase.id) === "SUCCESS");
  const partialPhases = phases.filter((phase) => resultByPhaseId.get(phase.id) === "PARTIAL");
  const failedPhases = phases.filter((phase) => resultByPhaseId.get(phase.id) !== "SUCCESS" && resultByPhaseId.get(phase.id) !== "PARTIAL");

  return {
    successfulPhases: passedPhases.length,
    passedPhases,
    partialPhases,
    failedPhases
  };
}
