import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faFloppyDisk, faPlay, faTriangleExclamation, faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion } from "framer-motion";
import type { Wildcard } from "../../domain/types";
import { isPositiveWildcard } from "../../domain/wildcardEngine";
import { copy } from "../../lang";

interface WildcardDrawModalProps {
  wildcard: Wildcard;
  onKeep: () => void;
  onUseNow: () => void;
  onDismiss: () => void;
}

export function WildcardDrawModal({ wildcard, onKeep, onUseNow, onDismiss }: WildcardDrawModalProps) {
  const isPositive = isPositiveWildcard(wildcard);
  const accentClass = isPositive
    ? "border-broker-green/60 text-broker-green"
    : "border-broker-bearish/70 text-broker-bearish";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-broker-bg/75 px-5 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.section
          role="dialog"
          aria-modal="true"
          aria-labelledby="wildcard-draw-title"
          className={`w-full max-w-[360px] rounded-xl border bg-broker-surface p-5 text-center shadow-glow ${accentClass}`}
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -12 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-broker-soft">
            <FontAwesomeIcon
              icon={isPositive ? faWandMagicSparkles : faTriangleExclamation}
              className="h-6 w-6"
              aria-hidden="true"
            />
          </div>
          <p className={`mt-4 text-xs font-black uppercase tracking-[0.18em] ${isPositive ? "text-broker-green" : "text-broker-bearish"}`}>
            {isPositive ? copy.wildcards.positiveCard : copy.wildcards.negativeCard}
          </p>
          <h2 id="wildcard-draw-title" className="mt-2 text-3xl font-black leading-tight text-broker-ink">
            {wildcard.name}
          </h2>
          <div className="mt-4 rounded-md border border-broker-border bg-broker-bg p-3">
            <p className="flex items-center justify-center gap-2 text-sm font-black text-broker-ink">
              <FontAwesomeIcon
                icon={isPositive ? faWandMagicSparkles : faTriangleExclamation}
                className={`h-4 w-4 ${isPositive ? "text-broker-green" : "text-broker-bearish"}`}
                aria-hidden="true"
              />
              {copy.wildcards.activeCatalyst}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-broker-muted">{wildcard.description}</p>
          </div>

          {isPositive ? (
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
          ) : (
            <button
              type="button"
              onClick={onDismiss}
              className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-broker-bearish px-4 text-sm font-black text-white"
            >
              <FontAwesomeIcon icon={faCircleCheck} className="h-4 w-4" aria-hidden="true" />
              {copy.wildcards.dismiss}
            </button>
          )}
        </motion.section>
      </motion.div>
    </AnimatePresence>
  );
}
