import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTrendUp, faChartSimple } from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion } from "framer-motion";
import type { Round } from "../../domain/types";
import { copy } from "../../lang";

interface RoundAdvanceModalProps {
  isOpen: boolean;
  round: Round;
  roundNumber: number;
}

export function RoundAdvanceModal({ isOpen, round, roundNumber }: RoundAdvanceModalProps) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-broker-bg/75 px-5 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-live="polite"
        >
          <motion.section
            role="status"
            className="w-full max-w-[360px] rounded-xl border border-broker-green/60 bg-broker-surface p-5 text-center shadow-glow"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-broker-soft text-broker-greenDark">
              <FontAwesomeIcon icon={faArrowTrendUp} className="h-6 w-6" aria-hidden="true" />
            </div>
            <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-broker-green">
              {copy.rounds.newOperation}
            </p>
            <h2 className="mt-2 text-3xl font-black text-broker-ink">{copy.rounds.round(roundNumber)}</h2>
            <div className="mt-4 rounded-md border border-broker-border bg-broker-bg p-3">
              <p className="flex items-center justify-center gap-2 text-sm font-black text-broker-ink">
                <FontAwesomeIcon icon={faChartSimple} className="h-4 w-4 text-broker-green" aria-hidden="true" />
                {copy.rounds.typeLabels[round.type]}
              </p>
              <p className="mt-1 text-xs text-broker-muted">{round.title}</p>
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
