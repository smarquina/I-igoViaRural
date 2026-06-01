import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faClipboardCheck, faTriangleExclamation, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../app/GameContext";
import { MobileShell } from "../components/layout/MobileShell";
import { MarketHeader } from "../components/market/MarketHeader";
import { auditQuestions, generalCultureQuestions, streetChallenges } from "../data/gameContent";
import { buildMergerAttempt, resolveMergerAttempt } from "../domain/mergerEngine";
import type { MergerPhase, MergerPhaseOutcome } from "../domain/types";
import { copy } from "../lang";

interface MergerPhaseCardProps {
  phase: MergerPhase;
  outcome?: MergerPhaseOutcome;
  isAnswerVisible: boolean;
  onRevealAnswer: (phaseId: string) => void;
  onSelectOutcome: (phaseId: string, outcome: MergerPhaseOutcome) => void;
}

function MergerAnswerBlock({
  phase,
  isAnswerVisible,
  onRevealAnswer
}: Pick<MergerPhaseCardProps, "phase" | "isAnswerVisible" | "onRevealAnswer">) {
  if (!phase.answer) {
    return null;
  }

  if (phase.requiresAnswerReveal && !isAnswerVisible) {
    return (
      <button
        type="button"
        onClick={() => onRevealAnswer(phase.id)}
        className="mt-3 min-h-10 rounded-md border border-broker-border bg-broker-bg px-3 text-xs font-black text-broker-ink"
      >
        {copy.merger.revealAnswer}
      </button>
    );
  }

  return (
    <p className="mt-3 rounded-md border border-broker-border bg-broker-bg/70 px-3 py-2 text-xs font-semibold text-broker-muted">
      <strong className="text-broker-ink">{copy.merger.answer}:</strong> {phase.answer}
    </p>
  );
}

