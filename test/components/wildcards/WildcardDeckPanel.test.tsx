import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { WildcardDeckPanel } from "../../../src/components/wildcards/WildcardDeckPanel";
import { createSampleState, sampleWildcard } from "../../fixtures";

describe("WildcardDeckPanel", () => {
  it("disables wildcard usage after one wildcard has already been used this round", () => {
    render(
      <WildcardDeckPanel
        state={createSampleState({ hasUsedWildcardThisRound: true })}
        wildcards={[sampleWildcard]}
        effects={[]}
        onUse={vi.fn()}
        onDraw={vi.fn()}
      />
    );

    expect(screen.getByRole("button", { name: /^activar$/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /robar/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /ver ayuda de stop loss/i })).toBeEnabled();
    expect(screen.getByText(/roba catalizador al inicio/i)).toBeInTheDocument();
  });

  it("allows drawing one card at the beginning of the round", async () => {
    const user = userEvent.setup();
    const onDraw = vi.fn();

    render(
      <WildcardDeckPanel
        state={createSampleState({ accumulatedWildcards: [], hasDrawnWildcardThisRound: false })}
        wildcards={[]}
        effects={[]}
        onUse={vi.fn()}
        onDraw={onDraw}
      />
    );

    await user.click(screen.getByRole("button", { name: /robar/i }));

    expect(onDraw).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/sin catalizadores acumulados/i)).toBeInTheDocument();
  });

  it("blocks drawing another card after the round draw has been used", () => {
    render(
      <WildcardDeckPanel
        state={createSampleState({ hasDrawnWildcardThisRound: true })}
        wildcards={[sampleWildcard]}
        effects={[]}
        onUse={vi.fn()}
        onDraw={vi.fn()}
      />
    );

    expect(screen.getByRole("button", { name: /robar/i })).toBeDisabled();
    expect(screen.getByText(/catalizador robado/i)).toBeInTheDocument();
  });

  it("shows a mobile-friendly hint from the wildcard help button", async () => {
    const user = userEvent.setup();

    render(
      <WildcardDeckPanel
        state={createSampleState()}
        wildcards={[sampleWildcard]}
        effects={[]}
        onUse={vi.fn()}
        onDraw={vi.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: /ver ayuda de stop loss/i }));

    expect(screen.getByText("Limita la pérdida de esta ronda.")).toBeInTheDocument();
  });

  it("renders accumulated effects inside the catalysts card", () => {
    render(
      <WildcardDeckPanel
        state={createSampleState()}
        wildcards={[sampleWildcard]}
        effects={[{ id: "effect-test", type: "BULL_MARKET", label: "Mercado alcista", level: 2, remainingRounds: 1 }]}
        onUse={vi.fn()}
        onDraw={vi.fn()}
      />
    );

    expect(screen.getByText("Efectos acumulados")).toBeInTheDocument();
    expect(screen.getByText(/Mercado alcista/)).toBeInTheDocument();
  });
});
