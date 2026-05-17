import React, { useEffect, useState } from 'react';
import {
  Database,
  Plus,
  Trash2,
  Download,
  BookmarkCheck,
} from 'lucide-react';
import { useStore } from '../store';
import type { WorkspaceNote } from '../types';
import { exportWorkspace } from '../lib/idb';
import { downloadFile } from '../lib/report';

const KINDS: WorkspaceNote['kind'][] = ['note', 'audit', 'observation'];

export function WorkspacePage() {
  const scenarios = useStore((s) => s.scenarios);
  const notes = useStore((s) => s.notes);
  const bookmarks = useStore((s) => s.bookmarks);
  const upsertNote = useStore((s) => s.upsertNote);
  const removeNote = useStore((s) => s.removeNote);
  const refresh = useStore((s) => s.refreshWorkspace);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [kind, setKind] = useState<WorkspaceNote['kind']>('note');
  const [scenarioId, setScenarioId] = useState('');

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = async () => {
    if (!title.trim() && !body.trim()) return;
    const now = Date.now();
    await upsertNote({
      id: 'n_' + now + '_' + Math.random().toString(36).slice(2, 7),
      scenarioId: scenarioId || scenarios[0]?.id || 'general',
      title: title.trim() || 'Senza titolo',
      body: body.trim(),
      kind,
      createdAt: now,
      updatedAt: now,
    });
    setTitle('');
    setBody('');
  };

  const doExport = async () => {
    const data = await exportWorkspace();
    downloadFile('mythos-workspace.json', data, 'application/json');
  };

  const scenarioTitle = (id: string) =>
    scenarios.find((s) => s.id === id)?.title ?? id;

  return (
    <>
      <header className="page-head">
        <div>
          <p className="eyebrow">Threat Workspace</p>
          <h2>Note di audit, osservazioni e bookmark. Storage locale.</h2>
        </div>
        <div className="stat-row">
          <div className="stat">
            <span>Note</span>
            <b>{notes.length}</b>
          </div>
          <div className="stat">
            <span>Bookmark</span>
            <b>{bookmarks.length}</b>
          </div>
        </div>
      </header>

      <div className="workspace-grid">
        <section className="panel">
          <h4>
            <Plus size={16} /> Nuova nota
          </h4>
          <input
            className="ws-input"
            placeholder="Titolo"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="ws-row">
            <select
              value={kind}
              onChange={(e) =>
                setKind(e.target.value as WorkspaceNote['kind'])
              }
            >
              {KINDS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
            <select
              value={scenarioId}
              onChange={(e) => setScenarioId(e.target.value)}
            >
              <option value="">Generale</option>
              {scenarios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>
          <textarea
            className="ws-area"
            placeholder="Osservazioni tecniche, evidenze, mitigazioni…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <div className="actions">
            <button className="btn-primary" onClick={add}>
              <Plus size={15} /> Aggiungi
            </button>
            <button className="btn-ghost" onClick={doExport}>
              <Download size={15} /> Esporta workspace
            </button>
          </div>
        </section>

        <section className="panel">
          <h4>
            <Database size={16} /> Note salvate
          </h4>
          {notes.length === 0 && (
            <p className="muted">Nessuna nota. Le note sono salvate in IndexedDB.</p>
          )}
          <ul className="note-list">
            {notes.map((n) => (
              <li key={n.id} className="note-item">
                <div>
                  <div className="note-top">
                    <span className={'note-kind k-' + n.kind}>{n.kind}</span>
                    <b>{n.title}</b>
                  </div>
                  <p>{n.body}</p>
                  <small>
                    {scenarioTitle(n.scenarioId)} ·{' '}
                    {new Date(n.updatedAt).toLocaleString('it-IT')}
                  </small>
                </div>
                <button
                  className="btn-icon"
                  onClick={() => removeNote(n.id)}
                  aria-label="Elimina nota"
                >
                  <Trash2 size={15} />
                </button>
              </li>
            ))}
          </ul>

          {bookmarks.length > 0 && (
            <>
              <h4 className="ws-sub">
                <BookmarkCheck size={16} /> Scenari salvati
              </h4>
              <ul className="bookmark-list">
                {bookmarks.map((b) => (
                  <li key={b.scenarioId}>
                    {scenarioTitle(b.scenarioId)}
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>
    </>
  );
}
