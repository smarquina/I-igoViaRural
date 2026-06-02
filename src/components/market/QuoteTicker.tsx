import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye, faGaugeHigh } from "@fortawesome/free-solid-svg-icons";
import { lazy, Suspense } from "react";
import { getMarketStatusLabel, getNextThreshold } from "../../domain/marketStatusEngine";
import type { AppConfig, GameState } from "../../domain/types";
import { ScoreProgress } from "./ScoreProgress";
import { loadMiniMarketChart } from "./chartLoader";
import { copy } from "../../lang";

const MiniMarketChart = lazy(loadMiniMarketChart);

interface QuoteTickerProps {
  config: AppConfig;
  state: GameState;
  isLoading?: boolean;
}

export function QuoteTicker({ config, state, isLoading }: QuoteTickerProps) {
  if (isLoading) {
    return (
      <section className="rounded-md border border-broker-border bg-broker-surface p-4 shadow-sm animate-pulse" aria-busy="true">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="h-4 w-32 rounded bg-broker-border/60" />
              <div className="mt-3 flex gap-2">
                <div className="h-5 w-24 rounded-md bg-broker-bg px-2 py-1 text-[11px] font-bold text-transparent select-none bg-broker-border/40">
                  MAX ---
                </div>
                <div className="h-5 w-24 rounded-md bg-broker-bg px-2 py-1 text-[11px] font-bold text-transparent select-none bg-broker-border/40">
                  MIN ---
                </div>
              </div>
            </div>
            <div className="shrink-0 rounded-md bg-broker-bg px-3 py-2 text-right min-w-[80px]">
              <div className="h-2.5 w-10 ml-auto rounded bg-broker-border/40" />
              <div className="mt-1.5 h-6 w-12 ml-auto rounded bg-broker-border/60" />
            </div>
          </div>
        </div>

        <div className="mt-5 h-48 w-full rounded-md bg-broker-bg border border-broker-border/30 flex items-end justify-center p-3">
          <div className="w-full h-[80%] flex items-end gap-2 opacity-25">
            <div className="flex-1 bg-broker-border/50 h-[30%] rounded-t" />
            <div className="flex-1 bg-broker-border/50 h-[45%] rounded-t" />
            <div className="flex-1 bg-broker-border/50 h-[38%] rounded-t" />
            <div className="flex-1 bg-broker-border/50 h-[60%] rounded-t" />
            <div className="flex-1 bg-broker-border/50 h-[52%] rounded-t" />
            <div className="flex-1 bg-broker-border/50 h-[75%] rounded-t" />
            <div className="flex-1 bg-broker-border/50 h-[65%] rounded-t" />
            <div className="flex-1 bg-broker-border/50 h-[85%] rounded-t" />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-md bg-broker-bg p-3">
            <div className="h-3 w-16 rounded bg-broker-border/40" />
            <div className="mt-2 h-4 w-24 rounded bg-broker-border/60" />
          </div>
          <div className="rounded-md bg-broker-bg p-3 flex flex-col items-end">
            <div className="h-3 w-24 rounded bg-broker-border/40" />
            <div className="mt-2 h-4 w-16 rounded bg-broker-border/60" />
          </div>
        </div>

        <div className="mt-4">
          <div className="h-2.5 w-full rounded-full bg-broker-border/30" />
        </div>
      </section>
    );
  }
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
                {copy.market.maxShort} {sessionMax} {copy.common.pointsShort}
              </span>
              <span className="rounded-md bg-broker-bg px-2 py-1 text-[11px] font-bold text-broker-bearish">
                {copy.market.minShort} {sessionMin} {copy.common.pointsShort}
              </span>
            </div>
          </div>
          <div className="shrink-0 rounded-md bg-broker-bg px-3 py-2 text-right">
            <span className="block text-[10px] font-bold uppercase text-broker-muted">{copy.market.quote}</span>
            <strong className="text-3xl leading-none text-broker-ink">{state.score}</strong>
            <span className="ml-1 text-xs font-semibold text-broker-muted">{copy.common.pointsShort}</span>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <Suspense fallback={<div className="h-48 w-full rounded-md bg-broker-bg" role="presentation" />}>
          <MiniMarketChart
            history={state.scoreHistory}
            timeline={state.scoreTimeline}
            showExtremes
            showExtremeSummary={false}
          />
        </Suspense>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-md bg-broker-bg p-3">
          <p className="flex items-center gap-1.5 text-xs text-broker-muted">
            <FontAwesomeIcon icon={faGaugeHigh} className="h-3.5 w-3.5" aria-hidden="true" />
            {copy.market.status}
          </p>
          <p className="text-sm font-bold text-broker-ink">{statusLabel}</p>
        </div>
        <div className="rounded-md bg-broker-bg p-3 text-right">
          <p className="flex items-center justify-end gap-1.5 text-xs text-broker-muted">
            <FontAwesomeIcon icon={faBullseye} className="h-3.5 w-3.5" aria-hidden="true" />
            {copy.market.nextThreshold}
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
