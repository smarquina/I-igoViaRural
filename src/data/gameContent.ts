import auditData from "./bride-audit.json";
import bailoutOptionsData from "./bailout-options.json";
import configData from "./config.json";
import generalCultureQuestionsData from "./general-culture-questions.json";
import roundsData from "./rounds.json";
import streetChallengesData from "./street-challenges.json";
import wildcardsData from "./wildcards.json";
import { buildRoundDeck } from "../domain/roundEngine";
import type { AppConfig, BailoutOption, GeneralCultureQuestion, Round, StreetChallenge, Wildcard } from "../domain/types";
import { copy } from "../lang";

type RawRound = Omit<Round, "title" | "text" | "answer">;
type RawAuditRound = Omit<Round, "text"> & { question: string };
type RoundContent = { title: string; text: string; answer?: string };
type WildcardContent = Partial<Pick<Wildcard, "name" | "description">>;
type RawWildcard = Wildcard & {
  effect: Wildcard["effect"] | { kind: string; effect?: Partial<Wildcard["effect"] extends { effect: infer Effect } ? Effect : never> };
};

const roundContentById = copy.gameContent.rounds as Record<string, RoundContent>;
const wildcardContentById = copy.gameContent.wildcards as Record<string, WildcardContent>;
const effectLabelById = copy.gameContent.effectLabels as Record<string, string>;

function hydrateRound(round: RawRound): Round {
  const content = roundContentById[round.id];

  return {
    ...round,
    title: content.title,
    text: content.text,
    ...(content.answer ? { answer: content.answer } : {})
  };
}

function hydrateAuditRound(round: RawAuditRound): Round {
  const { question, ...roundData } = round;

  return {
    ...roundData,
    text: question,
    ...(round.answer ? { answer: round.answer } : {})
  };
}

function hydrateWildcard(wildcard: RawWildcard): Wildcard {
  const content = wildcardContentById[wildcard.id] ?? {};
  const effect = wildcard.effect.kind === "ADD_EFFECT"
    ? {
        ...wildcard.effect,
        effect: {
          ...wildcard.effect.effect,
          label: effectLabelById[wildcard.effect.effect?.id ?? ""] ?? wildcard.effect.effect?.label
        }
      }
    : wildcard.effect;

  return {
    ...wildcard,
    name: content.name ?? wildcard.name,
    description: content.description ?? wildcard.description,
    effect: effect as Wildcard["effect"]
  };
}

export const defaultConfig = { ...configData, gameTitle: copy.app.gameTitle } as AppConfig;
export const rounds = (roundsData as RawRound[]).map(hydrateRound);
export const auditQuestions = (auditData as RawAuditRound[]).map(hydrateAuditRound);
export const availableWildcards = (wildcardsData as RawWildcard[]).map(hydrateWildcard);
export const bailoutOptions = bailoutOptionsData as BailoutOption[];
export const streetChallenges = streetChallengesData as StreetChallenge[];
export const generalCultureQuestions = generalCultureQuestionsData as GeneralCultureQuestion[];
export const roundDeck = buildRoundDeck(rounds, auditQuestions);
