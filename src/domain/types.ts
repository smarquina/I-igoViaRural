export type MarketStatus =
  | "MERGER_ATTEMPT"
  | "HOT_MARKET"
  | "STABLE_MARKET"
  | "WEAK_MARKET"
  | "CRITICAL_ZONE"
  | "BAILOUT_REQUIRED";

export type RoundType =
  | "INTERNAL_AUDIT"
  | "SENTIMENTAL_MARKET"
  | "BANKING_STOCK_MARKET"
  | "HOSTILE_TAKEOVER"
  | "GAMBLER_QUESTION"
  | "MARKET_ROAST"
  | "STREET_CHALLENGE"
  | "MARKET_EVENT";

export type RoundResult = "SUCCESS" | "PARTIAL_SUCCESS" | "FAILURE";

export type WildcardType = "GOOD" | "BAD" | "MIXED" | "SPECIAL";

export type WildcardTiming =
  | "BEFORE_ANSWER"
  | "AFTER_ANSWER"
  | "IMMEDIATE"
  | "ON_FAILURE"
  | "ON_SUCCESS";

export type ActiveEffectType =
  | "RISK_PREMIUM"
  | "VOLATILITY"
  | "BEAR_MARKET"
  | "BULL_MARKET"
  | "LEVERAGE"
  | "LIMITED_LIQUIDITY"
  | "LOSS_LIMIT"
  | "ADD_SCORE_ON_SUCCESS"
  | "TRANSFER_DRINKS_ON_FAILURE"
  | "ROUND_RULE";

export type GameResult = "MERGER_APPROVED" | "MANUAL_END" | "IN_PROGRESS";

export type GamePhase = "ANSWERING" | "RESOLVED";

export type WildcardEffect =
  | {
      kind: "LIMIT_ROUND_LOSS";
      maxScorePenalty: number;
      maxDrinks: number;
    }
  | {
      kind: "ADD_EFFECT";
      effect: GameEffect;
    }
  | {
      kind: "ADJUST_SCORE";
      scoreDelta: number;
      drinks?: number;
    }
  | {
      kind: "MARKET_RESET";
      drinks?: number;
    }
  | {
      kind: "ADD_SCORE_ON_SUCCESS";
      extraScore: number;
    }
  | {
      kind: "TRANSFER_DRINKS_ON_FAILURE";
      target: "GROUP_MEMBER" | "OTHER_PLAYER";
      transferBaseDrinks: boolean;
      transferExtraDrinks: boolean;
      scorePenaltyStillApplies: boolean;
    }
  | {
      kind: "ON_SUCCESS_DRINK_ASSIGNMENT";
      target: "GROUP_MEMBER" | "OTHER_PLAYER";
      drinks: number;
      requiresSuccess: boolean;
    }
  | {
      kind: "DELEGATE_ANSWER";
      delegateCanBe: Array<"GROUP_MEMBER" | "STRANGER">;
      forbiddenRoundTypes?: RoundType[];
      resultAppliesToGroom: boolean;
      onDelegateFailure?: {
        extraDrinks: number;
      };
    }
  | {
      kind: "GROUP_HELP";
      helperCount: number;
      forbiddenRoundTypes?: RoundType[];
      resultAppliesToGroom: boolean;
      onFailure?: {
        helperDrinks: number;
      };
    }
  | {
      kind: "SECOND_OPINION";
      delegateCanBe: Array<"GROUP_MEMBER" | "STRANGER">;
      forbiddenRoundTypes?: RoundType[];
      resultAppliesToGroom: boolean;
    };

export interface AppConfig {
  gameTitle: string;
  groomName: string;
  brideName: string;
  initialScore: number;
  mergerTargetScore: number;
  hotMarketScore: number;
  stableMarketScore: number;
  criticalZoneScore: number;
  bailoutScore: number;
  ordinaryMaxDrinks: number;
  allowPartialSuccess: boolean;
  maxWildcardsPerRound: number;
  theme: string;
  dataVersion: string;
}

