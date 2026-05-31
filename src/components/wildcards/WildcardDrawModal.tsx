import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faPlay, faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
import type { Wildcard } from "../../domain/types";
import { copy } from "../../lang";

interface WildcardDrawModalProps {
  wildcard: Wildcard;
  onKeep: () => void;
  onUseNow: () => void;
}

export function WildcardDrawModal({ wildcard, onKeep, onUseNow }: WildcardDrawModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/55 px-3 pb-4 pt-10 sm:items-center sm:justify-center sm:p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="wildcard-draw-title"
        className="w-full max-w-[440px] rounded-xl border border-broker-border bg-broker-surface p-4 shadow-2xl"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-broker-soft text-broker-green">
            <FontAwesomeIcon icon={faWandMagicSparkles} className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-broker-green">{copy.wildcards.positiveCard}</p>
            <h2 id="wildcard-draw-title" className="mt-1 text-xl font-black leading-tight text-broker-ink">
              {wildcard.name}
            </h2>
          </div>
        </div>

        <p className="mt-4 text-sm font-black text-broker-ink">{copy.wildcards.activeCatalyst}</p>

        <p className="mt-2 rounded-md border border-broker-border bg-broker-bg p-3 text-sm leading-relaxed text-broker-muted">
          {wildcard.description}
        </p>

        <div className="mt-4 grid gap-2">
          <button
            type="button"
            onClick={onKeep}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-broker-border bg-broker-bg px-4 text-sm font-black text-broker-ink"
          >
            <FontAwesomeIcon icon={faFloppyDisk} className="h-4 w-4" aria-hidden="true" />
            {copy.wildcards.keep}
          </button>
          <button
            type="button"
            onClick={onUseNow}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-broker-green px-4 text-sm font-black text-white"
          >
            <FontAwesomeIcon icon={faPlay} className="h-4 w-4" aria-hidden="true" />
            {copy.wildcards.useNow}
          </button>
        </div>
      </section>
    </div>
  );
}
