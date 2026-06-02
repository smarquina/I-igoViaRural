import { routeModuleLoaders } from "./lazyRoutes";
import { loadMiniMarketChart } from "../components/market/chartLoader";

const appCacheName = "bachelor-market-v2";
const OFFLINE_PREFETCH_DELAY_MS = 15000;

const sameOrigin = (url: string) => new URL(url, window.location.href).origin === window.location.origin;

const cacheUrls = async (urls: string[]) => {
  if (!("caches" in window)) {
    return;
  }

  const cache = await caches.open(appCacheName);
  const uniqueUrls = [...new Set(urls)].filter(sameOrigin);

  await Promise.allSettled(uniqueUrls.map((url) => cache.add(url)));
};

const getEntryAssetUrls = () => {
  const urls = [
    window.location.href,
    ...Array.from(document.querySelectorAll<HTMLScriptElement>("script[src]")).map((script) => script.src),
    ...Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"][href]')).map((link) => link.href)
  ];

  return urls;
};

const getLoadedBuildAssetUrls = () =>
  performance
    .getEntriesByType("resource")
    .map((entry) => entry.name)
    .filter((url) => sameOrigin(url) && new URL(url).pathname.startsWith("/assets/"));

const preloadOfflineModules = async () => {
  const moduleLoaders = [...routeModuleLoaders, loadMiniMarketChart];

  await cacheUrls(getEntryAssetUrls());
  await Promise.allSettled(moduleLoaders.map((loadModule) => loadModule()));
  await cacheUrls(getLoadedBuildAssetUrls());
};

const waitForServiceWorker = () =>
  Promise.race([
    navigator.serviceWorker.ready,
    new Promise<void>((resolve) => {
      globalThis.setTimeout(resolve, 5000);
    })
  ]);

export function scheduleOfflineFirstPrefetch(): void {
  if (import.meta.env.DEV) {
    return;
  }

  const runPrefetch = () => {
    if ("serviceWorker" in navigator) {
      void waitForServiceWorker().finally(() => {
        void preloadOfflineModules();
      });
      return;
    }

    void preloadOfflineModules();
  };

  window.addEventListener(
    "load",
    () => {
      globalThis.setTimeout(() => {
        if ("requestIdleCallback" in window) {
          window.requestIdleCallback(runPrefetch, { timeout: 10000 });
          return;
        }

        globalThis.setTimeout(runPrefetch, 5000);
      }, OFFLINE_PREFETCH_DELAY_MS);
    },
    { once: true }
  );
}
