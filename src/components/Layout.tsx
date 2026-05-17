import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  Shield,
  BookOpen,
  Target,
  Wrench,
  FileText,
  Database,
} from 'lucide-react';

const NAV = [
  { to: '/scenarios', label: 'Scenario Engine', icon: BookOpen },
  { to: '/detection', label: 'Detection Mapping', icon: Target },
  { to: '/hardening', label: 'Hardening Center', icon: Wrench },
  { to: '/reports', label: 'Report Builder', icon: FileText },
  { to: '/workspace', label: 'Threat Workspace', icon: Database },
];

export function Layout({ onLegal }: { onLegal: () => void }) {
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="logo">
            <Shield size={24} />
          </div>
          <div>
            <h1>Mythos Lab</h1>
            <p>Red → Blue Security Platform</p>
          </div>
        </div>
        <nav className="nav-list">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                'nav-item' + (isActive ? ' active' : '')
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-foot">
          <div className="notice">
            <b>Defensive only</b>
            <span>
              Knowledge base per ambienti autorizzati. I file sono case study
              sanitizzati, non payload operativi.
            </span>
          </div>
          <button className="legal-link" onClick={onLegal}>
            Informazioni legali
          </button>
        </div>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
