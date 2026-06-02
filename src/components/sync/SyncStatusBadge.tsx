import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCloudArrowUp, faRotate, faTriangleExclamation, faWifi } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useGame } from "../../app/GameContext";
import { useSyncStatus } from "../../hooks/useSyncStatus";
import { copy } from "../../lang";
import type { SyncStatus } from "../../services/cloudSync/syncTypes";

const syncStatusContent: Record<SyncStatus, { className: string; ringClassName: string; icon: typeof faCircleCheck }> = {
  SYNCED: {
    className: "text-broker-bullish",
    ringClassName: "border-broker-bullish/60 bg-broker-bullish/10",
    icon: faCircleCheck
  },
  PENDING: {
    className: "text-broker-warning",
    ringClassName: "border-broker-warning/70 bg-broker-warning/10",
    icon: faCloudArrowUp
  },
  SYNCING: {
    className: "text-broker-warning",
    ringClassName: "border-broker-warning/70 bg-broker-warning/10",
    icon: faRotate
  },
  OFFLINE: {
    className: "text-broker-bearish",
    ringClassName: "border-broker-bearish/70 bg-broker-bearish/10",
    icon: faWifi
  },
  ERROR: {
    className: "text-broker-bearish",
    ringClassName: "border-broker-bearish/70 bg-broker-bearish/10",
    icon: faTriangleExclamation
  }
};

export function SyncStatusBadge() {
  const sync = useSyncStatus();
  const { hasStartedGame, synchronizeGame } = useGame();
  const [isSyncing, setIsSyncing] = useState(false);
  const displayedStatus = isSyncing ? "SYNCING" : sync.status;
  const content = syncStatusContent[displayedStatus];
  const iconClassName = displayedStatus === "SYNCING" ? "h-5 w-5 animate-spin" : "h-5 w-5";
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
      className={`relative inline-flex h-11 w-11 items-center justify-center rounded-md border bg-broker-surface disabled:cursor-not-allowed disabled:opacity-55 ${content.ringClassName} ${content.className}`}
      aria-label={copy.sync.ariaLabel}
      title={copy.sync.statusLabels[displayedStatus]}
    >
      <FontAwesomeIcon icon={content.icon} className={iconClassName} aria-hidden="true" />
    </button>
  );
}
