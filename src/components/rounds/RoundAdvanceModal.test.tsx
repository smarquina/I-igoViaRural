import { render, screen } from "@testing-library/react";
import { RoundAdvanceModal } from "./RoundAdvanceModal";
import { sampleRound } from "../../test/fixtures";

describe("RoundAdvanceModal", () => {
  it("shows the next round number and question type", () => {
    render(<RoundAdvanceModal isOpen round={sampleRound} roundNumber={4} />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Ronda 4")).toBeInTheDocument();
    expect(screen.getByText("Auditoría interna")).toBeInTheDocument();
  });

  it("shows the market opening message for the first round", () => {
    render(<RoundAdvanceModal isOpen round={sampleRound} roundNumber={1} mode="opening" />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Ronda 1")).toBeInTheDocument();
    expect(screen.getByText("Se abren los mercados")).toBeInTheDocument();
    expect(screen.getByText("Empieza una nueva sesión bursátil.")).toBeInTheDocument();
  });
});
