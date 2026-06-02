import type { GameState } from "../../domain/types";
import { loadGameState, saveGameState } from "../../domain/storage";
import { loadCloudGameState, saveCloudGameState } from "./cloudGameStateRepository";
import { ensureAnonymousSession } from "./firebaseAuth";
import { isFirebaseConfigured } from "./firebaseApp";
import {
  clearPendingSyncEvents,
  clearPendingSyncEvent,
  enqueueLatestState,
  getClientId,
  loadPendingSyncEvent,
  loadSyncState,
  saveSyncState
} from "./syncOutbox";

let flushTimer: number | undefined;
let isFlushing = false;

const FLUSH_DEBOUNCE_MS = 800;

function getTimestampValue(timestamp: string | undefined): number {
  const value = timestamp ? Date.parse(timestamp) : Number.NaN;
  return Number.isFinite(value) ? value : 0;
}

function getNewestLocalState(localState: GameState | null): GameState | null {
  const pendingState = loadPendingSyncEvent()?.state ?? null;

  if (!localState) {
    return pendingState;
  }

  if (!pendingState) {
    return localState;
  }

  return getTimestampValue(pendingState.updatedAt) > getTimestampValue(localState.updatedAt)
    ? pendingState
    : localState;
}

function canUseConnectivity(): boolean {
  return typeof window !== "undefined" && typeof navigator !== "undefined";
}

function canFlushCloudSync(): boolean {
  return !isFlushing && canUseConnectivity() && navigator.onLine && isFirebaseConfigured();
}

async function requireAnonymousSession(): Promise<void> {
  const userId = await ensureAnonymousSession();
  if (!userId) {
    throw new Error("Firebase anonymous authentication is not available");
  }
}

function applyCloudState(cloudDocument: Awaited<ReturnType<typeof loadCloudGameState>>): GameState | null {
  if (!cloudDocument) {
    return null;
  }

  saveGameState(cloudDocument.state);
  clearPendingSyncEvents();
  saveSyncState({
    status: "SYNCED",
    lastSyncedVersion: cloudDocument.stateVersion,
    lastSyncedAt: cloudDocument.updatedAt
  });

  return cloudDocument.state;
}

async function uploadLocalState(localState: GameState, cloudDocument: Awaited<ReturnType<typeof loadCloudGameState>>): Promise<GameState> {
  const nextStateVersion = Math.max(loadSyncState().lastSyncedVersion ?? 0, cloudDocument?.stateVersion ?? 0) + 1;

  await saveCloudGameState({
    schemaVersion: 1,
    stateVersion: nextStateVersion,
    updatedAt: localState.updatedAt,
    updatedBy: getClientId(),
    source: "localStorage-sync",
    state: localState
  });
  clearPendingSyncEvents();
  saveSyncState({
    status: "SYNCED",
    lastSyncedVersion: nextStateVersion,
    lastSyncedAt: localState.updatedAt
  });

  return localState;
}

export function queueCloudSync(state: GameState): void {
  enqueueLatestState(state);

  if (!canUseConnectivity() || !navigator.onLine) {
    saveSyncState({
      ...loadSyncState(),
      status: "OFFLINE"
    });
    return;
  }

  if (!isFirebaseConfigured()) {
    saveSyncState({
      ...loadSyncState(),
      status: "PENDING",
      lastError: "Firebase is not configured"
    });
    return;
  }

  scheduleFlush();
}

export function scheduleFlush(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.clearTimeout(flushTimer);
  flushTimer = window.setTimeout(() => {
    void flushCloudSync();
  }, FLUSH_DEBOUNCE_MS);
}

export async function flushCloudSync(): Promise<void> {
  if (!canFlushCloudSync()) {
    return;
  }

  const pending = loadPendingSyncEvent();
  if (!pending) {
    return;
  }

  isFlushing = true;
  saveSyncState({
    ...loadSyncState(),
    status: "SYNCING"
  });

  try {
    await requireAnonymousSession();

    await saveCloudGameState({
      schemaVersion: 1,
      stateVersion: pending.stateVersion,
      updatedAt: pending.createdAt,
      updatedBy: pending.clientId,
      source: "localStorage-sync",
      state: pending.state
    });
    clearPendingSyncEvent(pending.id);
    saveSyncState({
      status: "SYNCED",
      lastSyncedVersion: pending.stateVersion,
      lastSyncedAt: new Date().toISOString()
    });
  } catch (error) {
    saveSyncState({
      ...loadSyncState(),
      status: navigator.onLine ? "ERROR" : "OFFLINE",
      lastError: error instanceof Error ? error.message : String(error)
    });
  } finally {
    isFlushing = false;
    const nextPending = loadPendingSyncEvent();
    if (nextPending && nextPending.id !== pending.id && navigator.onLine) {
      scheduleFlush();
    }
  }
}

export async function hydrateFromLocalAndCloud(): Promise<GameState | null> {
  const localState = getNewestLocalState(loadGameState());

  if (!isFirebaseConfigured()) {
    return localState;
  }

  try {
    const cloudDocument = await loadCloudGameState();
    if (!cloudDocument) {
      return localState;
    }

    if (localState && getTimestampValue(localState.updatedAt) >= getTimestampValue(cloudDocument.updatedAt)) {
      return localState;
    }

    saveGameState(cloudDocument.state);
    saveSyncState({
      status: "SYNCED",
      lastSyncedVersion: cloudDocument.stateVersion,
      lastSyncedAt: new Date().toISOString()
    });

    return cloudDocument.state;
  } catch {
    return localState;
  }
}

export async function synchronizeGameStateByTimestamp(currentState: GameState): Promise<GameState | null> {
  if (!canUseConnectivity() || !navigator.onLine) {
    saveSyncState({
      ...loadSyncState(),
      status: "OFFLINE"
    });
    return null;
  }

  if (!isFirebaseConfigured()) {
    saveSyncState({
      ...loadSyncState(),
      status: "ERROR",
      lastError: "Firebase is not configured"
    });
    return null;
  }

  saveSyncState({
    ...loadSyncState(),
    status: "SYNCING"
  });

  try {
    await requireAnonymousSession();

    const localState = getNewestLocalState(loadGameState()) ?? currentState;
    const cloudDocument = await loadCloudGameState();
    const localUpdatedAt = getTimestampValue(localState.updatedAt);
    const cloudUpdatedAt = getTimestampValue(cloudDocument?.updatedAt);

    if (cloudDocument && cloudUpdatedAt > localUpdatedAt) {
      return applyCloudState(cloudDocument);
    }

    return uploadLocalState(localState, cloudDocument);
  } catch (error) {
    saveSyncState({
      ...loadSyncState(),
      status: navigator.onLine ? "ERROR" : "OFFLINE",
      lastError: error instanceof Error ? error.message : String(error)
    });
    return null;
  }
}

export function registerConnectivitySync(): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleOnline = () => {
    saveSyncState({
      ...loadSyncState(),
      status: "PENDING"
    });
    void flushCloudSync();
  };

  const handleOffline = () => {
    saveSyncState({
      ...loadSyncState(),
      status: "OFFLINE"
    });
  };

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
}
