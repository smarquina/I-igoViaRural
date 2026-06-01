import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { initializeApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

let firebaseApp: FirebaseApp | null = null;
let analyticsInstance: Analytics | null = null;

function hasFirebaseConfig(config: FirebaseOptions): config is Required<FirebaseOptions> {
  return Boolean(
    config.apiKey &&
      config.authDomain &&
      config.projectId &&
      config.storageBucket &&
      config.messagingSenderId &&
      config.appId &&
      config.measurementId
  );
}

export function getFirebaseApp(): FirebaseApp | null {
  if (!hasFirebaseConfig(firebaseConfig)) {
    return null;
  }

  firebaseApp ??= initializeApp(firebaseConfig);
  return firebaseApp;
}

export async function initializeFirebaseAnalytics(): Promise<Analytics | null> {
  if (analyticsInstance) {
    return analyticsInstance;
  }

  try {
    const app = getFirebaseApp();

    if (!app || !(await isSupported())) {
      return null;
    }

    analyticsInstance = getAnalytics(app);
    return analyticsInstance;
  } catch {
    return null;
  }
}
