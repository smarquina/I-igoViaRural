import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardCheck, faLandmark, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../app/GameContext";
import type { BailoutChoice } from "../domain/types";
import { MobileShell } from "../components/layout/MobileShell";
import { MarketHeader } from "../components/market/MarketHeader";
import { bailoutOptions, streetChallenges } from "../data/gameContent";
import { copy } from "../lang";

export function BailoutPage() {
  const { applyBailout } = useGame();
  const [challenge] = useState(() => streetChallenges[Math.floor(Math.random() * streetChallenges.length) % streetChallenges.length]);
  const navigate = useNavigate();

  const handleChoice = (choice: BailoutChoice) => {
    applyBailout(choice);
    navigate("/game");
  };

  return (
    <MobileShell>
      <MarketHeader />
      <main className="flex-1 overflow-y-auto px-4 py-5">
        <div className="rounded-md border border-broker-bearish bg-broker-bearish/15 p-4">
          <div className="flex items-center gap-2 text-broker-bearish">
            <FontAwesomeIcon icon={faLandmark} className="h-5 w-5" aria-hidden="true" />
            <p className="text-xs font-black uppercase tracking-[0.16em]">{copy.bailout.eyebrow}</p>
          </div>
          <h1 className="mt-2 text-2xl font-black text-broker-ink">{copy.bailout.title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-broker-ink">
            {copy.bailout.text}
          </p>
        </div>

        <section className="mt-5 space-y-3" aria-label={copy.bailout.title}>
          {bailoutOptions.filter((choice) => choice.selectable !== false).map((choice) => {
            const challengeActions = choice.kind === "STREET_CHALLENGE" ? choice.actions : undefined;

            return (
              <article
                key={choice.id}
                className="rounded-md border border-broker-border bg-broker-surface p-4"
              >
              <strong className="block text-sm text-broker-ink">{choice.title}</strong>
              <span className="mt-1 block text-sm leading-relaxed text-broker-muted">{choice.detail}</span>

              {choice.kind === "STREET_CHALLENGE" && challenge ? (
                <div className="mt-3 rounded-md border border-broker-border bg-broker-bg/70 p-3">
                  <h2 className="text-sm font-black text-broker-ink">{challenge.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-broker-muted">{challenge.text}</p>
                  <p className="mt-3 text-xs font-black uppercase tracking-[0.12em] text-broker-muted">{copy.bailout.instructions}</p>
                  <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-broker-muted">
                    {challenge.instructions.map((instruction) => (
                      <li key={instruction} className="flex gap-2">
                        <FontAwesomeIcon icon={faClipboardCheck} className="mt-0.5 h-3.5 w-3.5 shrink-0 text-broker-green" aria-hidden="true" />
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ul>
                  {challenge.examplePitch ? (
                    <p className="mt-3 rounded-md border border-broker-border bg-broker-surface px-3 py-2 text-xs leading-relaxed text-broker-muted">
                      <strong className="text-broker-ink">{copy.bailout.examplePitch}:</strong> {challenge.examplePitch}
                    </p>
                  ) : null}
                  <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
                    <p className="rounded-md border border-broker-bullish/40 bg-broker-bullish/10 px-3 py-2 text-broker-greenDark">
                      <strong>{copy.bailout.successCriteria}:</strong> {challenge.successCriteria}
                    </p>
                    <p className="rounded-md border border-broker-bearish/40 bg-broker-bearish/10 px-3 py-2 text-broker-bearish">
                      <strong>{copy.bailout.failureCriteria}:</strong> {challenge.failureCriteria}
                    </p>
                  </div>
                  <p className="mt-3 flex gap-2 rounded-md border border-broker-warning/40 bg-broker-warning/10 px-3 py-2 text-xs text-broker-ink">
                    <FontAwesomeIcon icon={faTriangleExclamation} className="mt-0.5 h-3.5 w-3.5 shrink-0 text-broker-warning" aria-hidden="true" />
                    <span><strong>{copy.bailout.safetyNote}:</strong> {challenge.safetyNote}</span>
                  </p>
                </div>
              ) : null}

              {challengeActions ? (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleChoice(challengeActions.successChoiceId)}
                    className="min-h-11 rounded-md bg-broker-green px-3 text-sm font-black text-white"
                    aria-label={copy.bailout.executeChoice(`${choice.title}: ${copy.bailout.challengeSuccess}`)}
                  >
                    {copy.bailout.challengeSuccess}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChoice(challengeActions.failureChoiceId)}
                    className="min-h-11 rounded-md border border-broker-bearish bg-broker-bearish/15 px-3 text-sm font-black text-broker-bearish"
                    aria-label={copy.bailout.executeChoice(`${choice.title}: ${copy.bailout.challengeFailure}`)}
                  >
                    {copy.bailout.challengeFailure}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleChoice(choice.id)}
                  className="mt-3 min-h-11 w-full rounded-md bg-broker-green px-4 text-sm font-black text-white"
                  aria-label={copy.bailout.executeChoice(choice.title)}
                >
                  {copy.bailout.execute}
                </button>
              )}
              </article>
            );
          })}
        </section>
      </main>
    </MobileShell>
  );
}
