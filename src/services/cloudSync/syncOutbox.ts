import { STORAGE_KEYS } from "../../domain/constants";
import type { GameState } from "../../domain/types";
import type { CloudSyncState, PendingSyncEvent } from "./syncTypes";

function hasBrowserStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function createId(): string {
  return crypto.randomUUID();
}

export function getClientId(): string {
  if (!hasBrowserStorage()) {
    return "server";
  }

  const existing = window.localStorage.getItem(STORAGE_KEYS.CLIENT_ID);
  if (existing) {
    return existing;
  }

  const next = createId();
  window.localStorage.setItem(STORAGE_KEYS.CLIENT_ID, next);
  return next;
}

export function loadSyncState(): CloudSyncState {
  if (!hasBrowserStorage()) {
    return { status: "SYNCED" };
  }

  const raw = window.localStorage.getItem(STORAGE_KEYS.CLOUD_SYNC);
  if (!raw) {
    return { status: navigator.onLine ? "SYNCED" : "OFFLINE" };
  }

  try {
    return JSON.parse(raw) as CloudSyncState;
  } catch {
    return { status: "ERROR", lastError: "Invalid sync state" };
  }
}

export function saveSyncState(state: CloudSyncState): void {
  if (!hasBrowserStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEYS.CLOUD_SYNC, JSON.stringify(state));
}

export function loadPendingSyncEvent(): PendingSyncEvent | null {
  if (!hasBrowserStorage()) {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEYS.PENDING_SYNC_EVENT);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as PendingSyncEvent;
  } catch {
    return null;
  }
}

export function getNextStateVersion(): number {
  const current = loadSyncState().lastSyncedVersion ?? 0;
  const pending = loadPendingSyncEvent();
  return Math.max(current, pending?.stateVersion ?? 0) + 1;
}

export function enqueueLatestState(state: GameState): PendingSyncEvent {
  const event: PendingSyncEvent = {
    id: createId(),
    stateVersion: getNextStateVersion(),
    createdAt: new Date().toISOString(),
    clientId: getClientId(),
    state
  };

  if (!hasBrowserStorage()) {
    return event;
  }

  window.localStorage.setItem(STORAGE_KEYS.PENDING_SYNC_EVENT, JSON.stringify(event));
  saveSyncState({
    ...loadSyncState(),
    status: navigator.onLine ? "PENDING" : "OFFLINE"
  });

  return event;
}

export function clearPendingSyncEvent(eventId: string): void {
  if (!hasBrowserStorage()) {
    return;
  }

  const current = loadPendingSyncEvent();
  if (current?.id === eventId) {
    window.localStorage.removeItem(STORAGE_KEYS.PENDING_SYNC_EVENT);
  }
}
