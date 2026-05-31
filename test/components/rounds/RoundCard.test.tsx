import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RoundCard } from "../../../src/components/rounds/RoundCard";
import { sampleRound } from "../../fixtures";

describe("RoundCard", () => {
  it("keeps Rocio audit answers hidden until the reveal action", async () => {
    const user = userEvent.setup();

    render(<RoundCard round={sampleRound} roundNumber={3} phase="ANSWERING" />);

    expect(screen.queryByText("La respuesta correcta.")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /revelar respuesta/i }));

    expect(screen.getByText("La respuesta correcta.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /respuesta ya revelada/i })).toBeDisabled();
  });

  it("hides the answer again and enables reveal when the next round is shown", async () => {
    const user = userEvent.setup();
    const nextRound = {
      ...sampleRound,
      id: "round-next",
      text: "¿Cuál es la siguiente pregunta auditada?",
      answer: "La siguiente respuesta."
    };

    const { rerender } = render(<RoundCard round={sampleRound} roundNumber={3} phase="ANSWERING" />);

    await user.click(screen.getByRole("button", { name: /revelar respuesta/i }));
    expect(screen.getByRole("button", { name: /respuesta ya revelada/i })).toBeDisabled();

    rerender(<RoundCard round={nextRound} roundNumber={4} phase="ANSWERING" />);

    expect(screen.getByText("¿Cuál es la siguiente pregunta auditada?")).toBeInTheDocument();
    expect(screen.queryByText("La siguiente respuesta.")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /revelar respuesta/i })).toBeEnabled();
  });
});
