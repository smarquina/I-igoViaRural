import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { copy } from "../../lang";

export function MarketHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-broker-border bg-broker-bg2/95 px-4 py-3 backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link to="/" className="flex items-center gap-2">
            <img src="/icon.avif" alt="" className="h-8 w-8 shrink-0 rounded-md object-cover" />
            <span className="min-w-0">
              <span className="block truncate text-sm font-black uppercase tracking-[0.08em] text-broker-greenDark">
                Despedida ViaRural Broker
              </span>
              <span className="mt-0.5 block text-xs text-broker-muted">Iñigo Capital S.A. → Rocío Holdings</span>
            </span>
          </Link>
        </div>
        <Link
          to="/settings"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-broker-border bg-broker-surface text-broker-ink"
          aria-label={copy.app.openSettings}
        >
          <FontAwesomeIcon icon={faBars} className="h-5 w-5" aria-hidden="true" />
        </Link>
      </div>
    </header>
  );
}
