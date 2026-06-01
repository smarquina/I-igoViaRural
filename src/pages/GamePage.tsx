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
  const contentRef = useRef<HTMLElement | null>(null);
  const previousRoundIndexRef = useRef(state.currentRoundIndex);
  const [roundModalMode, setRoundModalMode] = useState<RoundModalMode | null>(() =>
    state.roundNumber === 1 && state.phase === "ANSWERING" ? "opening" : null
  );

  useEffect(() => {
    if (state.isGameFinished) {
      navigate(state.gameResult === "NEGOTIATIONS_BROKEN" ? "/resacon-toledo" : "/game-over");
    }
  }, [navigate, state.gameResult, state.isGameFinished]);

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

  useEffect(() => {
    if (state.marketStatus === "MERGER_ATTEMPT" || state.marketStatus === "BAILOUT_REQUIRED") {
      contentRef.current?.scrollTo?.({ top: 0, behavior: "smooth" });
    }
  }, [state.marketStatus]);

  return (
    <MobileShell>
      <MarketHeader />
      <main ref={contentRef} className="flex-1 space-y-3 overflow-y-auto px-3 py-3 pb-5">
        <MarketStatusBanner status={state.marketStatus} />
        <QuoteTicker config={config} state={state} />
        <WildcardDeckPanel
          state={state}
          wildcards={state.accumulatedWildcards}
          effects={state.activeEffects}
          activityMessage={state.lastEventMessage}
          onUse={useWildcardById}
          onDraw={drawWildcard}
        />
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
