import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../app/GameContext";
import { MobileShell } from "../components/layout/MobileShell";
import { MarketHeader } from "../components/market/MarketHeader";
import { MarketStatusBanner } from "../components/market/MarketStatusBanner";
import { QuoteTicker } from "../components/market/QuoteTicker";
import { RoundActionBar } from "../components/rounds/RoundActionBar";
import { RoundAdvanceModal } from "../components/rounds/RoundAdvanceModal";
import { RoundCard } from "../components/rounds/RoundCard";
import { WildcardDeckPanel } from "../components/wildcards/WildcardDeckPanel";
import { WildcardDrawModal } from "../components/wildcards/WildcardDrawModal";

type RoundModalMode = "opening" | "advance";

export function GamePage() {
  const {
    state,
    config,
    currentRound,
    drawnWildcardOffer,
    resolveCurrentRound,
    goToNextRound,
    useWildcardById,
    drawWildcard,
    keepDrawnWildcard,
    useDrawnWildcardNow,
    dismissDrawnWildcard
  } = useGame();
  const navigate = useNavigate();
  const previousRoundIndexRef = useRef(state.currentRoundIndex);
  const [roundModalMode, setRoundModalMode] = useState<RoundModalMode | null>(() =>
    state.roundNumber === 1 && state.phase === "ANSWERING" ? "opening" : null
  );

  useEffect(() => {
    if (state.isGameFinished) {
      navigate("/game-over");
    }
  }, [navigate, state.isGameFinished]);

  useEffect(() => {
    if (previousRoundIndexRef.current === state.currentRoundIndex) {
      return undefined;
    }

    previousRoundIndexRef.current = state.currentRoundIndex;
    setRoundModalMode("advance");
  }, [state.currentRoundIndex]);

  useEffect(() => {
    if (!roundModalMode) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setRoundModalMode(null), 4000);

    return () => window.clearTimeout(timeoutId);
  }, [roundModalMode]);

  return (
    <MobileShell>
      <MarketHeader />
      <main className="flex-1 space-y-3 overflow-y-auto px-3 py-3 pb-5">
        <QuoteTicker config={config} state={state} />
        <MarketStatusBanner status={state.marketStatus} />
        <WildcardDeckPanel
          state={state}
          wildcards={state.accumulatedWildcards}
          effects={state.activeEffects}
          onUse={useWildcardById}
          onDraw={drawWildcard}
        />
        {state.lastEventMessage ? (
          <div className="rounded-md border border-broker-border bg-broker-surface px-3 py-2 text-xs font-semibold text-broker-muted">
            {state.lastEventMessage}
          </div>
        ) : null}
        <RoundCard
          round={currentRound}
          roundNumber={state.roundNumber}
          phase={state.phase}
        />
      </main>
      <RoundActionBar
        phase={state.phase}
        allowsPartial={currentRound.allowsPartial}
        onResolve={resolveCurrentRound}
        onNext={goToNextRound}
      />
      {drawnWildcardOffer ? (
        <WildcardDrawModal
          wildcard={drawnWildcardOffer}
          onKeep={keepDrawnWildcard}
          onUseNow={useDrawnWildcardNow}
          onDismiss={dismissDrawnWildcard}
        />
      ) : null}
      <RoundAdvanceModal
        isOpen={Boolean(roundModalMode)}
        round={currentRound}
        roundNumber={state.roundNumber}
        mode={roundModalMode ?? "advance"}
      />
    </MobileShell>
  );
}
