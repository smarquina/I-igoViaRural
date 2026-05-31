import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBullseye, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useGame } from "../app/GameContext";
import { MobileShell } from "../components/layout/MobileShell";
import { MarketHeader } from "../components/market/MarketHeader";

export function MergerTargetSettingsPage() {
  const { config, updateMergerTargetScore } = useGame();
  const [targetScore, setTargetScore] = useState(String(config.mergerTargetScore));
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const minTargetScore = config.hotMarketScore + 1;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedScore = Number(targetScore);

    if (!Number.isInteger(parsedScore) || parsedScore < minTargetScore) {
      setStatusMessage(`Introduce un valor entero de ${minTargetScore} puntos o más.`);
      return;
    }

    updateMergerTargetScore(parsedScore);
    setStatusMessage(`Valor de fusión guardado en ${parsedScore} puntos.`);
  };

  return (
    <MobileShell>
      <MarketHeader />
      <main className="flex-1 overflow-y-auto px-4 py-5">
        <Link to="/settings" className="inline-flex items-center gap-2 text-sm font-bold text-broker-muted">
          <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" aria-hidden="true" />
          Volver
        </Link>

        <div className="mt-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-broker-soft text-broker-greenDark">
            <FontAwesomeIcon icon={faBullseye} className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-broker-ink">Valor de fusión</h1>
            <p className="text-sm text-broker-muted">Objetivo actual: {config.mergerTargetScore} puntos</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 rounded-md border border-broker-border bg-broker-surface p-4">
          <label htmlFor="merger-target-score" className="text-sm font-black text-broker-ink">
            Puntos necesarios para el Cierre de Fusión
          </label>
          <input
            id="merger-target-score"
            type="number"
            inputMode="numeric"
            min={minTargetScore}
            step={1}
            value={targetScore}
            onChange={(event) => setTargetScore(event.target.value)}
            className="mt-2 min-h-12 w-full rounded-md border border-broker-border bg-broker-bg px-3 text-lg font-black text-broker-ink outline-none focus:border-broker-green"
          />
          <p className="mt-2 text-xs leading-relaxed text-broker-muted">
            Este valor se guarda en el navegador y sobrescribe el objetivo por defecto de 190 puntos.
          </p>

          <button
            type="submit"
            className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-broker-green px-4 text-sm font-black text-white"
          >
            <FontAwesomeIcon icon={faFloppyDisk} className="h-4 w-4" aria-hidden="true" />
            Guardar valor
          </button>
        </form>

        {statusMessage ? (
          <p className="mt-3 rounded-md border border-broker-border bg-broker-bg px-3 py-2 text-sm font-bold text-broker-muted">
            {statusMessage}
          </p>
        ) : null}
      </main>
    </MobileShell>
  );
}
