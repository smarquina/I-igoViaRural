import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../app/GameContext";
import { MobileShell } from "../components/layout/MobileShell";
import { MarketHeader } from "../components/market/MarketHeader";

const phases = [
  "Pregunta de Rocío",
  "Pregunta del mercado",
  "Declaración de inversión"
];

export function MergerAttemptPage() {
  const { applyMergerResult } = useGame();
  const [passed, setPassed] = useState<boolean[]>([false, false, false]);
  const navigate = useNavigate();

  const successfulPhases = passed.filter(Boolean).length;

  const handleSubmit = () => {
    applyMergerResult(successfulPhases);
    navigate(successfulPhases >= 2 ? "/game-over" : "/game");
  };

  return (
    <MobileShell>
      <MarketHeader />
      <main className="flex-1 overflow-y-auto px-4 py-5">
        <div className="rounded-md border border-broker-merger bg-broker-merger/15 p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-broker-merger">Due Diligence final</p>
          <h1 className="mt-2 text-2xl font-black text-broker-ink">Cierre de Fusión</h1>
          <p className="mt-3 text-sm leading-relaxed text-broker-greenDark">
            Para aprobar la operación debe superar al menos 2 de las 3 fases exigidas por el Consejo.
          </p>
        </div>

        <section className="mt-5 space-y-3">
          {phases.map((phase, index) => (
            <button
              key={phase}
              type="button"
              onClick={() =>
                setPassed((current) => current.map((value, itemIndex) => (itemIndex === index ? !value : value)))
              }
              className={`flex min-h-14 w-full items-center justify-between rounded-md border px-4 text-left text-sm font-black ${
                passed[index]
                  ? "border-broker-bullish bg-broker-bullish/15 text-broker-greenDark"
                  : "border-broker-border bg-broker-surface text-broker-ink"
              }`}
            >
              {phase}
              <FontAwesomeIcon icon={passed[index] ? faCircleCheck : faXmark} className="h-5 w-5" aria-hidden="true" />
            </button>
          ))}
        </section>

        <button
          type="button"
          onClick={handleSubmit}
          className="mt-5 min-h-12 w-full rounded-md bg-broker-green px-4 text-sm font-black text-white"
        >
          Registrar resultado ({successfulPhases}/3)
        </button>
      </main>
    </MobileShell>
  );
}
