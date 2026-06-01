import type { GameState } from "../../domain/types";
import { copy } from "../../lang";

interface GameStatsGridProps {
  state: GameState;
}

export function GameStatsGrid({ state }: GameStatsGridProps) {
  const stats = [
    [copy.gameOver.stats.score, `${state.score} ${copy.common.pointsShort}`],
    [copy.gameOver.stats.rounds, String(state.resolvedRoundIds.length)],
    [copy.gameOver.stats.successes, String(state.totalSuccesses)],
    [copy.gameOver.stats.partials, String(state.totalPartialSuccesses)],
    [copy.gameOver.stats.failures, String(state.totalFailures)],
    [copy.gameOver.stats.drinks, String(state.totalDrinks)],
    [copy.gameOver.stats.appliedCatalysts, String(state.usedWildcardIds.length)],
    [copy.gameOver.stats.maxQuote, `${Math.max(...state.scoreHistory)} ${copy.common.pointsShort}`]
  ];

  return (
    <dl className="grid grid-cols-2 gap-3">
      {stats.map(([label, value]) => (
        <div key={label} className="rounded-md border border-broker-border bg-broker-surface/95 p-3 shadow-sm">
          <dt className="text-xs text-broker-muted">{label}</dt>
          <dd className="mt-1 text-xl font-black text-broker-ink">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
