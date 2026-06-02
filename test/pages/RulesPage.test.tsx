import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { GameProvider } from "../../src/app/GameContext";
import { RulesPage } from "../../src/pages/RulesPage";

describe("RulesPage", () => {
  it("reuses the initial onboarding rules flow", () => {
    render(
      <MemoryRouter>
        <GameProvider>
          <RulesPage />
        </GameProvider>
      </MemoryRouter>
    );

    expect(screen.getByText("Una sesión bursátil para Iñigo")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /siguiente/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /omitir explicación/i })).toBeInTheDocument();
    expect(screen.queryByText("Reglas del mercado")).not.toBeInTheDocument();
  });
});
