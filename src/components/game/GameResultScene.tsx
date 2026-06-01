import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { GameState } from "../../domain/types";
import { copy } from "../../lang";
import { MobileShell } from "../layout/MobileShell";
import { GameStatsGrid } from "./GameStatsGrid";

interface GameResultSceneProps {
  state: GameState;
  backgroundImage: string;
  eyebrow: string;
  title: string;
  text: string;
  alert: string;
  modalTitle: string;
  modalText: string;
  dismissLabel: string;
  icon: IconDefinition;
  alertIcon: IconDefinition;
  modalId: string;
  accentClassName: string;
  alertClassName: string;
  modalBorderClassName: string;
  modalTitleClassName?: string;
  titleClassName?: string;
  textClassName?: string;
  headerClassName?: string;
  onRestart: () => void;
}

export function GameResultScene({
  state,
  backgroundImage,
  eyebrow,
  title,
  text,
  alert,
  modalTitle,
  modalText,
  dismissLabel,
  icon,
  alertIcon,
  modalId,
  accentClassName,
  alertClassName,
  modalBorderClassName,
  modalTitleClassName = "text-white",
  titleClassName = "text-white",
  textClassName = "text-white/85",
  headerClassName = "",
  onRestart
}: GameResultSceneProps) {
  const [showModal, setShowModal] = useState(true);

  return (
    <MobileShell>
      <main
        className="relative flex min-h-dvh flex-1 flex-col overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-broker-bg/80 to-black/45" aria-hidden="true" />

        <section className="relative z-10 flex flex-1 flex-col justify-between px-5 py-7">
          <div className={headerClassName}>
            <p className={`text-xs font-black uppercase tracking-[0.16em] ${accentClassName}`}>{eyebrow}</p>
            <h1 className={`mt-3 text-4xl font-black leading-none drop-shadow ${titleClassName}`}>{title}</h1>
            <p className={`mt-3 max-w-sm text-sm font-semibold leading-relaxed ${textClassName}`}>{text}</p>
          </div>

          {!showModal ? (
            <motion.div
              className="mt-8 space-y-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <GameStatsGrid state={state} />
              <button
                type="button"
                onClick={onRestart}
                className={`inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md px-4 text-sm font-black ${alertClassName}`}
              >
                <FontAwesomeIcon icon={faRotateRight} className="h-4 w-4" aria-hidden="true" />
                {copy.gameOver.newSession}
              </button>
            </motion.div>
          ) : null}
        </section>

        <AnimatePresence>
          {showModal ? (
            <motion.div
              className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 px-5"
              role="dialog"
              aria-modal="true"
              aria-labelledby={modalId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.section
                className={`w-full max-w-sm rounded-md border bg-broker-bg p-5 text-center shadow-danger ${modalBorderClassName}`}
                initial={{ opacity: 0, y: 28, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.96 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <motion.div
                  className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full shadow-glow ${alertClassName}`}
                  animate={{ rotate: [0, -7, 7, -4, 4, 0], scale: [1, 1.08, 1] }}
                  transition={{ duration: 1.15, repeat: Infinity, repeatDelay: 0.7 }}
                >
                  <FontAwesomeIcon icon={icon} className="h-10 w-10" aria-hidden="true" />
                </motion.div>
                <p className={`mt-5 inline-flex items-center justify-center gap-2 rounded-md px-3 py-1 text-xs font-black uppercase tracking-[0.14em] ${alertClassName}`}>
                  <FontAwesomeIcon icon={alertIcon} className="h-3.5 w-3.5" aria-hidden="true" />
                  {alert}
                </p>
                <h2 id={modalId} className={`mt-4 text-2xl font-black leading-tight ${modalTitleClassName}`}>
                  {modalTitle}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-broker-muted">{modalText}</p>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={`mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-md px-4 text-sm font-black ${alertClassName}`}
                >
                  {dismissLabel}
                </button>
              </motion.section>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>
    </MobileShell>
  );
}
