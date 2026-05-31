import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { RulesPage } from "./RulesPage";

describe("RulesPage", () => {
  it("reuses the initial onboarding rules flow", () => {
    render(
      <MemoryRouter>
        <RulesPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Una sesión bursátil para Iñigo")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /siguiente/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /omitir explicación/i })).toBeInTheDocument();
    expect(screen.queryByText("Reglas del mercado")).not.toBeInTheDocument();
  });
});
