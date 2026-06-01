import type { GameState } from "../../domain/types";
import { getDb } from "./firebaseApp";

export interface CloudGameDocument {
  schemaVersion: 1;
  stateVersion: number;
  updatedAt: string;
  updatedBy: string;
  source: "localStorage-sync";
  state: GameState;
}

export async function loadCloudGameState(): Promise<CloudGameDocument | null> {
  const db = await getDb();
  if (!db) {
    return null;
  }

  const { doc, getDoc } = await import("firebase/firestore");
  const gameStateRef = doc(db, "gameState", "main");
  const snapshot = await getDoc(gameStateRef);
  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as CloudGameDocument;
}

export async function saveCloudGameState(document: CloudGameDocument): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Firebase is not configured");
  }

  const { doc, serverTimestamp, setDoc } = await import("firebase/firestore");
  const gameStateRef = doc(db, "gameState", "main");
  await setDoc(
    gameStateRef,
    {
      ...document,
      serverUpdatedAt: serverTimestamp()
    },
    { merge: false }
  );
}
