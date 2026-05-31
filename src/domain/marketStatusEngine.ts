import {
  BAILOUT_SCORE,
  CRITICAL_ZONE_SCORE,
  HOT_MARKET_SCORE,
  MERGER_TARGET_SCORE,
  STABLE_MARKET_SCORE
} from "./constants";
import type { AppConfig, MarketStatus } from "./types";
import { copy } from "../lang";

type MarketThresholds = Pick<
  AppConfig,
  "bailoutScore" | "criticalZoneScore" | "stableMarketScore" | "hotMarketScore" | "mergerTargetScore"
>;

function getThresholds(config?: MarketThresholds): MarketThresholds {
  return {
    bailoutScore: config?.bailoutScore ?? BAILOUT_SCORE,
    criticalZoneScore: config?.criticalZoneScore ?? CRITICAL_ZONE_SCORE,
    stableMarketScore: config?.stableMarketScore ?? STABLE_MARKET_SCORE,
    hotMarketScore: config?.hotMarketScore ?? HOT_MARKET_SCORE,
    mergerTargetScore: config?.mergerTargetScore ?? MERGER_TARGET_SCORE
  };
}

export function calculateMarketStatus(score: number, config?: MarketThresholds): MarketStatus {
  const thresholds = getThresholds(config);

  if (score <= thresholds.bailoutScore) {
    return "BAILOUT_REQUIRED";
  }

  if (score >= thresholds.mergerTargetScore) {
    return "MERGER_ATTEMPT";
  }

  if (score <= thresholds.criticalZoneScore) {
    return "CRITICAL_ZONE";
  }

  if (score >= thresholds.hotMarketScore) {
    return "HOT_MARKET";
  }

  if (score >= thresholds.stableMarketScore) {
    return "STABLE_MARKET";
  }

  return "WEAK_MARKET";
}

export function getMarketStatusLabel(status: MarketStatus): string {
  return copy.market.statusLabels[status];
}

export function getNextThreshold(score: number, config?: MarketThresholds): string {
  const thresholds = getThresholds(config);

  if (score <= thresholds.bailoutScore) {
    return copy.market.nextThresholds.chooseBailout;
  }

  if (score < thresholds.criticalZoneScore) {
    return copy.market.nextThresholds.leaveSevereBankruptcy(thresholds.criticalZoneScore + 1);
  }

  if (score < thresholds.stableMarketScore) {
    return copy.market.nextThresholds.stableMarket(thresholds.stableMarketScore);
  }

  if (score < thresholds.hotMarketScore) {
    return copy.market.nextThresholds.hotMarket(thresholds.hotMarketScore);
  }

  if (score < thresholds.mergerTargetScore) {
    return copy.market.nextThresholds.closeMerger(thresholds.mergerTargetScore);
  }

  return copy.market.nextThresholds.finalDueDiligence;
}
