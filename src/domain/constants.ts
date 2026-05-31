export const INITIAL_SCORE = 100;
export const MERGER_TARGET_SCORE = 190;
export const HOT_MARKET_SCORE = 130;
export const STABLE_MARKET_SCORE = 90;
export const CRITICAL_ZONE_SCORE = 70;
export const BAILOUT_SCORE = 40;

export const MERGER_FAILURE_SCORE_PENALTY = 25;
export const MERGER_FAILURE_DRINKS = 5;

export const CRITICAL_ZONE_EXTRA_SCORE_PENALTY = 5;
export const CRITICAL_ZONE_EXTRA_DRINKS = 1;

export const ORDINARY_MAX_DRINKS = 10;

export const STORAGE_KEYS = {
  GAME_STATE: "bachelor-market:game-state",
  SETTINGS: "bachelor-market:settings",
  DATA_VERSION: "bachelor-market:data-version",
  HAS_STARTED_GAME: "bachelor-market:has-started-game"
} as const;
