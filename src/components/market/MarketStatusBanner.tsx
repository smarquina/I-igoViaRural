import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faLandmark, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import type { MarketStatus } from "../../domain/types";
import { copy } from "../../lang";

interface MarketStatusBannerProps {
  status: MarketStatus;
}

export function MarketStatusBanner({ status }: MarketStatusBannerProps) {
  if (status === "CRITICAL_ZONE") {
    return (
      <div className="rounded-md border border-broker-bearish bg-broker-bearish/10 p-3 text-sm text-broker-bearish">
        <div className="flex items-center gap-2 font-black uppercase">
          <FontAwesomeIcon icon={faTriangleExclamation} className="h-4 w-4" aria-hidden="true" />
          {copy.market.banners.criticalTitle}
        </div>
        <p className="mt-1 text-xs text-broker-ink">{copy.market.banners.criticalText}</p>
      </div>
    );
  }

  if (status === "BAILOUT_REQUIRED") {
    return (
      <div className="rounded-md border border-broker-bearish bg-broker-bearish/10 p-3 text-sm text-broker-bearish">
        <div className="flex items-center gap-2 font-black uppercase">
          <FontAwesomeIcon icon={faLandmark} className="h-4 w-4" aria-hidden="true" />
          {copy.market.banners.bailoutTitle}
        </div>
        <p className="mt-1 text-xs text-broker-ink">{copy.market.banners.bailoutText}</p>
        <Link className="mt-2 inline-flex text-xs font-bold text-broker-ink underline" to="/bailout">
          {copy.market.banners.openBailout}
        </Link>
      </div>
    );
  }

  if (status === "MERGER_ATTEMPT") {
    return (
      <div className="rounded-md border border-broker-merger bg-broker-merger p-3 text-sm text-broker-ink shadow-glow">
        <div className="flex items-center gap-2 font-black uppercase">
          <FontAwesomeIcon icon={faCircleCheck} className="h-4 w-4" aria-hidden="true" />
          {copy.market.banners.mergerTitle}
        </div>
        <p className="mt-1 text-xs font-semibold text-broker-ink">{copy.market.banners.mergerText}</p>
        <Link className="mt-2 inline-flex text-xs font-black text-broker-ink underline" to="/merger">
          {copy.market.banners.tryMerger}
        </Link>
      </div>
    );
  }

  return null;
}
