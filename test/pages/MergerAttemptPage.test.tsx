import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { GameProvider } from "../../src/app/GameContext";
import { MergerAttemptPage } from "../../src/pages/MergerAttemptPage";

function renderMergerAttempt() {
  render(
    <MemoryRouter initialEntries={["/merger"]}>
      <GameProvider>
        <Routes>
          <Route path="/merger" element={<MergerAttemptPage />} />
          <Route path="/game-over" element={<div>Fusión cerrada</div>} />
          <Route path="/game" element={<div>Vuelve el mercado</div>} />
        </Routes>
      </GameProvider>
    </MemoryRouter>
  );
}

describe("MergerAttemptPage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the three due diligence phases and approves with two successful phases", async () => {
    const user = userEvent.setup();

    renderMergerAttempt();

    const dueDiligence = screen.getByRole("region", { name: /cierre de fusión/i });

    expect(within(dueDiligence).getByText("Pregunta de Rocío")).toBeInTheDocument();
    expect(within(dueDiligence).getByText("Reto")).toBeInTheDocument();
    expect(within(dueDiligence).getByText("Cultura general")).toBeInTheDocument();

    const successButtons = within(dueDiligence).getAllByRole("button", { name: /marcar acierto/i });
    await user.click(successButtons[0]);
    await user.click(successButtons[1]);
    await user.click(screen.getByRole("button", { name: /registrar resultado \(2\/3\)/i }));

    expect(screen.getByText("Fusión cerrada")).toBeInTheDocument();
  });

  it("loads a configured culture question and hides its answer until reveal", async () => {
    const user = userEvent.setup();
    vi.spyOn(Math, "random").mockReturnValue(0);

    renderMergerAttempt();

    expect(screen.queryByText(/pregunta pendiente de configurar/i)).not.toBeInTheDocument();

    const cultureQuestion = screen.getByText("¿Cuál es la capital de Nueva Zelanda?");
    const cultureCard = cultureQuestion.closest("article");

    expect(cultureCard).not.toBeNull();
    expect(within(cultureCard as HTMLElement).queryByText(/Wellington/i)).not.toBeInTheDocument();

    await user.click(within(cultureCard as HTMLElement).getByRole("button", { name: /revelar respuesta/i }));

    expect(within(cultureCard as HTMLElement).getByText(/Wellington/i)).toBeInTheDocument();
  });
});
