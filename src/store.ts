// Central Zustand store: scenarios, selection, and Threat Workspace.

import { create } from 'zustand';
import type {
  ScenarioMeta,
  IndicatorsDoc,
  WorkspaceNote,
  Bookmark,
} from './types';
import {
  listNotes,
  saveNote as idbSaveNote,
  deleteNote as idbDeleteNote,
  listBookmarks,
  toggleBookmark as idbToggleBookmark,
} from './lib/idb';

interface MythosState {
  scenarios: ScenarioMeta[];
  scenariosError: string | null;
  indicatorsCache: Record<string, IndicatorsDoc | null>;
  notes: WorkspaceNote[];
  bookmarks: Bookmark[];
  loadScenarios: () => Promise<void>;
  getIndicators: (id: string) => Promise<IndicatorsDoc | null>;
  refreshWorkspace: () => Promise<void>;
  upsertNote: (note: WorkspaceNote) => Promise<void>;
  removeNote: (id: string) => Promise<void>;
  toggleBookmark: (scenarioId: string) => Promise<void>;
}

const base = (path: string) => `./scenarios/${path}`;

export const useStore = create<MythosState>((set, get) => ({
  scenarios: [],
  scenariosError: null,
  indicatorsCache: {},
  notes: [],
  bookmarks: [],

  async loadScenarios() {
    try {
      const res = await fetch(base('index.json'));
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as ScenarioMeta[];
      set({ scenarios: data, scenariosError: null });
    } catch {
      set({
        scenariosError:
          'Errore nel caricamento degli scenari. Verifica public/scenarios/index.json.',
      });
    }
  },

  async getIndicators(id) {
    const cached = get().indicatorsCache[id];
    if (cached !== undefined) return cached;
    const scenario = get().scenarios.find((s) => s.id === id);
    let doc: IndicatorsDoc | null = null;
    if (scenario) {
      try {
        const res = await fetch(base(`${id}/${scenario.files.indicators}`));
        doc = (await res.json()) as IndicatorsDoc;
      } catch {
        doc = null;
      }
    }
    set((st) => ({ indicatorsCache: { ...st.indicatorsCache, [id]: doc } }));
    return doc;
  },

  async refreshWorkspace() {
    const [notes, bookmarks] = await Promise.all([
      listNotes(),
      listBookmarks(),
    ]);
    set({ notes, bookmarks });
  },

  async upsertNote(note) {
    await idbSaveNote(note);
    await get().refreshWorkspace();
  },

  async removeNote(id) {
    await idbDeleteNote(id);
    await get().refreshWorkspace();
  },

  async toggleBookmark(scenarioId) {
    await idbToggleBookmark(scenarioId);
    await get().refreshWorkspace();
  },
}));
