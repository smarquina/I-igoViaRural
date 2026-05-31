import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBuildingColumns } from "@fortawesome/free-solid-svg-icons";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useGame } from "../app/GameContext";
import { MobileShell } from "../components/layout/MobileShell";
import { GameRulesOnboarding } from "../components/onboarding/GameRulesOnboarding";
import { copy } from "../lang";

export function HomePage() {
  const { hasStartedGame, startNewGame } = useGame();
  const navigate = useNavigate();

  const handleNewGame = () => {
    startNewGame();
    navigate("/game");
  };

  if (hasStartedGame) {
    return <Navigate to="/game" replace />;
  }

  return (
    <MobileShell>
      <main className="flex flex-1 flex-col px-5 py-6">
        <header>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-broker-border bg-broker-surface text-broker-green shadow-sm">
                <FontAwesomeIcon icon={faBuildingColumns} className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-broker-green">{copy.app.gameTitle}</p>
                <h1 className="mt-1 text-xl font-black leading-tight text-broker-ink">Iñigo Capital S.A.</h1>
              </div>
            </div>
            <Link
              to="/settings"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-broker-border bg-broker-surface text-broker-ink"
              aria-label={copy.app.openSettings}
            >
              <FontAwesomeIcon icon={faBars} className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </header>

        <section className="flex flex-1 items-center py-6" aria-label={copy.home.initialExplanation}>
          <GameRulesOnboarding finalLabel={copy.home.startGame} onComplete={handleNewGame} onSkip={handleNewGame} />
        </section>
      </main>
    </MobileShell>
  );
}
