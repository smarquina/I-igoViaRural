import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faScrewdriverWrench } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useGame } from "../app/GameContext";
import { MobileShell } from "../components/layout/MobileShell";
import { GameRulesOnboarding } from "../components/onboarding/GameRulesOnboarding";
import { copy } from "../lang";

export function HomePage() {
  const { hasStartedGame, startNewGame } = useGame();
  const [showRules, setShowRules] = useState(false);
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
              <img
                src="/icon.avif"
                alt={copy.app.appIconAlt}
                className="h-12 w-12 shrink-0 rounded-xl border border-broker-border bg-broker-surface object-cover shadow-sm"
              />
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
              <FontAwesomeIcon icon={faScrewdriverWrench} className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </header>

        {showRules ? (
          <section className="flex flex-1 items-center py-6" aria-label={copy.home.initialExplanation}>
            <GameRulesOnboarding finalLabel={copy.home.startGame} onComplete={handleNewGame} onSkip={handleNewGame} />
          </section>
        ) : (
          <motion.section
            className="relative -mx-5 mt-4 flex min-h-[calc(100vh-8.5rem)] flex-1 items-end justify-center overflow-hidden rounded-md border border-broker-border px-5 pb-8 text-center shadow-glow"
            aria-label={copy.home.splashLabel}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <img
              src="/crazy_guy.avif"
              alt={copy.home.crazyGuyAlt}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-broker-bg via-broker-bg/30 to-transparent" aria-hidden="true" />
            <motion.button
              type="button"
              onClick={() => setShowRules(true)}
              className="relative z-10 min-h-12 w-full max-w-sm rounded-md bg-broker-green px-4 text-sm font-black text-white shadow-sm"
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.98 }}
              transition={{ delay: 0.2, duration: 0.45, ease: "easeOut" }}
            >
              {copy.home.startIntro}
            </motion.button>
          </motion.section>
        )}
      </main>
    </MobileShell>
  );
}
