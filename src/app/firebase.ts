import type { Analytics } from "firebase/analytics";
import { getFirebaseApp } from "../services/cloudSync/firebaseApp";

let analyticsInstance: Analytics | null = null;

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
