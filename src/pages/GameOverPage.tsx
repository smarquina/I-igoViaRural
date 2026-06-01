import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faHandshake, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useGame } from "../app/GameContext";
import { GameResultScene } from "../components/game/GameResultScene";
import { GameStatsGrid } from "../components/game/GameStatsGrid";
import { MobileShell } from "../components/layout/MobileShell";
import { copy } from "../lang";

export function GameOverPage() {
  const { state, startNewGame } = useGame();
  const navigate = useNavigate();
  const isApproved = state.gameResult === "MERGER_APPROVED";

  const handleRestart = () => {
    startNewGame();
    navigate("/intro");
  };

  if (isApproved) {
    return (
      <GameResultScene
        state={state}
        backgroundImage="/due_diligence_approved_simpsom.avif"
        eyebrow={copy.gameOver.approvedEyebrow}
        title={copy.gameOver.approvedTitle}
        text={copy.gameOver.approvedText}
        alert={copy.gameOver.approvedAlert}
        modalTitle={copy.gameOver.approvedModalTitle}
        modalText={copy.gameOver.approvedModalText}
        dismissLabel={copy.gameOver.approvedDismiss}
        icon={faHandshake}
        alertIcon={faCircleCheck}
        modalId="approved-modal-title"
        accentClassName="text-broker-merger"
        alertClassName="bg-broker-merger text-broker-bg"
        modalBorderClassName="border-broker-merger"
        onRestart={handleRestart}
      />
    );
  }

  return (
    <MobileShell>
      <main className="flex flex-1 flex-col justify-between px-5 py-7">
        <section>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-broker-lime">
            {copy.gameOver.manualEyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-black leading-tight text-broker-ink">
            {copy.gameOver.manualTitle}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-broker-muted">
            {copy.gameOver.manualText}
          </p>

          <div className="mt-8">
            <GameStatsGrid state={state} />
          </div>
        </section>

        <section className="mt-8 space-y-3">
          <button
            type="button"
            onClick={handleRestart}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-broker-green px-4 text-sm font-black text-white"
          >
            <FontAwesomeIcon icon={faRotateRight} className="h-4 w-4" aria-hidden="true" />
            {copy.gameOver.newSession}
          </button>
          <Link
            to="/"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-md border border-broker-border bg-broker-surface px-4 text-sm font-black text-broker-ink"
          >
            {copy.gameOver.backHome}
          </Link>
        </section>
      </main>
    </MobileShell>
  );
}
