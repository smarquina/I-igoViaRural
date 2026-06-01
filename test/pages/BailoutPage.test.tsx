import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { GameProvider } from "../../src/app/GameContext";
import { BailoutPage } from "../../src/pages/BailoutPage";

function renderBailout() {
  render(
    <MemoryRouter initialEntries={["/bailout"]}>
      <GameProvider>
        <Routes>
          <Route path="/bailout" element={<BailoutPage />} />
          <Route path="/game" element={<div>Partida reanudada</div>} />
        </Routes>
      </GameProvider>
    </MemoryRouter>
  );
}

describe("BailoutPage", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.spyOn(Math, "random").mockReturnValue(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders bailout options as executable cards with the random street challenge", () => {
    renderBailout();

    const bailout = screen.getByRole("region", { name: /rescate bancario/i });

    expect(within(bailout).getByText("Rescate con liquidez")).toBeInTheDocument();
    expect(within(bailout).getByText("Venta de activos")).toBeInTheDocument();
    expect(within(bailout).getByText("Reto de recapitalización")).toBeInTheDocument();
    expect(within(bailout).getByText("Vender un objeto absurdo")).toBeInTheDocument();
    expect(within(bailout).queryByText("Rescate colectivo de emergencia")).not.toBeInTheDocument();
    expect(within(bailout).getByRole("button", { name: /ejecutar rescate: rescate con liquidez/i })).toBeInTheDocument();
    expect(within(bailout).getByRole("button", { name: /ejecutar rescate: venta de activos/i })).toBeInTheDocument();
    expect(within(bailout).getByRole("button", { name: /ejecutar rescate: reto de recapitalización: reto superado/i })).toBeInTheDocument();
    expect(within(bailout).getByRole("button", { name: /ejecutar rescate: reto de recapitalización: reto fallido/i })).toBeInTheDocument();
    expect(within(bailout).queryByRole("button", { name: /ejecutar rescate: rescate colectivo de emergencia/i })).not.toBeInTheDocument();
  });

  it("allows executing only the selected bailout option", async () => {
    const user = userEvent.setup();

    renderBailout();

    await user.click(screen.getByRole("button", { name: /ejecutar rescate: rescate con liquidez/i }));

    expect(screen.getByText("Partida reanudada")).toBeInTheDocument();
  });

  it("offers explicit success and failure actions for the street challenge bailout", async () => {
    const user = userEvent.setup();

    renderBailout();

    await user.click(screen.getByRole("button", { name: /ejecutar rescate: reto de recapitalización: reto fallido/i }));

    expect(screen.getByText("Partida reanudada")).toBeInTheDocument();
  });
});
