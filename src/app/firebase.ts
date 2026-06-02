import type { Analytics } from "firebase/analytics";
import { getFirebaseApp } from "../services/cloudSync/firebaseApp";

let analyticsInstance: Analytics | null = null;
const ANALYTICS_START_DELAY_MS = 15000;

export async function initializeFirebaseAnalytics(): Promise<Analytics | null> {
  if (analyticsInstance) {
    return analyticsInstance;
  }

  try {
    const [app, { getAnalytics, isSupported }] = await Promise.all([
      getFirebaseApp(),
      import("firebase/analytics")
    ]);

    if (!app || !(await isSupported())) {
      return null;
    }

    analyticsInstance = getAnalytics(app);
    return analyticsInstance;
  } catch {
    return null;
  }
}

export function scheduleFirebaseAnalytics(): void {
  if (import.meta.env.DEV || typeof window === "undefined") {
    return;
  }

  window.addEventListener(
    "load",
    () => {
      globalThis.setTimeout(() => {
        if ("requestIdleCallback" in window) {
          window.requestIdleCallback(() => {
            void initializeFirebaseAnalytics();
          }, { timeout: 10000 });
          return;
        }

        void initializeFirebaseAnalytics();
      }, ANALYTICS_START_DELAY_MS);
    },
    { once: true }
  );
}
