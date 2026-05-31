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
  | "LOSS_LIMIT";

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
