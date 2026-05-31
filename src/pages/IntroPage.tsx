import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faLandmark } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { MarketHeader } from "../components/market/MarketHeader";
import { MobileShell } from "../components/layout/MobileShell";

export function IntroPage() {
  const navigate = useNavigate();

  return (
    <MobileShell>
      <MarketHeader />
      <main className="flex-1 overflow-y-auto px-4 py-5">
        <section className="rounded-md border border-broker-border bg-broker-surface p-4">
          <div className="flex items-center gap-2 text-broker-lime">
            <FontAwesomeIcon icon={faLandmark} className="h-5 w-5" aria-hidden="true" />
            <p className="text-xs font-black uppercase tracking-[0.16em]">Apertura de mercado</p>
          </div>
          <h1 className="mt-4 text-2xl font-black text-broker-ink">La última sesión bursátil de Iñigo</h1>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-broker-muted">
            <p>
              Iñigo cotiza como valor independiente en el mercado de la soltería. Hoy el mercado se enfrenta
              a una operación histórica: la fusión entre Iñigo Capital S.A. y Rocío Holdings.
            </p>
            <p>
              El Consejo de Administración le someterá a preguntas, auditorías internas, pruebas, OPAs hostiles
              y eventos capaces de hundir o disparar la cotización.
            </p>
            <p>
              El objetivo es alcanzar 190 puntos y superar el Cierre de Fusión. Si el mercado pierde la confianza,
              habrá Zona Crítica, rescate bancario y tragos regulatorios.
            </p>
          </div>
        </section>
      </main>
      <footer className="grid grid-cols-[auto_1fr] gap-3 border-t border-broker-border bg-broker-bg2 p-3">
        <Link
          to="/"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-broker-border px-4 text-sm font-bold text-broker-ink"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" aria-hidden="true" />
          Volver
        </Link>
        <button
          type="button"
          onClick={() => navigate("/game")}
          className="min-h-12 rounded-md bg-broker-green px-4 text-sm font-black text-white"
        >
          Comenzar sesión
        </button>
      </footer>
    </MobileShell>
  );
}
