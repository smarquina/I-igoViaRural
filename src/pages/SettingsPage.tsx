import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBullseye, faCircleQuestion, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useGame } from "../app/GameContext";
import { MobileShell } from "../components/layout/MobileShell";
import { MarketHeader } from "../components/market/MarketHeader";

export function SettingsPage() {
  const { config, hasStartedGame, clearSavedGame } = useGame();
  const navigate = useNavigate();

  const handleReset = () => {
    const confirmed = window.confirm("¿Reiniciar la partida y limpiar el estado guardado?");
    if (!confirmed) {
      return;
    }

    clearSavedGame();
    navigate("/");
  };

  return (
    <MobileShell>
      <MarketHeader />
      <main className="flex-1 overflow-y-auto px-4 py-5">
        <Link to={hasStartedGame ? "/game" : "/"} className="inline-flex items-center gap-2 text-sm font-bold text-broker-muted">
          <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" aria-hidden="true" />
          Volver
        </Link>
        <h1 className="mt-5 text-2xl font-black text-broker-ink">Menú</h1>
        <p className="mt-1 text-sm text-broker-muted">Versión de datos {config.dataVersion}</p>

        <section className="mt-5 space-y-3">
          <Link
            to="/rules"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-broker-border bg-broker-surface px-4 text-sm font-black text-broker-ink"
          >
            <FontAwesomeIcon icon={faCircleQuestion} className="h-4 w-4" aria-hidden="true" />
            Reglas
          </Link>
          <Link
            to="/settings/fusion"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-broker-border bg-broker-surface px-4 text-sm font-black text-broker-ink"
          >
            <FontAwesomeIcon icon={faBullseye} className="h-4 w-4" aria-hidden="true" />
            Valor de fusión
          </Link>
          {hasStartedGame ? (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-broker-bearish bg-broker-bearish/10 px-4 text-sm font-black text-broker-bearish"
            >
              <FontAwesomeIcon icon={faRotateRight} className="h-4 w-4" aria-hidden="true" />
              Reiniciar partida
            </button>
          ) : null}
        </section>
      </main>
    </MobileShell>
  );
}
