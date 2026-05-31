import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MarketHeader } from "../../../src/components/market/MarketHeader";

describe("MarketHeader", () => {
  it("uses the app image as navbar brand icon", () => {
    render(
      <MemoryRouter>
        <MarketHeader />
      </MemoryRouter>
    );

    expect(screen.getByRole("img", { name: /icono de despedida viarural broker/i })).toHaveAttribute("src", "/icon.avif");
  });
});
