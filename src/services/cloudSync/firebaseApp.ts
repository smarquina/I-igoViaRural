import type { FirebaseApp } from "firebase/app";
import type { Firestore } from "firebase/firestore";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
  databaseId?: string;
}

interface OptionalFirebaseConfig {
  apiKey: string | undefined;
  authDomain: string | undefined;
  projectId: string | undefined;
  storageBucket: string | undefined;
  messagingSenderId: string | undefined;
  appId: string | undefined;
  measurementId?: string | undefined;
  databaseId?: string | undefined;
}

let firebaseApp: Promise<FirebaseApp | null> | null = null;
let firestore: Promise<Firestore | null> | null = null;

function normalizeOptionalEnvValue(value: string | undefined): string | undefined {
  const normalizedValue = value?.trim();
  return normalizedValue ? normalizedValue : undefined;
}

function hasRequiredFirebaseConfig(config: OptionalFirebaseConfig): config is FirebaseConfig {
  return Boolean(
    config.apiKey &&
      config.authDomain &&
      config.projectId &&
      config.storageBucket &&
      config.messagingSenderId &&
      config.appId
  );
}

function readFirebaseConfig(): FirebaseConfig | null {
  const config: OptionalFirebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    databaseId: normalizeOptionalEnvValue(import.meta.env.VITE_FIRESTORE_DATABASE_ID)
  };

  return hasRequiredFirebaseConfig(config) ? config : null;
}

export function isFirebaseConfigured(): boolean {
  return import.meta.env.MODE !== "test" && readFirebaseConfig() !== null;
}

export function getFirebaseApp(): Promise<FirebaseApp | null> {
  if (firebaseApp) {
    return firebaseApp;
  }

  const config = isFirebaseConfigured() ? readFirebaseConfig() : null;
  if (!config) {
    return Promise.resolve(null);
  }

  firebaseApp = import("firebase/app").then(({ initializeApp }) => initializeApp(config));
  return firebaseApp;
}

export function getDb(): Promise<Firestore | null> {
  if (firestore) {
    return firestore;
  }

  firestore = Promise.all([getFirebaseApp(), import("firebase/firestore")]).then(
    ([app, { initializeFirestore, persistentLocalCache, persistentSingleTabManager }]) => {
      const config = readFirebaseConfig();

      if (!app) {
        return null;
      }

      return initializeFirestore(
        app,
        {
          ignoreUndefinedProperties: true,
          localCache: persistentLocalCache({
            tabManager: persistentSingleTabManager(undefined)
          })
        },
        config?.databaseId
      );
    }
  );

  return firestore;
}
