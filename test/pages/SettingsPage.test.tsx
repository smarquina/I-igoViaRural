import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { GameProvider } from "../../src/app/GameContext";
import { STORAGE_KEYS } from "../../src/domain/constants";
import { SettingsPage } from "../../src/pages/SettingsPage";
import { createSampleState } from "../fixtures";

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

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("keeps the menu focused on rules and removes home and resume actions", () => {
    window.localStorage.setItem(STORAGE_KEYS.HAS_STARTED_GAME, "true");

    renderSettings();

    expect(screen.getByRole("link", { name: /^reglas$/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /valor de fusión/i })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /^inicio$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /volver a la partida/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /restablecer partida/i })).toBeInTheDocument();
  });

  it("shows the reset action even without an active game", () => {
    renderSettings();

    expect(screen.getByRole("button", { name: /restablecer partida/i })).toBeInTheDocument();
  });

  it("clears all app storage data after confirmation", async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);

    window.localStorage.setItem(STORAGE_KEYS.HAS_STARTED_GAME, "true");
    window.localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(createSampleState({ score: 150 })));
    window.localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({ mergerTargetScore: 220 }));
    window.localStorage.setItem(STORAGE_KEYS.DATA_VERSION, "test-version");

    renderSettings();

    await user.click(screen.getByRole("button", { name: /restablecer partida/i }));

    expect(confirmSpy).toHaveBeenCalledWith("¿Restablecer la partida y borrar todos los datos guardados en este navegador?");
    Object.values(STORAGE_KEYS).forEach((key) => {
      expect(window.localStorage.getItem(key)).toBeNull();
    });
  });

  it("keeps saved data when reset is cancelled", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "confirm").mockReturnValue(false);

    window.localStorage.setItem(STORAGE_KEYS.HAS_STARTED_GAME, "true");
    window.localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({ mergerTargetScore: 220 }));

    renderSettings();

    await user.click(screen.getByRole("button", { name: /restablecer partida/i }));

    expect(window.localStorage.getItem(STORAGE_KEYS.HAS_STARTED_GAME)).toBe("true");
    expect(window.localStorage.getItem(STORAGE_KEYS.SETTINGS)).toContain('"mergerTargetScore":220');
  });
});
