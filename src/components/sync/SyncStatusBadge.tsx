import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCloudArrowUp, faRotate, faTriangleExclamation, faWifi } from "@fortawesome/free-solid-svg-icons";
import { useSyncStatus } from "../../hooks/useSyncStatus";
import type { SyncStatus } from "../../services/cloudSync/syncTypes";

const syncStatusContent: Record<SyncStatus, { label: string; className: string; icon: typeof faCircleCheck }> = {
  SYNCED: {
    label: "Sincronizado",
    className: "text-broker-bullish",
    icon: faCircleCheck
  },
  PENDING: {
    label: "Pendiente",
    className: "text-broker-warning",
    icon: faCloudArrowUp
  },
  SYNCING: {
    label: "Sincronizando",
    className: "text-broker-info",
    icon: faRotate
  },
  OFFLINE: {
    label: "Sin conexion",
    className: "text-broker-bearish",
    icon: faWifi
  },
  ERROR: {
    label: "Error sync",
    className: "text-broker-warning",
    icon: faTriangleExclamation
  }
};

export function SyncStatusBadge() {
  const sync = useSyncStatus();
  const content = syncStatusContent[sync.status];

  return (
    <span className={`inline-flex items-center gap-1 text-[0.68rem] font-bold uppercase tracking-[0.08em] ${content.className}`}>
      <FontAwesomeIcon icon={content.icon} className="h-3 w-3" aria-hidden="true" />
      {content.label}
    </span>
  );
}
