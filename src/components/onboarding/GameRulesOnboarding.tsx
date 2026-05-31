import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faBullseye,
  faChartLine,
  faMartiniGlass,
  faPlay,
  faShieldHalved,
  faWandMagicSparkles,
  type IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

interface OnboardingStep {
  icon: IconDefinition;
  eyebrow: string;
  title: string;
  text: string;
}

interface GameRulesOnboardingProps {
  finalLabel: string;
  onComplete: () => void;
  onSkip?: () => void;
}

const onboardingSteps: OnboardingStep[] = [
  {
    icon: faChartLine,
    eyebrow: "Dinámica",
    title: "Una sesión bursátil para Iñigo",
    text: "Cada ronda funciona como una operación de mercado: pregunta, prueba o evento. El Consejo marca acierto, parcial o fallo y la cotización se mueve al instante."
  },
  {
    icon: faBullseye,
    eyebrow: "Objetivo",
    title: "Llegar a 190 puntos",
    text: "Iñigo Capital S.A. empieza en 100 puntos. Al alcanzar 190 se desbloquea el Cierre de Fusión con Rocío Holdings, pero todavía tendrá que superar la Due Diligence final."
  },
  {
    icon: faShieldHalved,
    eyebrow: "Riesgo",
    title: "Zona crítica y rescate",
    text: "Si baja a 70 puntos entra en Zona Crítica: cada fallo sale más caro. Si cae a 40 o menos, el Banco Central exige un rescate obligatorio antes de seguir."
  },
  {
    icon: faWandMagicSparkles,
    eyebrow: "Herramientas",
    title: "Catalizadores de Mercado",
    text: "Durante la partida, Iñigo podrá recibir Catalizadores de Mercado: eventos espontáneos que alteran la cotización, modifican las reglas de la ronda o activan efectos acumulados. Solo puede activarse un catalizador por ronda."
  },
  {
    icon: faMartiniGlass,
    eyebrow: "Cómo jugar",
    title: "El mercado decide",
    text: "El grupo lee la carta, escucha la respuesta de Iñigo y registra el resultado. La app guarda puntos, tragos, rondas resueltas, máximos, mínimos y estado de mercado."
  }
];

export function GameRulesOnboarding({ finalLabel, onComplete, onSkip }: GameRulesOnboardingProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const currentStep = onboardingSteps[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === onboardingSteps.length - 1;

  const goNext = () => {
    if (isLastStep) {
      onComplete();
      return;
    }

    setStepIndex((current) => current + 1);
  };

  const goBack = () => {
    setStepIndex((current) => Math.max(current - 1, 0));
  };

  return (
    <div className="w-full rounded-xl border border-broker-border bg-broker-surface p-5 shadow-glow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-broker-soft text-broker-greenDark">
          <FontAwesomeIcon icon={currentStep.icon} className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="rounded-full bg-broker-bg px-3 py-1 text-xs font-black text-broker-muted">
          {stepIndex + 1}/{onboardingSteps.length}
        </div>
      </div>

      <p className="mt-5 text-xs font-black uppercase tracking-[0.16em] text-broker-green">
        {currentStep.eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-black leading-tight text-broker-ink">{currentStep.title}</h2>
      <p className="mt-4 text-base leading-relaxed text-broker-muted">{currentStep.text}</p>

      <div className="mt-6 grid grid-cols-5 gap-2" aria-hidden="true">
        {onboardingSteps.map((step, index) => (
          <span
            key={step.title}
            className={`h-1.5 rounded-full ${index <= stepIndex ? "bg-broker-green" : "bg-broker-border"}`}
          />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-[auto_1fr] gap-3">
        <button
          type="button"
          onClick={goBack}
          disabled={isFirstStep}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-broker-border px-4 text-sm font-black text-broker-ink disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" aria-hidden="true" />
          Atrás
        </button>
        <button
          type="button"
          onClick={goNext}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-broker-green px-4 text-sm font-black text-white"
        >
          <FontAwesomeIcon icon={isLastStep ? faPlay : faArrowRight} className="h-4 w-4" aria-hidden="true" />
          {isLastStep ? finalLabel : "Siguiente"}
        </button>
      </div>

      {onSkip ? (
        <button
          type="button"
          onClick={onSkip}
          className="mt-3 min-h-10 w-full rounded-md text-sm font-bold text-broker-muted"
        >
          Omitir explicación
        </button>
      ) : null}
    </div>
  );
}
