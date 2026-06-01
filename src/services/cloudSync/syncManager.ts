import type { GameState } from "../../domain/types";
import { loadGameState, saveGameState } from "../../domain/storage";
import { loadCloudGameState, saveCloudGameState } from "./cloudGameStateRepository";
import { ensureAnonymousSession } from "./firebaseAuth";
import { isFirebaseConfigured } from "./firebaseApp";
import {
  clearPendingSyncEvent,
  enqueueLatestState,
  loadPendingSyncEvent,
  loadSyncState,
  saveSyncState
} from "./syncOutbox";

let flushTimer: number | undefined;
let isFlushing = false;

const FLUSH_DEBOUNCE_MS = 800;

function canUseConnectivity(): boolean {
  return typeof window !== "undefined" && typeof navigator !== "undefined";
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
  if (isFlushing || !canUseConnectivity() || !navigator.onLine || !isFirebaseConfigured()) {
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
    await ensureAnonymousSession();
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
  const localState = loadGameState();

  if (!isFirebaseConfigured()) {
    return localState;
  }

  try {
    const cloudDocument = await loadCloudGameState();
    if (!cloudDocument) {
      return localState;
    }

    const localPending = loadPendingSyncEvent();
    if (localPending && localPending.stateVersion >= cloudDocument.stateVersion) {
      return localPending.state;
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
