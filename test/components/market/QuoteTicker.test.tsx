import { render, screen } from "@testing-library/react";
import { QuoteTicker } from "../../../src/components/market/QuoteTicker";
import { createSampleState, sampleConfig } from "../../fixtures";

describe("QuoteTicker", () => {
  it("renders the current score, session extremes, market status and configured thresholds", () => {
    render(<QuoteTicker config={sampleConfig} state={createSampleState({ score: 142, lastScoreDelta: 10 })} />);

    expect(screen.getByText("Cotización")).toBeInTheDocument();
    expect(screen.getByText("142")).toBeInTheDocument();
    expect(screen.getByText("142 pts")).toBeInTheDocument();
    expect(screen.getByText("Máx 142 pts")).toBeInTheDocument();
    expect(screen.getByText("Mín 100 pts")).toBeInTheDocument();
    expect(screen.queryByText("+10")).not.toBeInTheDocument();
    expect(screen.getByText("Mercado caliente")).toBeInTheDocument();
    expect(screen.getByText("190 pts para cierre")).toBeInTheDocument();
    expect(screen.getByText("Fusión")).toBeInTheDocument();
  });
});
