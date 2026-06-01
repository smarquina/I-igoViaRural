import { getFirebaseApp } from "./firebaseApp";

export async function ensureAnonymousSession(): Promise<string | null> {
  const app = await getFirebaseApp();
  if (!app) {
    return null;
  }

  try {
    const { getAuth, signInAnonymously } = await import("firebase/auth");
    const credential = await signInAnonymously(getAuth(app));
    return credential.user.uid;
  } catch {
    return null;
  }
}
