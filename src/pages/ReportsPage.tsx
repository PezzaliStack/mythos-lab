import React, { useEffect, useState } from 'react';
import { FileText, Download, Eye } from 'lucide-react';
import { useStore } from '../store';
import type { IndicatorsDoc } from '../types';
import { buildTextReport, buildHtmlReport, downloadFile } from '../lib/report';

async function fetchText(id: string, file: string): Promise<string> {
  try {
    const r = await fetch(`./scenarios/${id}/${file}`);
    return r.ok ? await r.text() : '';
  } catch {
    return '';
  }
}

export function ReportsPage() {
  const scenarios = useStore((s) => s.scenarios);
  const notes = useStore((s) => s.notes);
  const getIndicators = useStore((s) => s.getIndicators);
  const [sel, setSel] = useState('');
  const [preview, setPreview] = useState('');
  const scenario = scenarios.find((s) => s.id === (sel || scenarios[0]?.id));

  const build = async (): Promise<{
    txt: string;
    html: string;
  } | null> => {
    if (!scenario) return null;
    const [overview, detection, mitigation, ind] = await Promise.all([
      fetchText(scenario.id, scenario.files.overview),
      fetchText(scenario.id, scenario.files.detection),
      fetchText(scenario.id, scenario.files.mitigation),
      getIndicators(scenario.id) as Promise<IndicatorsDoc | null>,
    ]);
    const input = {
      scenario,
      indicators: ind,
      overview,
      detection,
      mitigation,
      notes: notes.filter((n) => n.scenarioId === scenario.id),
    };
    return {
      txt: buildTextReport(input),
      html: buildHtmlReport(input),
    };
  };

  useEffect(() => {
    let active = true;
    build().then((r) => active && r && setPreview(r.txt));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario?.id, notes.length]);

  const exportAs = async (kind: 'txt' | 'html') => {
    const r = await build();
    if (!r || !scenario) return;
    if (kind === 'txt')
      downloadFile(`mythos-report-${scenario.id}.txt`, r.txt);
    else
      downloadFile(
        `mythos-report-${scenario.id}.html`,
        r.html,
        'text/html',
      );
  };

  return (
    <>
      <header className="page-head">
        <div>
          <p className="eyebrow">Report Builder</p>
          <h2>Executive summary, findings e raccomandazioni.</h2>
        </div>
      </header>

      <div className="selector-bar">
        <FileText size={16} />
        <select value={sel} onChange={(e) => setSel(e.target.value)}>
          {scenarios.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
        <div className="selector-actions">
          <button className="btn-ghost" onClick={() => exportAs('txt')}>
            <Download size={15} /> TXT
          </button>
          <button className="btn-primary" onClick={() => exportAs('html')}>
            <Download size={15} /> HTML
          </button>
        </div>
      </div>

      <section className="panel full">
        <h4>
          <Eye size={16} /> Anteprima report
        </h4>
        <pre className="report-preview">{preview}</pre>
      </section>
    </>
  );
}
