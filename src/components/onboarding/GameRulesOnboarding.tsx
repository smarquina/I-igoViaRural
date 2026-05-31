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
import { copy } from "../../lang";

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
    ...copy.onboarding.steps[0]
  },
  {
    icon: faBullseye,
    ...copy.onboarding.steps[1]
  },
  {
    icon: faShieldHalved,
    ...copy.onboarding.steps[2]
  },
  {
    icon: faWandMagicSparkles,
    ...copy.onboarding.steps[3]
  },
  {
    icon: faMartiniGlass,
    ...copy.onboarding.steps[4]
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
        <div className="rounded-full bg-broker-bg px-3 py-1 text-xs font-black text-broker-ink">
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
          {copy.onboarding.back}
        </button>
        <button
          type="button"
          onClick={goNext}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-broker-green px-4 text-sm font-black text-white"
        >
          <FontAwesomeIcon icon={isLastStep ? faPlay : faArrowRight} className="h-4 w-4" aria-hidden="true" />
          {isLastStep ? finalLabel : copy.onboarding.next}
        </button>
      </div>

      {onSkip ? (
        <button
          type="button"
          onClick={onSkip}
          className="mt-3 min-h-10 w-full rounded-md text-sm font-bold text-broker-muted"
        >
          {copy.onboarding.skip}
        </button>
      ) : null}
    </div>
  );
}
