import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesRight, faCheck, faCircleXmark, faPercent, faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import type { GamePhase, RoundResult } from "../../domain/types";

interface RoundActionBarProps {
  phase: GamePhase;
  allowsPartial: boolean;
  onResolve: (result: RoundResult) => void;
  onNext: () => void;
}

export function RoundActionBar({ phase, allowsPartial, onResolve, onNext }: RoundActionBarProps) {
  if (phase === "RESOLVED") {
    return (
      <div className="sticky bottom-0 z-20 border-t border-broker-border bg-broker-bg2/95 p-3 backdrop-blur">
        <button
          type="button"
          onClick={onNext}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-broker-green px-4 text-sm font-black text-white"
        >
          <FontAwesomeIcon icon={faAnglesRight} className="h-5 w-5" aria-hidden="true" />
          Siguiente ronda
        </button>
      </div>
    );
  }

  return (
    <div className="sticky bottom-0 z-20 grid grid-cols-3 gap-2 border-t border-broker-border bg-broker-bg2/95 p-3 backdrop-blur">
      <button
        type="button"
        onClick={() => onResolve("FAILURE")}
        className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-md border border-broker-bearish bg-broker-bearish/10 text-sm font-black text-broker-bearish"
      >
        <FontAwesomeIcon icon={faCircleXmark} className="h-4 w-4" aria-hidden="true" />
        Fallo
      </button>
      {allowsPartial ? (
        <button
          type="button"
          onClick={() => onResolve("PARTIAL_SUCCESS")}
          className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-md border border-broker-warning bg-broker-warning/20 text-sm font-black text-amber-800"
        >
          <FontAwesomeIcon icon={faPercent} className="h-4 w-4" aria-hidden="true" />
          Parcial
        </button>
      ) : (
        <div className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-md border border-broker-border bg-broker-bg text-sm font-black text-broker-muted">
          <FontAwesomeIcon icon={faShieldHalved} className="h-4 w-4" aria-hidden="true" />
          Sin parcial
        </div>
      )}
      <button
        type="button"
        onClick={() => onResolve("SUCCESS")}
        className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-md bg-broker-green text-sm font-black text-white"
      >
        <FontAwesomeIcon icon={faCheck} className="h-4 w-4" aria-hidden="true" />
        Acierto
      </button>
    </div>
  );
}
