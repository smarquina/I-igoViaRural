import type { GameState } from "../../domain/types";

export type SyncStatus = "SYNCED" | "PENDING" | "SYNCING" | "ERROR" | "OFFLINE";

export interface PendingSyncEvent {
  id: string;
  stateVersion: number;
  createdAt: string;
  clientId: string;
  state: GameState;
}

export interface CloudSyncState {
  status: SyncStatus;
  lastSyncedVersion?: number;
  lastSyncedAt?: string;
  lastError?: string;
}
