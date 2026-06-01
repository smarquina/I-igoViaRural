import type { FirebaseApp } from "firebase/app";
import type { Firestore } from "firebase/firestore";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

let firebaseApp: Promise<FirebaseApp | null> | null = null;
let firestore: Promise<Firestore | null> | null = null;

function readFirebaseConfig(): FirebaseConfig | null {
  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };

  return Object.values(config).every((value) => typeof value === "string" && value.length > 0)
    ? config
    : null;
}

export function isFirebaseConfigured(): boolean {
  return readFirebaseConfig() !== null;
}

export function getFirebaseApp(): Promise<FirebaseApp | null> {
  if (firebaseApp) {
    return firebaseApp;
  }

  const config = readFirebaseConfig();
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
      if (!app) {
        return null;
      }

      return initializeFirestore(app, {
        localCache: persistentLocalCache({
          tabManager: persistentSingleTabManager(undefined)
        })
      });
    }
  );

  return firestore;
}
