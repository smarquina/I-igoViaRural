import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { GameProvider } from "../../src/app/GameContext";
import { STORAGE_KEYS } from "../../src/domain/constants";
import { GameOverPage } from "../../src/pages/GameOverPage";
import { createSampleState } from "../fixtures";

function renderApprovedGameOver() {
  window.localStorage.setItem(STORAGE_KEYS.HAS_STARTED_GAME, "true");
  window.localStorage.setItem(
    STORAGE_KEYS.GAME_STATE,
    JSON.stringify(createSampleState({
      score: 215,
      totalSuccesses: 8,
      totalFailures: 1,
      totalDrinks: 3,
      resolvedRoundIds: ["round-1", "round-2", "round-3"],
      isGameFinished: true,
      gameResult: "MERGER_APPROVED"
    }))
  );

  render(
    <MemoryRouter>
      <GameProvider>
        <GameOverPage />
      </GameProvider>
    </MemoryRouter>
  );
}

describe("GameOverPage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows an approved due diligence modal before game stats", async () => {
    const user = userEvent.setup();

    renderApprovedGameOver();

    expect(screen.getByRole("main")).toHaveAttribute(
      "style",
      expect.stringContaining("due_diligence_approved_simpsom.avif")
    );
    expect(screen.getByRole("heading", { name: /fusión aprobada/i })).toBeInTheDocument();
    const dialog = screen.getByRole("dialog", { name: /fusión superada/i });
    expect(dialog).toBeInTheDocument();
    expect(screen.queryByText("Rondas")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /ver estadísticas/i }));

    await waitForElementToBeRemoved(dialog);
    expect(screen.getByText("Rondas")).toBeInTheDocument();
    expect(screen.getAllByText("215 pts").length).toBeGreaterThan(0);
    expect(screen.getByText("Nueva sesión")).toBeInTheDocument();
  });
});
