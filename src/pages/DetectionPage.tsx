import React, { useEffect, useState } from 'react';
import {
  Target,
  GitBranch,
  Globe,
  MonitorCheck,
  Activity,
  Crosshair,
} from 'lucide-react';
import { useStore } from '../store';
import type { IndicatorsDoc } from '../types';

export function DetectionPage() {
  const scenarios = useStore((s) => s.scenarios);
  const getIndicators = useStore((s) => s.getIndicators);
  const [sel, setSel] = useState('');
  const [ind, setInd] = useState<IndicatorsDoc | null>(null);
  const scenario = scenarios.find((s) => s.id === (sel || scenarios[0]?.id));

  useEffect(() => {
    if (!scenario) return;
    let active = true;
    getIndicators(scenario.id).then((d) => active && setInd(d));
    return () => {
      active = false;
    };
  }, [scenario?.id, getIndicators]);

  return (
    <>
      <header className="page-head">
        <div>
          <p className="eyebrow">Detection Mapping</p>
          <h2>Da comportamento osservabile a regola di detection.</h2>
        </div>
      </header>

      <div className="selector-bar">
        <Target size={16} />
        <select value={sel} onChange={(e) => setSel(e.target.value)}>
          {scenarios.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
      </div>

      {!ind ? (
        <div className="panel full">
          <p>Seleziona uno scenario per visualizzare gli indicatori.</p>
        </div>
      ) : (
        <div className="detection-grid">
          <DetCard
            icon={<Crosshair size={16} />}
            title="Observable Artifacts"
            items={ind.observables}
          />
          <DetCard
            icon={<GitBranch size={16} />}
            title="Process Chain"
            items={ind.process_chain ?? ['n/d per questo scenario']}
            chain
          />
          <DetCard
            icon={<Globe size={16} />}
            title="Browser Indicators"
            items={ind.browser_indicators ?? ['n/d per questo scenario']}
          />
          <DetCard
            icon={<MonitorCheck size={16} />}
            title="Endpoint Indicators"
            items={ind.endpoint_indicators ?? ['n/d per questo scenario']}
          />
          <DetCard
            icon={<Activity size={16} />}
            title="Telemetry Concepts"
            items={ind.telemetry ?? ['browser console / network logs']}
          />
          <div className="panel det-card mitre">
            <h4>
              <Target size={16} /> MITRE-style Mapping
            </h4>
            {ind.mitre?.length ? (
              <table className="mitre-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tactic</th>
                    <th>Technique</th>
                  </tr>
                </thead>
                <tbody>
                  {ind.mitre.map((m) => (
                    <tr key={m.id}>
                      <td>
                        <code>{m.id}</code>
                      </td>
                      <td>{m.tactic}</td>
                      <td>{m.technique}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="muted">Mapping non definito per questo scenario.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function DetCard({
  icon,
  title,
  items,
  chain,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
  chain?: boolean;
}) {
  return (
    <div className="panel det-card">
      <h4>
        {icon} {title}
      </h4>
      {chain ? (
        <div className="chain">
          {items.map((it, i) => (
            <React.Fragment key={i}>
              <span className="chain-node">{it}</span>
              {i < items.length - 1 && (
                <span className="chain-arrow">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      ) : (
        <ul>
          {items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
