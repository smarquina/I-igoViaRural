import { useEffect, useState } from "react";
import { loadSyncState } from "../services/cloudSync/syncOutbox";
import type { CloudSyncState } from "../services/cloudSync/syncTypes";

export function useSyncStatus(): CloudSyncState {
  const [syncState, setSyncState] = useState(loadSyncState);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSyncState(loadSyncState());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  return syncState;
}
