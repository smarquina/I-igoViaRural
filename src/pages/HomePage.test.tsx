import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { GameProvider } from "../app/GameContext";
import { STORAGE_KEYS } from "../domain/constants";
import { HomePage } from "./HomePage";

function renderHome() {
  render(
    <MemoryRouter>
      <GameProvider>
        <HomePage />
      </GameProvider>
    </MemoryRouter>
  );
}

describe("HomePage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("does not show continue or rules actions on the initial page", () => {
    renderHome();

    expect(screen.queryByRole("link", { name: /continuar partida/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /^reglas$/i })).not.toBeInTheDocument();
  });

  it("redirects to the game page when a game has already started", () => {
    window.localStorage.setItem(STORAGE_KEYS.HAS_STARTED_GAME, "true");

    render(
      <MemoryRouter initialEntries={["/"]}>
        <GameProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/game" element={<div>Partida en curso</div>} />
          </Routes>
        </GameProvider>
      </MemoryRouter>
    );

    expect(screen.getByText("Partida en curso")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /siguiente/i })).not.toBeInTheDocument();
  });
});
