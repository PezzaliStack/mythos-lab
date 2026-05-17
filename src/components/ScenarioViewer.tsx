import React, { useEffect, useState } from 'react';
import { Bookmark, BookmarkCheck, GitBranch, Clock } from 'lucide-react';
import type { ScenarioMeta, TabId, IndicatorsDoc } from '../types';
import { useScenarioFile } from '../hooks/useScenarios';
import { useStore } from '../store';
import { CodeViewer } from './CodeViewer';

const TABS: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'payload', label: 'Payload Demo' },
  { id: 'detection', label: 'Detection' },
  { id: 'mitigation', label: 'Mitigation' },
  { id: 'indicators', label: 'Indicators' },
];

export const severityClass = (s: string) =>
  s === 'Critico'
    ? 'sev-critical'
    : s === 'Alto'
      ? 'sev-high'
      : s === 'Medio'
        ? 'sev-medium'
        : 'sev-low';

export function ScenarioViewer({ scenario }: { scenario: ScenarioMeta }) {
  const [tab, setTab] = useState<TabId>('overview');
  const { content, loading } = useScenarioFile(scenario, tab);
  const { content: overview } = useScenarioFile(scenario, 'overview');
  const getIndicators = useStore((s) => s.getIndicators);
  const bookmarks = useStore((s) => s.bookmarks);
  const toggleBookmark = useStore((s) => s.toggleBookmark);
  const [ind, setInd] = useState<IndicatorsDoc | null>(null);

  useEffect(() => {
    setTab('overview');
  }, [scenario.id]);

  useEffect(() => {
    let active = true;
    getIndicators(scenario.id).then((d) => active && setInd(d));
    return () => {
      active = false;
    };
  }, [scenario.id, getIndicators]);

  const filename =
    scenario.files[tab === 'payload' ? 'payload' : tab] ||
    scenario.files.overview;
  const bookmarked = bookmarks.some((b) => b.scenarioId === scenario.id);
  const summary =
    overview
      .split('\n')
      .map((l) => l.trim())
      .find((l) => l && !l.startsWith('#') && !l.startsWith('**')) ?? '';

  return (
    <section className="panel viewer">
      <div className="viewer-head">
        <div>
          <p className="eyebrow">{scenario.category}</p>
          <h2>{scenario.title}</h2>
          {summary && <p className="viewer-sub">{summary}</p>}
        </div>
        <div className="viewer-head-side">
          <span className={'badge ' + severityClass(scenario.severity)}>
            {scenario.severity}
          </span>
          <button
            className="btn-ghost"
            onClick={() => toggleBookmark(scenario.id)}
          >
            {bookmarked ? (
              <BookmarkCheck size={15} />
            ) : (
              <Bookmark size={15} />
            )}
            {bookmarked ? 'Salvato' : 'Bookmark'}
          </button>
        </div>
      </div>

      {(ind?.narrative || ind?.timeline?.length) && (
        <div className="narrative-grid">
          {ind?.narrative && (
            <div className="narrative-card">
              <h4>
                <GitBranch size={15} /> Attack Narrative
              </h4>
              <p>{ind.narrative}</p>
            </div>
          )}
          {ind?.timeline?.length ? (
            <div className="narrative-card">
              <h4>
                <Clock size={15} /> Timeline
              </h4>
              <ol className="timeline">
                {ind.timeline.map((t, i) => (
                  <li key={i}>
                    <b>{t.phase}</b>
                    <span>{t.description}</span>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </div>
      )}

      <div className="tabbar">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={tab === t.id ? 'on' : ''}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <CodeViewer content={content} filename={filename} loading={loading} />
    </section>
  );
}
