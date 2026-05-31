import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye, faGaugeHigh } from "@fortawesome/free-solid-svg-icons";
import { getMarketStatusLabel, getNextThreshold } from "../../domain/marketStatusEngine";
import type { AppConfig, GameState } from "../../domain/types";
import { MiniMarketChart } from "./MiniMarketChart";
import { ScoreProgress } from "./ScoreProgress";

interface QuoteTickerProps {
  config: AppConfig;
  state: GameState;
}

export function QuoteTicker({ config, state }: QuoteTickerProps) {
  const sessionMax = Math.max(...state.scoreHistory);
  const sessionMin = Math.min(...state.scoreHistory);
  const statusLabel = getMarketStatusLabel(state.marketStatus);
  const tickerFrame =
    state.marketStatus === "CRITICAL_ZONE" || state.marketStatus === "BAILOUT_REQUIRED"
      ? "border-broker-bearish shadow-danger"
      : state.marketStatus === "MERGER_ATTEMPT"
        ? "border-broker-merger shadow-glow"
        : "border-broker-border";

  return (
    <section className={`rounded-md border bg-broker-surface p-4 shadow-sm ${tickerFrame}`}>
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-broker-muted">Iñigo Capital S.A.</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-md bg-broker-bg px-2 py-1 text-[11px] font-bold text-broker-greenDark">
                Máx {sessionMax} pts
              </span>
              <span className="rounded-md bg-broker-bg px-2 py-1 text-[11px] font-bold text-broker-bearish">
                Mín {sessionMin} pts
              </span>
            </div>
          </div>
          <div className="shrink-0 rounded-md bg-broker-bg px-3 py-2 text-right">
            <span className="block text-[10px] font-bold uppercase text-broker-muted">Cotización</span>
            <strong className="text-3xl leading-none text-broker-ink">{state.score}</strong>
            <span className="ml-1 text-xs font-semibold text-broker-muted">pts</span>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <MiniMarketChart
          history={state.scoreHistory}
          timeline={state.scoreTimeline}
          showExtremes
          showExtremeSummary={false}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-md bg-broker-bg p-3">
          <p className="flex items-center gap-1.5 text-xs text-broker-muted">
            <FontAwesomeIcon icon={faGaugeHigh} className="h-3.5 w-3.5" aria-hidden="true" />
            Estado
          </p>
          <p className="text-sm font-bold text-broker-ink">{statusLabel}</p>
        </div>
        <div className="rounded-md bg-broker-bg p-3 text-right">
          <p className="flex items-center justify-end gap-1.5 text-xs text-broker-muted">
            <FontAwesomeIcon icon={faBullseye} className="h-3.5 w-3.5" aria-hidden="true" />
            Siguiente umbral
          </p>
          <p className="text-sm font-bold text-broker-greenDark">{getNextThreshold(state.score, config)}</p>
        </div>
      </div>

      <div className="mt-4">
        <ScoreProgress config={config} score={state.score} />
      </div>
    </section>
  );
}
