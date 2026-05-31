import {
  BAILOUT_SCORE,
  CRITICAL_ZONE_SCORE,
  HOT_MARKET_SCORE,
  MERGER_TARGET_SCORE,
  STABLE_MARKET_SCORE
} from "./constants";
import type { AppConfig, MarketStatus } from "./types";

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
  const labels: Record<MarketStatus, string> = {
    MERGER_ATTEMPT: "Cierre de Fusión disponible",
    HOT_MARKET: "Mercado caliente",
    STABLE_MARKET: "Mercado estable",
    WEAK_MARKET: "Mercado débil",
    CRITICAL_ZONE: "Zona crítica",
    BAILOUT_REQUIRED: "Rescate bancario obligatorio"
  };

  return labels[status];
}

export function getNextThreshold(score: number, config?: MarketThresholds): string {
  const thresholds = getThresholds(config);

  if (score <= thresholds.bailoutScore) {
    return "Elegir rescate";
  }

  if (score < thresholds.criticalZoneScore) {
    return `${thresholds.criticalZoneScore + 1} pts para salir de quiebra severa`;
  }

  if (score < thresholds.stableMarketScore) {
    return `${thresholds.stableMarketScore} pts para mercado estable`;
  }

  if (score < thresholds.hotMarketScore) {
    return `${thresholds.hotMarketScore} pts para mercado caliente`;
  }

  if (score < thresholds.mergerTargetScore) {
    return `${thresholds.mergerTargetScore} pts para cierre`;
  }

  return "Due Diligence final";
}
