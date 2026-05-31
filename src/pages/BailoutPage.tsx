import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLandmark } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useGame } from "../app/GameContext";
import type { BailoutChoice } from "../domain/types";
import { MobileShell } from "../components/layout/MobileShell";
import { MarketHeader } from "../components/market/MarketHeader";
import { copy } from "../lang";

const choices: Array<{ id: BailoutChoice; title: string; detail: string }> = [
  {
    id: "LIQUIDITY",
    ...copy.bailout.choices.LIQUIDITY
  },
  {
    id: "SELL_ASSETS",
    ...copy.bailout.choices.SELL_ASSETS
  },
  {
    id: "EXTRA_AUDIT_SUCCESS",
    ...copy.bailout.choices.EXTRA_AUDIT_SUCCESS
  },
  {
    id: "EXTRA_AUDIT_FAILURE",
    ...copy.bailout.choices.EXTRA_AUDIT_FAILURE
  }
];

export function BailoutPage() {
  const { applyBailout } = useGame();
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

        <section className="mt-5 space-y-3">
          {choices.map((choice) => (
            <button
              key={choice.id}
              type="button"
              onClick={() => handleChoice(choice.id)}
              className="min-h-20 w-full rounded-md border border-broker-border bg-broker-surface p-4 text-left"
            >
              <strong className="block text-sm text-broker-ink">{choice.title}</strong>
              <span className="mt-1 block text-sm text-broker-muted">{choice.detail}</span>
            </button>
          ))}
        </section>
      </main>
    </MobileShell>
  );
}
