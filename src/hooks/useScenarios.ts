import { useEffect, useState } from 'react';
import type { ScenarioMeta, TabId } from '../types';

const FILE_KEY: Record<TabId, keyof ScenarioMeta['files']> = {
  overview: 'overview',
  payload: 'payload',
  detection: 'detection',
  mitigation: 'mitigation',
  indicators: 'indicators',
};

export function useScenarioFile(
  scenario: ScenarioMeta | undefined,
  tab: TabId,
) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!scenario) return;
    let active = true;
    setLoading(true);
    const file = scenario.files[FILE_KEY[tab]];
    fetch(`./scenarios/${scenario.id}/${file}`)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.text();
      })
      .then((t) => active && setContent(t))
      .catch(
        () =>
          active &&
          setContent('// File scenario non trovato o non accessibile.'),
      )
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [scenario?.id, tab]);

  return { content, loading };
}