export interface Round {
  id: string;
  type: RoundType;
  title: string;
  text: string;
  answer?: string;
  successScore: number;
  partialSuccessScore?: number;
  failureScorePenalty: number;
  failureDrinks: number;
  allowsPartial: boolean;
  requiresAnswerReveal: boolean;
}

export interface Wildcard {
  id: string;
  name: string;
  type: WildcardType;
  timing: WildcardTiming;
  description: string;
  effect: WildcardEffect;
  isImmediate: boolean;
  isAccumulated: boolean;
  isDefensive: boolean;
}

export interface GameEffect {
  id: string;
  type: ActiveEffectType;
  label: string;
  level?: number;
  remainingRounds?: number;
  sourceWildcardId?: string;
  maxScorePenalty?: number;
  maxDrinks?: number;
  extraScore?: number;
  onSuccessDrinks?: number;
  onFailureDrinks?: number;
  transferBaseDrinks?: boolean;
  transferExtraDrinks?: boolean;
}

export interface ScoreTimelinePoint {
  score: number;
  timestamp: string;
  event: string;
}

export interface GameState {
  groomName: string;
  brideName: string;
  score: number;
  currentRoundIndex: number;
  roundNumber: number;
  marketStatus: MarketStatus;
  accumulatedWildcards: Wildcard[];
  activeEffects: GameEffect[];
  hasUsedWildcardThisRound: boolean;
  hasDrawnWildcardThisRound: boolean;
  scoreHistory: number[];
  scoreTimeline: ScoreTimelinePoint[];
  totalDrinks: number;
  totalSuccesses: number;
  totalFailures: number;
  totalPartialSuccesses: number;
  usedWildcardIds: string[];
  shownRoundIds: string[];
  resolvedRoundIds: string[];
  isGameFinished: boolean;
  gameResult: GameResult;
  phase: GamePhase;
  lastScoreDelta: number;
  lastDrinkPenalty: number;
  lastEventMessage?: string;
}

export interface ScoreResult {
  scoreDelta: number;
  drinks: number;
  appliedEffectLabels: string[];
}

export type BailoutChoice = "LIQUIDITY" | "SELL_ASSETS" | "EXTRA_AUDIT_SUCCESS" | "EXTRA_AUDIT_FAILURE";

export interface StreetChallenge {
  id: string;
  title: string;
  text: string;
  instructions: string[];
  examplePitch?: string;
  requiredWordExamples?: string[];
  questionExamples?: string[];
  titleReasonExamples?: string[];
  successCriteria: string;
  failureCriteria: string;
  successScore: number;
  failureScorePenalty: number;
  failureDrinks: number;
  safetyNote: string;
}

export interface GeneralCultureQuestion {
  id: string;
  type: "GENERAL_CULTURE";
  title: string;
  text: string;
  answer?: string;
  successScore: number;
  partialSuccessScore?: number;
  failureScorePenalty: number;
  failureDrinks: number;
  allowsPartial: boolean;
  requiresAnswerReveal: boolean;
}

export type MergerPhaseKind = "BRIDE_QUESTION" | "STREET_CHALLENGE" | "GENERAL_CULTURE";

export interface MergerPhase {
  id: string;
  kind: MergerPhaseKind;
  title: string;
  text: string;
  answer?: string;
  instructions?: string[];
  examples?: string[];
  examplePitch?: string;
  successCriteria?: string;
  failureCriteria?: string;
  safetyNote?: string;
  successScore: number;
  partialSuccessScore?: number;
  failureScorePenalty: number;
  failureDrinks: number;
  allowsPartial?: boolean;
  requiresAnswerReveal?: boolean;
}

export type MergerPhaseOutcome = "SUCCESS" | "PARTIAL" | "FAILURE";

export interface MergerPhaseResult {
  phaseId: string;
  outcome: MergerPhaseOutcome;
}

export interface MergerAttemptResolution {
  successfulPhases: number;
  passedPhases: MergerPhase[];
  partialPhases: MergerPhase[];
  failedPhases: MergerPhase[];
}
