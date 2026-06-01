import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faMinus, faPercent, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import type { GamePhase, Round } from "../../domain/types";
import { copy } from "../../lang";

interface RoundCardProps {
  round: Round;
  roundNumber: number;
  phase: GamePhase;
}

export function RoundCard({ round, roundNumber, phase }: RoundCardProps) {
  const [visibleAnswerRoundId, setVisibleAnswerRoundId] = useState<string | null>(null);
  const isAnswerVisible = visibleAnswerRoundId === round.id;

  const canReveal = round.requiresAnswerReveal && !isAnswerVisible;

  return (
    <article className="flex min-h-[260px] flex-col rounded-md border border-broker-border bg-broker-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-broker-lime">{copy.rounds.round(roundNumber)}</p>
          <h1 className="mt-1 text-lg font-black text-broker-ink">{round.title}</h1>
        </div>
        {round.requiresAnswerReveal ? (
          <button
            type="button"
            disabled={!canReveal}
            onClick={() => setVisibleAnswerRoundId(round.id)}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-broker-border bg-broker-bg text-broker-audit disabled:cursor-not-allowed disabled:opacity-45"
            aria-label={isAnswerVisible ? copy.rounds.revealedAnswer : copy.rounds.revealAnswer}
          >
            <FontAwesomeIcon icon={isAnswerVisible ? faEyeSlash : faEye} className="h-5 w-5" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <div className="mt-5 flex-1">
        <p className="text-base leading-relaxed text-broker-ink">{round.text}</p>
        {round.requiresAnswerReveal && isAnswerVisible ? (
          <div className="mt-4 rounded-md border border-broker-audit/70 bg-broker-audit/10 p-3">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-broker-audit">{copy.rounds.answerFromBride}</p>
            <p className="mt-1 text-sm text-broker-ink">{round.answer || copy.rounds.pendingAnswer}</p>
          </div>
        ) : null}
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-1.5 text-[11px]">
        <div className="flex min-w-0 items-center justify-center gap-1 rounded bg-broker-bg px-1.5 py-1">
          <dt className="flex min-w-0 items-center gap-1 text-broker-muted">
            <FontAwesomeIcon icon={faPlus} className="h-3 w-3" aria-hidden="true" />
            <span className="truncate">{copy.rounds.success}</span>
          </dt>
          <dd className="shrink-0 font-black text-broker-bullish">+{round.successScore}</dd>
        </div>
        <div className="flex min-w-0 items-center justify-center gap-1 rounded bg-broker-bg px-1.5 py-1">
          <dt className="flex min-w-0 items-center gap-1 text-broker-muted">
            <FontAwesomeIcon icon={faPercent} className="h-3 w-3" aria-hidden="true" />
            <span className="truncate">{copy.rounds.partial}</span>
          </dt>
          <dd className="shrink-0 font-black text-broker-warning">{round.allowsPartial ? `+${round.partialSuccessScore ?? 0}` : copy.common.no}</dd>
        </div>
        <div className="flex min-w-0 items-center justify-center gap-1 rounded bg-broker-bg px-1.5 py-1">
          <dt className="flex min-w-0 items-center gap-1 text-broker-muted">
            <FontAwesomeIcon icon={faMinus} className="h-3 w-3" aria-hidden="true" />
            <span className="truncate">{copy.rounds.failure}</span>
          </dt>
          <dd className="shrink-0 font-black text-broker-bearish">-{round.failureScorePenalty}</dd>
        </div>
      </dl>

      {phase === "RESOLVED" ? (
        <p className="mt-4 rounded-md bg-broker-bg px-3 py-2 text-xs font-bold text-broker-lime">
          {copy.rounds.resolved}
        </p>
      ) : null}
    </article>
  );
}
