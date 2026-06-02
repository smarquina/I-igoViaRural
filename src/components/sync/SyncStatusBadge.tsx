import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCloudArrowUp, faRotate, faTriangleExclamation, faWifi } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useGame } from "../../app/GameContext";
import { useSyncStatus } from "../../hooks/useSyncStatus";
import { copy } from "../../lang";
import type { SyncStatus } from "../../services/cloudSync/syncTypes";

const syncStatusContent: Record<SyncStatus, { className: string; icon: typeof faCircleCheck }> = {
  SYNCED: {
    className: "text-broker-bullish",
    icon: faCircleCheck
  },
  PENDING: {
    className: "text-broker-warning",
    icon: faCloudArrowUp
  },
  SYNCING: {
    className: "text-broker-info",
    icon: faRotate
  },
  OFFLINE: {
    className: "text-broker-bearish",
    icon: faWifi
  },
  ERROR: {
    className: "text-broker-warning",
    icon: faTriangleExclamation
  }
};

export function SyncStatusBadge() {
  const sync = useSyncStatus();
  const { hasStartedGame, synchronizeGame } = useGame();
  const [isSyncing, setIsSyncing] = useState(false);
  const displayedStatus = isSyncing ? "SYNCING" : sync.status;
  const content = syncStatusContent[displayedStatus];
  const iconClassName = displayedStatus === "SYNCING" ? "h-3 w-3 animate-spin" : "h-3 w-3";
  const isDisabled = isSyncing || !hasStartedGame;

  const handleSync = async () => {
    if (!hasStartedGame) {
      return;
    }

    setIsSyncing(true);

    try {
      await synchronizeGame();
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSync}
      disabled={isDisabled}
      className={`inline-flex min-h-8 items-center gap-1 rounded-md border border-broker-border bg-broker-surface px-2 text-[0.68rem] font-bold uppercase tracking-[0.08em] disabled:cursor-not-allowed disabled:opacity-55 ${content.className}`}
      aria-label={copy.sync.ariaLabel}
    >
      <FontAwesomeIcon icon={content.icon} className={iconClassName} aria-hidden="true" />
      <span>{copy.sync.action}</span>
      <span className="text-broker-muted">{copy.sync.statusLabels[displayedStatus]}</span>
    </button>
  );
}
