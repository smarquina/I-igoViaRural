import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { GameProvider } from "../../src/app/GameContext";
import { STORAGE_KEYS } from "../../src/domain/constants";
import { GamePage } from "../../src/pages/GamePage";
import { createSampleState } from "../fixtures";

function renderGameWithScore(score: number) {
  window.localStorage.setItem(STORAGE_KEYS.HAS_STARTED_GAME, "true");
  window.localStorage.setItem(
    STORAGE_KEYS.GAME_STATE,
    JSON.stringify(createSampleState({
      score,
      scoreHistory: [100, score],
      scoreTimeline: [
        { score: 100, timestamp: "2026-05-30T09:00:00.000Z", event: "Apertura de sesión" },
        { score, timestamp: "2026-05-30T09:05:00.000Z", event: "Ronda de prueba" }
      ]
    }))
  );

  render(
    <MemoryRouter>
      <GameProvider>
        <GamePage />
      </GameProvider>
    </MemoryRouter>
  );
}

describe("GamePage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows the merger attempt alert when the quote reaches the configured target", () => {
    renderGameWithScore(195);

    expect(screen.getAllByText("Cierre de Fusión disponible").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /intentar cerrar fusión/i })).toHaveAttribute("href", "/merger");
  });
});
