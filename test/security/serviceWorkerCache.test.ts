import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const serviceWorker = readFileSync(resolve(process.cwd(), "public/sw.js"), "utf8");

describe("service worker cache safety", () => {
  it("checks origin, status, and response type before caching fetched responses", () => {
    expect(serviceWorker).toContain("new URL(request.url).origin === self.location.origin");
    expect(serviceWorker).toContain("response.ok");
    expect(serviceWorker).toContain('response.type === "basic"');
  });

  it("requires HTML content before refreshing the navigation fallback", () => {
    expect(serviceWorker).toContain('response.headers.get("Content-Type")');
    expect(serviceWorker).toContain('contentType.includes("text/html")');
    expect(serviceWorker).toContain("isCacheableNavigationResponse(event.request, response)");
  });
});
