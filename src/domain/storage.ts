import { STORAGE_KEYS } from "./constants";
import type { AppConfig, GameState } from "./types";

interface StoredSettings {
  mergerTargetScore?: number;
}

function buildLegacyTimeline(scoreHistory: number[]) {
  const now = new Date();
  const sessionStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0, 0);

  return scoreHistory.map((score, index) => ({
    score,
    timestamp: new Date(sessionStart.getTime() + index * 5 * 60 * 1000).toISOString(),
    event: index === 0 ? "Apertura de sesión" : `Movimiento histórico ${index}`
  }));
}

function normalizeGameState(state: GameState): GameState {
  const withTimeline = Array.isArray(state.scoreTimeline) && state.scoreTimeline.length > 0
    ? state
    : {
        ...state,
        scoreTimeline: buildLegacyTimeline(state.scoreHistory)
      };

  return {
    ...withTimeline,
    hasDrawnWildcardThisRound: withTimeline.hasDrawnWildcardThisRound ?? false,
    shownRoundIds: withTimeline.shownRoundIds ?? withTimeline.resolvedRoundIds ?? [],
    lastEventMessage:
      withTimeline.lastEventMessage === "Se abre la sesión." ? undefined : withTimeline.lastEventMessage
  };
}

export function loadGameState(): GameState | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawState = window.localStorage.getItem(STORAGE_KEYS.GAME_STATE);

  if (!rawState) {
    return null;
  }

  try {
    return normalizeGameState(JSON.parse(rawState) as GameState);
  } catch {
    return null;
  }
}

export function saveGameState(state: GameState): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(state));
}

export function clearGameState(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
}

export function hasSavedGame(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(STORAGE_KEYS.HAS_STARTED_GAME) === "true";
}

export function markGameAsStarted(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEYS.HAS_STARTED_GAME, "true");
}

export function clearStartedGameFlag(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEYS.HAS_STARTED_GAME);
}

export function loadSavedSettings(): StoredSettings {
  if (typeof window === "undefined") {
    return {};
  }

  const rawSettings = window.localStorage.getItem(STORAGE_KEYS.SETTINGS);

  if (!rawSettings) {
    return {};
  }

  try {
    const parsedSettings = JSON.parse(rawSettings) as StoredSettings;
    return Number.isFinite(parsedSettings.mergerTargetScore)
      ? { mergerTargetScore: parsedSettings.mergerTargetScore }
      : {};
  } catch {
    return {};
  }
}

export function saveMergerTargetScore(mergerTargetScore: number): void {
  if (typeof window === "undefined") {
    return;
  }

  const currentSettings = loadSavedSettings();
  window.localStorage.setItem(
    STORAGE_KEYS.SETTINGS,
    JSON.stringify({
      ...currentSettings,
      mergerTargetScore
    } satisfies StoredSettings)
  );
}

export function buildEffectiveConfig(defaultConfig: AppConfig, settings: StoredSettings): AppConfig {
  return {
    ...defaultConfig,
    mergerTargetScore: settings.mergerTargetScore ?? defaultConfig.mergerTargetScore
  };
}
