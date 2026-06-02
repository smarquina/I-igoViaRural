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

  it("renders manual sync as an icon-only navbar control", () => {
    render(
      <MemoryRouter>
        <GameProvider>
          <MarketHeader />
        </GameProvider>
      </MemoryRouter>
    );

    const syncButton = screen.getByRole("button", { name: /sincronizar partida con firestore/i });
    expect(syncButton).toHaveClass("h-11", "w-11");
    expect(syncButton).not.toHaveTextContent(/sincronizado|pendiente|sincronizando|error sync/i);
  });
});
