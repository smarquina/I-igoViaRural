import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { GameProvider } from "../app/GameContext";
import { STORAGE_KEYS } from "../domain/constants";
import { SettingsPage } from "./SettingsPage";

function renderSettings() {
  render(
    <MemoryRouter>
      <GameProvider>
        <SettingsPage />
      </GameProvider>
    </MemoryRouter>
  );
}

describe("SettingsPage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the menu focused on rules and removes home and resume actions", () => {
    window.localStorage.setItem(STORAGE_KEYS.HAS_STARTED_GAME, "true");

    renderSettings();

    expect(screen.getByRole("link", { name: /^reglas$/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /valor de fusión/i })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /^inicio$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /volver a la partida/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reiniciar partida/i })).toBeInTheDocument();
  });
});