function MergerInstructionsBlock({ instructions }: { instructions?: string[] }) {
  if (!instructions?.length) {
    return null;
  }

  return (
    <div className="mt-3 rounded-md bg-broker-bg/70 p-3">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-broker-muted">{copy.merger.instructions}</p>
      <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-broker-muted">
        {instructions.map((instruction) => (
          <li key={instruction} className="flex gap-2">
            <FontAwesomeIcon icon={faClipboardCheck} className="mt-0.5 h-3.5 w-3.5 shrink-0 text-broker-green" aria-hidden="true" />
            <span>{instruction}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MergerExamplesBlock({ phase }: { phase: MergerPhase }) {
  if (phase.examples?.length) {
    return (
      <div className="mt-3 text-xs text-broker-muted">
        <strong className="font-black text-broker-ink">{copy.merger.examples}:</strong> {phase.examples.join(", ")}
      </div>
    );
  }

  if (phase.examplePitch) {
    return (
      <p className="mt-3 rounded-md border border-broker-border bg-broker-bg/70 px-3 py-2 text-xs leading-relaxed text-broker-muted">
        <strong className="text-broker-ink">{copy.merger.examplePitch}:</strong> {phase.examplePitch}
      </p>
    );
  }

  return null;
}

function MergerCriteriaBlock({ phase }: { phase: MergerPhase }) {
  if (!phase.successCriteria && !phase.failureCriteria) {
    return null;
  }

  return (
    <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
      {phase.successCriteria ? (
        <p className="rounded-md border border-broker-bullish/40 bg-broker-bullish/10 px-3 py-2 text-broker-greenDark">
          <strong>{copy.merger.successCriteria}:</strong> {phase.successCriteria}
        </p>
      ) : null}
      {phase.failureCriteria ? (
        <p className="rounded-md border border-broker-bearish/40 bg-broker-bearish/10 px-3 py-2 text-broker-bearish">
          <strong>{copy.merger.failureCriteria}:</strong> {phase.failureCriteria}
        </p>
      ) : null}
    </div>
  );
}

function MergerSafetyNote({ safetyNote }: { safetyNote?: string }) {
  if (!safetyNote) {
    return null;
  }

  return (
    <p className="mt-3 flex gap-2 rounded-md border border-broker-warning/40 bg-broker-warning/10 px-3 py-2 text-xs text-broker-ink">
      <FontAwesomeIcon icon={faTriangleExclamation} className="mt-0.5 h-3.5 w-3.5 shrink-0 text-broker-warning" aria-hidden="true" />
      <span><strong>{copy.merger.safetyNote}:</strong> {safetyNote}</span>
    </p>
  );
}

function MergerScoreBadges({ phase }: { phase: MergerPhase }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2 text-xs font-black">
      <span className="rounded-md bg-broker-bullish/15 px-2.5 py-1 text-broker-greenDark">
        {copy.merger.pointsOnSuccess(phase.successScore)}
      </span>
      {phase.allowsPartial && phase.partialSuccessScore ? (
        <span className="rounded-md bg-broker-warning/15 px-2.5 py-1 text-broker-warning">
          {copy.merger.pointsOnPartial(phase.partialSuccessScore)}
        </span>
      ) : null}
      <span className="rounded-md bg-broker-bearish/15 px-2.5 py-1 text-broker-bearish">
        {copy.merger.penaltyOnFailure(phase.failureScorePenalty, phase.failureDrinks)}
      </span>
    </div>
  );
}

interface MergerOutcomeButtonsProps {
  phase: MergerPhase;
  outcome?: MergerPhaseOutcome;
  onSelectOutcome: (phaseId: string, outcome: MergerPhaseOutcome) => void;
}

function MergerOutcomeButtons({ phase, outcome, onSelectOutcome }: MergerOutcomeButtonsProps) {
  return (
    <div className="mt-3 grid grid-cols-3 gap-2">
      <button
        type="button"
        onClick={() => onSelectOutcome(phase.id, "SUCCESS")}
        className={`min-h-10 rounded-md border px-2 text-xs font-black ${
          outcome === "SUCCESS"
            ? "border-broker-bullish bg-broker-bullish text-broker-bg"
            : "border-broker-border bg-broker-bg text-broker-muted"
        }`}
      >
        {copy.merger.markSuccess}
      </button>
      <button
        type="button"
        disabled={!phase.allowsPartial}
        onClick={() => onSelectOutcome(phase.id, "PARTIAL")}
        className={`min-h-10 rounded-md border px-2 text-xs font-black disabled:cursor-not-allowed disabled:opacity-40 ${
          outcome === "PARTIAL"
            ? "border-broker-warning bg-broker-warning text-broker-bg"
            : "border-broker-border bg-broker-bg text-broker-muted"
        }`}
      >
        {copy.merger.markPartial}
      </button>
      <button
        type="button"
        onClick={() => onSelectOutcome(phase.id, "FAILURE")}
        className={`min-h-10 rounded-md border px-2 text-xs font-black ${
          outcome === "FAILURE"
            ? "border-broker-bearish bg-broker-bearish text-white"
            : "border-broker-border bg-broker-bg text-broker-muted"
        }`}
      >
        {copy.merger.markFailure}
      </button>
    </div>
  );
}

function MergerPhaseCard({
  phase,
  outcome,
  isAnswerVisible,
  onRevealAnswer,
  onSelectOutcome
}: MergerPhaseCardProps) {
  const isPassed = outcome === "SUCCESS";

  return (
    <article
      className={`rounded-md border p-4 ${
        isPassed
          ? "border-broker-bullish bg-broker-bullish/15 text-broker-greenDark"
          : "border-broker-border bg-broker-surface text-broker-ink"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-broker-muted">
            {copy.merger.phaseKinds[phase.kind]}
          </p>
          <h2 className="mt-1 text-base font-black text-broker-ink">{phase.title}</h2>
        </div>
        <FontAwesomeIcon icon={isPassed ? faCircleCheck : faXmark} className={`mt-1 h-5 w-5 shrink-0 ${isPassed ? "text-broker-bullish" : "text-broker-muted"}`} aria-hidden="true" />
      </div>

      <p className="mt-3 text-sm leading-relaxed text-broker-muted">{phase.text}</p>

      <MergerAnswerBlock phase={phase} isAnswerVisible={isAnswerVisible} onRevealAnswer={onRevealAnswer} />
      <MergerInstructionsBlock instructions={phase.instructions} />
      <MergerExamplesBlock phase={phase} />
      <MergerCriteriaBlock phase={phase} />
      <MergerSafetyNote safetyNote={phase.safetyNote} />
      <MergerScoreBadges phase={phase} />
      <MergerOutcomeButtons phase={phase} outcome={outcome} onSelectOutcome={onSelectOutcome} />
    </article>
  );
}

export function MergerAttemptPage() {
  const { applyMergerResult } = useGame();
  const [phases] = useState(() => buildMergerAttempt(auditQuestions, streetChallenges, generalCultureQuestions));
  const [outcomeByPhaseId, setOutcomeByPhaseId] = useState<Record<string, MergerPhaseOutcome>>({});
  const [revealedAnswerIds, setRevealedAnswerIds] = useState<Set<string>>(() => new Set());
  const navigate = useNavigate();

  const successfulPhases = phases.filter((phase) => outcomeByPhaseId[phase.id] === "SUCCESS").length;

  const handleRevealAnswer = (phaseId: string) => {
    setRevealedAnswerIds((current) => {
      const next = new Set(current);
      next.add(phaseId);
      return next;
    });
  };

  const handleSelectOutcome = (phaseId: string, outcome: MergerPhaseOutcome) => {
    setOutcomeByPhaseId((current) => ({
      ...current,
      [phaseId]: outcome
    }));
  };

  const handleSubmit = () => {
    const resolution = resolveMergerAttempt(
      phases,
      phases.map((phase) => ({
        phaseId: phase.id,
        outcome: outcomeByPhaseId[phase.id] ?? "FAILURE"
      }))
    );

    applyMergerResult(resolution);
    navigate(resolution.successfulPhases >= 2 ? "/game-over" : "/game");
  };

  return (
    <MobileShell>
      <MarketHeader />
      <main className="flex-1 overflow-y-auto px-4 py-5">
        <div className="rounded-md border border-broker-merger bg-broker-merger/15 p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-broker-merger">{copy.merger.eyebrow}</p>
          <h1 className="mt-2 text-2xl font-black text-broker-ink">{copy.merger.title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-broker-greenDark">
            {copy.merger.text}
          </p>
        </div>

        <section className="mt-5 space-y-3" aria-label={copy.merger.title}>
          {phases.map((phase) => {
            const outcome = outcomeByPhaseId[phase.id];
            const isAnswerVisible = Boolean(phase.answer) && (!phase.requiresAnswerReveal || revealedAnswerIds.has(phase.id));

            return (
              <MergerPhaseCard
                key={phase.id}
                phase={phase}
                outcome={outcome}
                isAnswerVisible={isAnswerVisible}
                onRevealAnswer={handleRevealAnswer}
                onSelectOutcome={handleSelectOutcome}
              />
          );
          })}
        </section>

        <button
          type="button"
          onClick={handleSubmit}
          className="mt-5 min-h-12 w-full rounded-md bg-broker-green px-4 text-sm font-black text-white"
        >
          {copy.merger.registerResult(successfulPhases)}
        </button>
      </main>
    </MobileShell>
  );
}
