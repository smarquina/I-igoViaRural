import type { GameState } from "../../domain/types";
import { ensureAnonymousSession } from "./firebaseAuth";
import { getDb } from "./firebaseApp";

export interface CloudGameDocument {
  schemaVersion: 1;
  stateVersion: number;
  updatedAt: string;
  updatedBy: string;
  source: "localStorage-sync";
  state: GameState;
}

export type CloudGameDocumentDraft = Omit<CloudGameDocument, "updatedBy">;

export function getCloudGameDocumentPath(userId: string): ["gameState", string] {
  return ["gameState", userId];
}

async function getAuthorizedCloudDocumentContext(): Promise<{
  db: NonNullable<Awaited<ReturnType<typeof getDb>>>;
  userId: string;
} | null> {
  const db = await getDb();
  if (!db) {
    return null;
  }

  const userId = await ensureAnonymousSession();
  if (!userId) {
    return null;
  }

  return { db, userId };
}

export async function loadCloudGameState(): Promise<CloudGameDocument | null> {
  const context = await getAuthorizedCloudDocumentContext();
  if (!context) {
    return null;
  }

  const { doc, getDoc } = await import("firebase/firestore");
  const gameStateRef = doc(context.db, ...getCloudGameDocumentPath(context.userId));
  const snapshot = await getDoc(gameStateRef);
  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as CloudGameDocument;
}

export async function saveCloudGameState(document: CloudGameDocumentDraft): Promise<void> {
  const context = await getAuthorizedCloudDocumentContext();
  if (!context) {
    throw new Error("Firebase is not configured");
  }

  const { doc, serverTimestamp, setDoc } = await import("firebase/firestore");
  const gameStateRef = doc(context.db, ...getCloudGameDocumentPath(context.userId));
  await setDoc(
    gameStateRef,
    {
      ...document,
      updatedBy: context.userId,
      serverUpdatedAt: serverTimestamp()
    },
    { merge: false }
  );
}

export async function deleteCloudGameState(): Promise<void> {
  const context = await getAuthorizedCloudDocumentContext();
  if (!context) {
    return;
  }

  const { doc, deleteDoc } = await import("firebase/firestore");
  const gameStateRef = doc(context.db, ...getCloudGameDocumentPath(context.userId));
  await deleteDoc(gameStateRef);
}
