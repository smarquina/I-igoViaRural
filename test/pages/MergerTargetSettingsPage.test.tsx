import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { GameProvider } from "../../src/app/GameContext";
import { STORAGE_KEYS } from "../../src/domain/constants";
import { MergerTargetSettingsPage } from "../../src/pages/MergerTargetSettingsPage";

function renderMergerTargetSettings() {
  render(
    <MemoryRouter>
      <GameProvider>
        <MergerTargetSettingsPage />
      </GameProvider>
    </MemoryRouter>
  );
}

describe("MergerTargetSettingsPage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("stores a custom merger target in localStorage", async () => {
    const user = userEvent.setup();

    renderMergerTargetSettings();

    const input = screen.getByLabelText(/puntos necesarios/i);
    await user.clear(input);
    await user.type(input, "210");
    await user.click(screen.getByRole("button", { name: /guardar valor/i }));

    expect(screen.getByText("Valor de fusión guardado en 210 puntos.")).toBeInTheDocument();
    expect(window.localStorage.getItem(STORAGE_KEYS.SETTINGS)).toContain('"mergerTargetScore":210');
  });

  it("loads a stored merger target as the current value", () => {
    window.localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({ mergerTargetScore: 220 }));

    renderMergerTargetSettings();

    expect(screen.getByDisplayValue("220")).toBeInTheDocument();
    expect(screen.getByText("Objetivo actual: 220 puntos")).toBeInTheDocument();
  });
});
