import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { GameProvider } from "../../src/app/GameContext";
import { STORAGE_KEYS } from "../../src/domain/constants";
import { HangoverPage } from "../../src/pages/HangoverPage";
import { createSampleState } from "../fixtures";

function renderHangover() {
  window.localStorage.setItem(STORAGE_KEYS.HAS_STARTED_GAME, "true");
  window.localStorage.setItem(
    STORAGE_KEYS.GAME_STATE,
    JSON.stringify(createSampleState({
      score: 95,
      totalFailures: 2,
      totalDrinks: 4,
      resolvedRoundIds: ["round-1", "round-2"],
      isGameFinished: true,
      gameResult: "NEGOTIATIONS_BROKEN"
    }))
  );

  render(
    <MemoryRouter>
      <GameProvider>
        <HangoverPage />
      </GameProvider>
    </MemoryRouter>
  );
}

describe("HangoverPage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows a broken-negotiations modal over the Toledo hangover background before stats", async () => {
    const user = userEvent.setup();

    renderHangover();

    expect(screen.getByRole("main")).toHaveAttribute("style", expect.stringContaining("resacon_toledo.avif"));
    expect(screen.getByRole("heading", { name: /resacón en toledo/i })).toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: /se han roto las negociaciones/i })).toBeInTheDocument();
    expect(screen.queryByText("Rondas")).not.toBeInTheDocument();

    const dialog = screen.getByRole("dialog", { name: /se han roto las negociaciones/i });
    await user.click(screen.getByRole("button", { name: /ver estadísticas/i }));

    await waitForElementToBeRemoved(dialog);
    expect(screen.getByText("Rondas")).toBeInTheDocument();
    expect(screen.getAllByText("2").length).toBeGreaterThan(0);
    expect(screen.getByText("95 pts")).toBeInTheDocument();
  });
});
