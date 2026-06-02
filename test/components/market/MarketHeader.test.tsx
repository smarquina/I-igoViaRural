import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { GameProvider } from "../../../src/app/GameContext";
import { MarketHeader } from "../../../src/components/market/MarketHeader";

describe("MarketHeader", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("uses the app image as navbar brand icon", () => {
    render(
      <MemoryRouter>
        <GameProvider>
          <MarketHeader />
        </GameProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole("img", { name: /icono de despedida viarural broker/i })).toHaveAttribute("src", "/icon.avif");
  });

  it("disables manual sync before a game has started", () => {
    render(
      <MemoryRouter>
        <GameProvider>
          <MarketHeader />
        </GameProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole("button", { name: /sincronizar partida con firestore/i })).toBeDisabled();
  });
});
