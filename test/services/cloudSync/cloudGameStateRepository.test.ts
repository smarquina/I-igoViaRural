import { describe, expect, it } from "vitest";

import { getCloudGameDocumentPath } from "../../../src/services/cloudSync/cloudGameStateRepository";

describe("cloud game state repository", () => {
  it("stores each synced game state under the authenticated user document", () => {
    expect(getCloudGameDocumentPath("anonymous-user-id")).toEqual(["gameState", "anonymous-user-id"]);
  });
});
