import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const rules = readFileSync(resolve(process.cwd(), "firestore.rules"), "utf8");

describe("firestore security rules", () => {
  it("does not expose a public singleton game state document", () => {
    expect(rules).not.toContain("match /gameState/main");
    expect(rules).not.toContain("allow read: if true");
    expect(rules).toContain("match /gameState/{userId}");
  });

  it("binds game state access to the authenticated owner", () => {
    expect(rules).toContain("request.auth.uid == userId");
    expect(rules).toContain("data.updatedBy == userId");
    expect(rules).toContain("allow delete: if isSignedOwner(userId)");
  });

  it("validates the sync envelope and nested game state before writes", () => {
    expect(rules).toContain("isValidSyncDocument(request.resource.data, userId)");
    expect(rules).toContain("data.serverUpdatedAt == request.time");
    expect(rules).toContain("isValidGameState(data.state)");
    expect(rules).toContain("state.score >= -500");
    expect(rules).toContain("state.scoreTimeline.size() <= 500");
  });
});
