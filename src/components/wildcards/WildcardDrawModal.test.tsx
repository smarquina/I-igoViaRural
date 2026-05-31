import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { WildcardDrawModal } from "./WildcardDrawModal";
import { sampleWildcard } from "../../test/fixtures";

describe("WildcardDrawModal", () => {
  it("lets the player keep or use a positive card after drawing it", async () => {
    const user = userEvent.setup();
    const onKeep = vi.fn();
    const onUseNow = vi.fn();

    render(<WildcardDrawModal wildcard={sampleWildcard} onKeep={onKeep} onUseNow={onUseNow} />);

    expect(screen.getByRole("dialog", { name: /stop loss/i })).toBeInTheDocument();
    expect(screen.getByText("Limita la pérdida de esta ronda.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /guardarla/i }));
    await user.click(screen.getByRole("button", { name: /activarlo ahora/i }));

    expect(onKeep).toHaveBeenCalledTimes(1);
    expect(onUseNow).toHaveBeenCalledTimes(1);
  });
});
