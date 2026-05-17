import React, { useState } from 'react';
import { Wrench, ShieldCheck } from 'lucide-react';

interface HardeningSection {
  title: string;
  items: string[];
}

const SECTIONS: HardeningSection[] = [
  {
    title: 'Remediation Checklist',
    items: [
      'Inventariare i dati sensibili gestiti dal frontend',
      'Rimuovere segreti e token dallo storage del browser',
      'Definire owner e SLA per ogni finding',
      'Verificare la mitigazione con un test di regressione',
    ],
  },
  {
    title: 'Content Security Policy',
    items: [
      'Definire una CSP restrittiva (default-src \'self\')',
      'Evitare unsafe-inline / unsafe-eval',
      'Allowlist esplicita per script e connect-src',
      'Attivare report-only prima dell’enforcement',
    ],
  },
  {
    title: 'Token Lifecycle',
    items: [
      'Token a vita breve e revocabili',
      'Scope minimi e separati per funzione',
      'Rotazione automatica e audit degli accessi',
      'Nessun token persistito lato client',
    ],
  },
  {
    title: 'Secure Storage',
    items: [
      'Preferire memoria volatile a localStorage per dati sensibili',
      'Segmentare i dati per origine e sensibilità',
      'Cifrare i dati at-rest dove necessario',
      'Minimizzare la superficie di dati persistenti',
    ],
  },
  {
    title: 'Service Worker Hardening',
    items: [
      'Strategia di cache conservativa e versionata',
      'Invalidazione e reset cache controllati',
      'Nessuna risposta sensibile in cache',
      'Scope del service worker ristretto',
    ],
  },
  {
    title: 'Webhook Hardening',
    items: [
      'Firmare e verificare ogni webhook',
      'Validare origine, timestamp e replay',
      'Rate limiting e gateway backend',
      'Segreti webhook fuori dal client',
    ],
  },
  {
    title: 'Browser Permission Minimization',
    items: [
      'Richiedere solo i permessi strettamente necessari',
      'Conferme esplicite per azioni sensibili',
      'Revoca dei permessi non più utilizzati',
      'Audit periodico delle API utilizzate',
    ],
  },
  {
    title: 'Frontend Secret Management',
    items: [
      'Nessun segreto nel bundle o nelle variabili build',
      'Gateway backend per chiamate autenticate',
      'Scansione del bundle per segreti esposti',
      'Separazione tra config pubblica e segreti',
    ],
  },
];

export function HardeningPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const total = SECTIONS.reduce((n, s) => n + s.items.length, 0);
  const completed = Object.values(done).filter(Boolean).length;

  return (
    <>
      <header className="page-head">
        <div>
          <p className="eyebrow">Hardening Center</p>
          <h2>Contromisure operative e checklist di remediation.</h2>
        </div>
        <div className="stat-row">
          <div className="stat">
            <span>Progress</span>
            <b>
              {completed}/{total}
            </b>
          </div>
        </div>
      </header>

      <div className="hardening-progress">
        <div
          className="hardening-bar"
          style={{ width: `${total ? (completed / total) * 100 : 0}%` }}
        />
      </div>

      <div className="hardening-grid">
        {SECTIONS.map((sec) => (
          <div className="panel hardening-card" key={sec.title}>
            <h4>
              <ShieldCheck size={16} /> {sec.title}
            </h4>
            <ul className="check-list">
              {sec.items.map((it) => {
                const key = sec.title + '::' + it;
                return (
                  <li key={key}>
                    <label>
                      <input
                        type="checkbox"
                        checked={!!done[key]}
                        onChange={(e) =>
                          setDone((d) => ({
                            ...d,
                            [key]: e.target.checked,
                          }))
                        }
                      />
                      <span>{it}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
