import type { GameEffect } from "../../domain/types";

interface ActiveEffectsBarProps {
  effects: GameEffect[];
}

export function ActiveEffectsBar({ effects }: ActiveEffectsBarProps) {
  if (effects.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-broker-border bg-broker-bg/60 px-3 py-2 text-xs text-broker-muted">
        Sin efectos acumulados
      </div>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Efectos activos">
      {effects.map((effect) => (
        <span
          key={effect.id}
          className="whitespace-nowrap rounded-md border border-broker-info/60 bg-broker-info/10 px-2.5 py-1.5 text-xs font-semibold text-broker-ink"
        >
          {effect.label}
          {effect.level ? ` +${effect.level}` : ""}
          {effect.remainingRounds ? ` · ${effect.remainingRounds}R` : ""}
        </span>
      ))}
    </div>
  );
}
