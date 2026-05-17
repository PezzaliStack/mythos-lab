import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LegalDisclaimerModal } from './components/LegalDisclaimerModal';
import { useDisclaimer } from './hooks/useDisclaimer';
import { useStore } from './store';
import { ScenariosPage } from './pages/ScenariosPage';
import { DetectionPage } from './pages/DetectionPage';
import { HardeningPage } from './pages/HardeningPage';
import { ReportsPage } from './pages/ReportsPage';
import { WorkspacePage } from './pages/WorkspacePage';
import './styles.css';

function App() {
  const { accepted, open, accept, reopen, close } = useDisclaimer();
  const loadScenarios = useStore((s) => s.loadScenarios);
  const refreshWorkspace = useStore((s) => s.refreshWorkspace);

  useEffect(() => {
    loadScenarios();
    refreshWorkspace();
  }, [loadScenarios, refreshWorkspace]);

  return (
    <>
      <LegalDisclaimerModal
        open={open}
        accepted={accepted}
        onAccept={accept}
        onClose={close}
      />
      <HashRouter>
        <Routes>
          <Route element={<Layout onLegal={reopen} />}>
            <Route index element={<Navigate to="/scenarios" replace />} />
            <Route path="/scenarios" element={<ScenariosPage />} />
            <Route path="/detection" element={<DetectionPage />} />
            <Route path="/hardening" element={<HardeningPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/workspace" element={<WorkspacePage />} />
            <Route path="*" element={<Navigate to="/scenarios" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
