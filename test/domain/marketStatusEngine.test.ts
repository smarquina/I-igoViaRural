import { calculateMarketStatus } from "../../src/domain/marketStatusEngine";
import { sampleConfig } from "../fixtures";

describe("calculateMarketStatus", () => {
  it("prioritizes bailout over critical zone", () => {
    expect(calculateMarketStatus(40)).toBe("BAILOUT_REQUIRED");
  });

  it("detects merger attempts and critical zone thresholds", () => {
    expect(calculateMarketStatus(190)).toBe("MERGER_ATTEMPT");
    expect(calculateMarketStatus(70)).toBe("CRITICAL_ZONE");
  });

  it("uses a configured merger target when provided", () => {
    expect(calculateMarketStatus(175, { ...sampleConfig, mergerTargetScore: 175 })).toBe("MERGER_ATTEMPT");
    expect(calculateMarketStatus(174, { ...sampleConfig, mergerTargetScore: 175 })).toBe("HOT_MARKET");
  });
});
