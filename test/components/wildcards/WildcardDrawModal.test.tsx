import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { WildcardDrawModal } from "../../../src/components/wildcards/WildcardDrawModal";
import { sampleWildcard } from "../../fixtures";

describe("WildcardDrawModal", () => {
  it("lets the player keep or use a positive card after drawing it", async () => {
    const user = userEvent.setup();
    const onKeep = vi.fn();
    const onUseNow = vi.fn();
    const onDismiss = vi.fn();

    render(<WildcardDrawModal wildcard={sampleWildcard} onKeep={onKeep} onUseNow={onUseNow} onDismiss={onDismiss} />);

    expect(screen.getByRole("dialog", { name: /stop loss/i })).toBeInTheDocument();
    expect(screen.getByText("Limita la pérdida de esta ronda.")).toBeInTheDocument();
    expect(screen.getByText("Carta positiva")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /guardarla/i }));
    await user.click(screen.getByRole("button", { name: /activarlo ahora/i }));

    expect(onKeep).toHaveBeenCalledTimes(1);
    expect(onUseNow).toHaveBeenCalledTimes(1);
  });

  it("shows an applied negative card until the player dismisses it", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    const negativeWildcard = {
      ...sampleWildcard,
      id: "wildcard-liquidez-limitada",
      name: "Liquidez limitada",
      type: "BAD" as const,
      description: "Durante dos rondas, Iñigo no puede usar catalizadores defensivos."
    };

    render(
      <WildcardDrawModal
        wildcard={negativeWildcard}
        onKeep={vi.fn()}
        onUseNow={vi.fn()}
        onDismiss={onDismiss}
      />
    );

    expect(screen.getByRole("dialog", { name: /liquidez limitada/i })).toBeInTheDocument();
    expect(screen.getByText("Carta negativa")).toBeInTheDocument();
    expect(screen.getByText("Durante dos rondas, Iñigo no puede usar catalizadores defensivos.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /guardarla/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /activarlo ahora/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /entendido/i }));

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
