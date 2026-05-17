import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useStore } from '../store';
import { ScenarioViewer, severityClass } from '../components/ScenarioViewer';

export function ScenariosPage() {
  const scenarios = useStore((s) => s.scenarios);
  const error = useStore((s) => s.scenariosError);
  const [selected, setSelected] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Tutte');

  const categories = useMemo(
    () => ['Tutte', ...Array.from(new Set(scenarios.map((s) => s.category)))],
    [scenarios],
  );
  const filtered = scenarios.filter(
    (s) =>
      (category === 'Tutte' || s.category === category) &&
      [s.title, s.category, ...s.tags]
        .join(' ')
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const active =
    scenarios.find((s) => s.id === (selected || scenarios[0]?.id)) ||
    scenarios[0];

  return (
    <>
      <header className="page-head">
        <div>
          <p className="eyebrow">Scenario Engine</p>
          <h2>Scenari realistici. Detection concreta. Hardening operativo.</h2>
        </div>
        <div className="stat-row">
          <Stat label="Scenari" value={scenarios.length} />
          <Stat
            label="High / Critical"
            value={
              scenarios.filter((s) =>
                ['Alto', 'Critico'].includes(s.severity),
              ).length
            }
          />
          <Stat label="Payload operativi" value="0" />
        </div>
      </header>

      {error && <div className="alert">{error}</div>}

      <div className="scenario-grid">
        <section className="panel list-panel">
          <div className="search">
            <Search size={17} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cerca scenario, tag, categoria…"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <div className="cards">
            {filtered.map((s) => (
              <button
                key={s.id}
                className={
                  'scenario-card' +
                  (s.id === active?.id ? ' selected' : '')
                }
                onClick={() => setSelected(s.id)}
              >
                <small>{s.category}</small>
                <h3>{s.title}</h3>
                <p>{s.tags.join(' · ')}</p>
                <span className={'badge ' + severityClass(s.severity)}>
                  {s.severity}
                </span>
              </button>
            ))}
          </div>
        </section>
        {active && <ScenarioViewer scenario={active} />}
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="stat">
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}
