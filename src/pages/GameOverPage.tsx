import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useGame } from "../app/GameContext";
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

  return (
    <MobileShell>
      <main className="flex flex-1 flex-col justify-between px-5 py-7">
        <section>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-broker-lime">
            {isApproved ? copy.gameOver.approvedEyebrow : copy.gameOver.manualEyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-black leading-tight text-broker-ink">
            {isApproved ? copy.gameOver.approvedTitle : copy.gameOver.manualTitle}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-broker-muted">
            {isApproved
              ? copy.gameOver.approvedText
              : copy.gameOver.manualText}
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-3">
            {[
              [copy.gameOver.stats.score, `${state.score} ${copy.common.pointsShort}`],
              [copy.gameOver.stats.rounds, String(state.resolvedRoundIds.length)],
              [copy.gameOver.stats.successes, String(state.totalSuccesses)],
              [copy.gameOver.stats.partials, String(state.totalPartialSuccesses)],
              [copy.gameOver.stats.failures, String(state.totalFailures)],
              [copy.gameOver.stats.drinks, String(state.totalDrinks)],
              [copy.gameOver.stats.appliedCatalysts, String(state.usedWildcardIds.length)],
              [copy.gameOver.stats.maxQuote, `${Math.max(...state.scoreHistory)} ${copy.common.pointsShort}`]
            ].map(([label, value]) => (
              <div key={label} className="rounded-md border border-broker-border bg-broker-surface p-3">
                <dt className="text-xs text-broker-muted">{label}</dt>
                <dd className="mt-1 text-xl font-black text-broker-ink">{value}</dd>
              </div>
            ))}
          </dl>
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
