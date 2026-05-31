import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion, faPlus, faShieldHalved, faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import type { GameEffect, GameState, Wildcard } from "../../domain/types";
import { ActiveEffectsBar } from "../effects/ActiveEffectsBar";
import { canUseWildcard } from "../../domain/wildcardEngine";

interface WildcardDeckPanelProps {
  state: GameState;
  wildcards: Wildcard[];
  effects: GameEffect[];
  onUse: (wildcardId: string) => void;
  onDraw: () => void;
}

const typeClass: Record<Wildcard["type"], string> = {
  GOOD: "border-broker-green text-broker-green",
  BAD: "border-broker-bearish text-broker-bearish",
  MIXED: "border-broker-info text-broker-info",
  SPECIAL: "border-broker-wildcard text-amber-700"
};

export function WildcardDeckPanel({ state, wildcards, effects, onUse, onDraw }: WildcardDeckPanelProps) {
  const [hintWildcardId, setHintWildcardId] = useState<string | null>(null);
  const canDraw = state.phase === "ANSWERING" && !state.hasDrawnWildcardThisRound && !state.hasUsedWildcardThisRound;

  return (
    <section className="rounded-md border border-broker-border bg-broker-elevated p-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-black text-broker-ink">Catalizadores acumulados</h2>
          <p className="text-xs text-broker-muted">
            {wildcards.length} en cartera · {state.hasDrawnWildcardThisRound ? "catalizador robado" : "roba catalizador al inicio"}
          </p>
        </div>
        <button
          type="button"
          disabled={!canDraw}
          onClick={onDraw}
          className="inline-flex h-10 items-center gap-1.5 rounded-md border border-broker-border bg-broker-surface px-3 text-xs font-bold text-broker-ink disabled:cursor-not-allowed disabled:opacity-45"
        >
          <FontAwesomeIcon icon={faPlus} className="h-3.5 w-3.5" aria-hidden="true" />
          Robar catalizador
        </button>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {wildcards.length === 0 ? (
          <div className="min-h-16 w-full rounded-md border border-dashed border-broker-border p-3 text-xs text-broker-muted">
            Sin catalizadores acumulados.
          </div>
        ) : (
          wildcards.map((wildcard) => {
            const usable = canUseWildcard(state, wildcard);
            const isHintOpen = hintWildcardId === wildcard.id;

            return (
              <div
                key={wildcard.id}
                className={`min-h-28 min-w-40 rounded-md border bg-broker-surface p-3 text-left ${typeClass[wildcard.type]}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-xs font-black uppercase">
                    <FontAwesomeIcon icon={wildcard.isDefensive ? faShieldHalved : faWandMagicSparkles} className="h-3.5 w-3.5" aria-hidden="true" />
                    {wildcard.type}
                  </span>
                  <button
                    type="button"
                    onClick={() => setHintWildcardId(isHintOpen ? null : wildcard.id)}
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-broker-border bg-broker-bg text-broker-ink"
                    aria-label={`Ver ayuda de ${wildcard.name}`}
                    aria-expanded={isHintOpen}
                  >
                    <FontAwesomeIcon icon={faCircleQuestion} className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
                <strong className="mt-2 block text-sm text-broker-ink">{wildcard.name}</strong>
                {isHintOpen ? (
                  <p className="mt-2 rounded-md bg-broker-bg p-2 text-xs leading-relaxed text-broker-muted">
                    {wildcard.description}
                  </p>
                ) : null}
                <button
                  type="button"
                  disabled={!usable}
                  onClick={() => onUse(wildcard.id)}
                  className="mt-3 min-h-10 w-full rounded-md bg-broker-green px-3 text-xs font-black text-white disabled:cursor-not-allowed disabled:bg-broker-border disabled:text-broker-muted"
                >
                  Activar
                </button>
              </div>
            );
          })
        )}
      </div>
      <div className="mt-3 border-t border-broker-border pt-3">
        <p className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-broker-muted">Efectos acumulados</p>
        <ActiveEffectsBar effects={effects} />
      </div>
    </section>
  );
}
