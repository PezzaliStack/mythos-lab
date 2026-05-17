// IndexedDB-backed Threat Workspace storage (notes, bookmarks).
// Uses idb for a small typed wrapper. All data stays local to the browser.

import { openDB, type IDBPDatabase } from 'idb';
import type { WorkspaceNote, Bookmark } from '../types';

const DB_NAME = 'mythos-lab';
const DB_VERSION = 1;
const NOTES = 'notes';
const BOOKMARKS = 'bookmarks';

let dbPromise: Promise<IDBPDatabase> | null = null;

function db(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(database) {
        if (!database.objectStoreNames.contains(NOTES)) {
          database.createObjectStore(NOTES, { keyPath: 'id' });
        }
        if (!database.objectStoreNames.contains(BOOKMARKS)) {
          database.createObjectStore(BOOKMARKS, { keyPath: 'scenarioId' });
        }
      },
    });
  }
  return dbPromise;
}

export async function listNotes(): Promise<WorkspaceNote[]> {
  const all = (await (await db()).getAll(NOTES)) as WorkspaceNote[];
  return all.sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function saveNote(note: WorkspaceNote): Promise<void> {
  await (await db()).put(NOTES, note);
}

export async function deleteNote(id: string): Promise<void> {
  await (await db()).delete(NOTES, id);
}

export async function listBookmarks(): Promise<Bookmark[]> {
  return (await (await db()).getAll(BOOKMARKS)) as Bookmark[];
}

export async function toggleBookmark(scenarioId: string): Promise<boolean> {
  const conn = await db();
  const existing = await conn.get(BOOKMARKS, scenarioId);
  if (existing) {
    await conn.delete(BOOKMARKS, scenarioId);
    return false;
  }
  await conn.put(BOOKMARKS, { scenarioId, createdAt: Date.now() });
  return true;
}

export async function exportWorkspace(): Promise<string> {
  const [notes, bookmarks] = await Promise.all([listNotes(), listBookmarks()]);
  return JSON.stringify(
    {
      app: 'mythos-lab',
      version: 1,
      exportedAt: new Date().toISOString(),
      notes,
      bookmarks,
    },
    null,
    2,
  );
}
