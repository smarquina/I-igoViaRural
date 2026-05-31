import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faLandmark, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import type { MarketStatus } from "../../domain/types";

interface MarketStatusBannerProps {
  status: MarketStatus;
}

export function MarketStatusBanner({ status }: MarketStatusBannerProps) {
  if (status === "CRITICAL_ZONE") {
    return (
      <div className="rounded-md border border-broker-bearish bg-broker-bearish/10 p-3 text-sm text-broker-bearish">
        <div className="flex items-center gap-2 font-black uppercase">
          <FontAwesomeIcon icon={faTriangleExclamation} className="h-4 w-4" aria-hidden="true" />
          Zona crítica
        </div>
        <p className="mt-1 text-xs text-broker-ink">Cada fallo resta 5 puntos extra y añade 1 trago extra.</p>
      </div>
    );
  }

  if (status === "BAILOUT_REQUIRED") {
    return (
      <div className="rounded-md border border-broker-bearish bg-broker-bearish/10 p-3 text-sm text-broker-bearish">
        <div className="flex items-center gap-2 font-black uppercase">
          <FontAwesomeIcon icon={faLandmark} className="h-4 w-4" aria-hidden="true" />
          Rescate obligatorio
        </div>
        <p className="mt-1 text-xs text-broker-ink">La cotización ha caído a 40 puntos o menos.</p>
        <Link className="mt-2 inline-flex text-xs font-bold text-broker-ink underline" to="/bailout">
          Abrir rescate bancario
        </Link>
      </div>
    );
  }

  if (status === "MERGER_ATTEMPT") {
    return (
      <div className="rounded-md border border-broker-merger bg-broker-merger/15 p-3 text-sm text-broker-greenDark">
        <div className="flex items-center gap-2 font-black uppercase">
          <FontAwesomeIcon icon={faCircleCheck} className="h-4 w-4" aria-hidden="true" />
          Cierre de Fusión disponible
        </div>
        <p className="mt-1 text-xs text-broker-ink">El Consejo puede activar la Due Diligence final.</p>
        <Link className="mt-2 inline-flex text-xs font-bold text-broker-ink underline" to="/merger">
          Intentar cerrar fusión
        </Link>
      </div>
    );
  }

  return null;
}
