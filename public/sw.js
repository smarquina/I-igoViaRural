const CACHE_NAME = "bachelor-market-v2";
const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/icon.avif",
  "/crazy_guy.avif",
  "/resacon_toledo.avif",
  "/due_diligence_approved_simpsom.avif"
];

function isSameOriginRequest(request) {
  return new URL(request.url).origin === self.location.origin;
}

function isSuccessfulSameOriginResponse(request, response) {
  return isSameOriginRequest(request) && response.ok && response.type === "basic";
}

function isCacheableNavigationResponse(request, response) {
  const contentType = response.headers.get("Content-Type") || "";
  return isSuccessfulSameOriginResponse(request, response) && contentType.includes("text/html");
}

function isCacheableAssetResponse(request, response) {
  return isSuccessfulSameOriginResponse(request, response);
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (isCacheableNavigationResponse(event.request, response)) {
            const copy = response.clone();
            event.waitUntil(
              caches.open(CACHE_NAME).then((cache) => {
                cache.put("/index.html", copy);
              })
            );
          }
          return response;
        })
        .catch(() => caches.match("/index.html").then((fallback) => fallback || Response.error()))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request)
        .then((response) => {
          if (isCacheableAssetResponse(event.request, response)) {
            const copy = response.clone();
            event.waitUntil(
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy))
            );
          }
          return response;
        })
        .catch(() => Response.error());
    })
  );
});
