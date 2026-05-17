// Report Builder: produces executive TXT and standalone HTML reports.

import type { ReportInput } from '../types';

export function buildTextReport(input: ReportInput): string {
  const { scenario, indicators, overview, detection, mitigation, notes } =
    input;
  const L: string[] = [];
  const rule = '='.repeat(64);
  L.push(rule);
  L.push('MYTHOS LAB — SECURITY ASSESSMENT REPORT');
  L.push(rule);
  L.push(`Generato: ${new Date().toLocaleString('it-IT')}`);
  L.push('');
  L.push('EXECUTIVE SUMMARY');
  L.push('-'.repeat(64));
  L.push(`Scenario:  ${scenario.title}`);
  L.push(`Categoria: ${scenario.category}`);
  L.push(`Severità:  ${scenario.severity}`);
  L.push(`Tag:       ${scenario.tags.join(', ')}`);
  L.push('');
  L.push(
    firstParagraph(overview) ||
      'Scenario educativo Red→Blue per analisi difensiva.',
  );
  L.push('');
  L.push('FINDINGS & OSSERVABILI');
  L.push('-'.repeat(64));
  (indicators?.observables ?? []).forEach((o) => L.push(`  • ${o}`));
  if (indicators?.process_chain?.length) {
    L.push('');
    L.push('  Process chain:');
    L.push(`    ${indicators.process_chain.join(' -> ')}`);
  }
  if (indicators?.mitre?.length) {
    L.push('');
    L.push('  MITRE-style mapping:');
    indicators.mitre.forEach((m) =>
      L.push(`    [${m.id}] ${m.tactic} / ${m.technique}`),
    );
  }
  L.push('');
  L.push('DETECTION');
  L.push('-'.repeat(64));
  L.push(stripMd(detection));
  L.push('');
  L.push('RACCOMANDAZIONI & MITIGATION CHECKLIST');
  L.push('-'.repeat(64));
  const checklist =
    indicators?.mitigation_checklist ?? indicators?.mitigations ?? [];
  checklist.forEach((c) => L.push(`  [ ] ${c}`));
  L.push('');
  L.push(stripMd(mitigation));
  if (notes.length) {
    L.push('');
    L.push('NOTE DI WORKSPACE');
    L.push('-'.repeat(64));
    notes.forEach((n) =>
      L.push(`  • (${n.kind}) ${n.title}: ${n.body.replace(/\n/g, ' ')}`),
    );
  }
  L.push('');
  L.push(rule);
  L.push('Mythos Lab — uso educativo e difensivo. Nessun payload operativo.');
  L.push(rule);
  return L.join('\n');
}

export function buildHtmlReport(input: ReportInput): string {
  const { scenario, indicators, notes } = input;
  const sev = scenario.severity;
  const items = (arr: string[] | undefined) =>
    (arr ?? []).map((x) => `<li>${esc(x)}</li>`).join('');
  return `<!doctype html><html lang="it"><head><meta charset="utf-8"/>
<title>Mythos Lab Report — ${esc(scenario.title)}</title>
<style>
body{font:15px/1.6 -apple-system,Segoe UI,Inter,sans-serif;background:#0b1220;color:#e8eef8;margin:0;padding:48px}
.wrap{max-width:860px;margin:0 auto}
h1{font-size:26px;letter-spacing:-.02em;margin:0 0 4px}
h2{font-size:15px;text-transform:uppercase;letter-spacing:.12em;color:#7aa7e6;border-bottom:1px solid #24344f;padding-bottom:8px;margin:34px 0 14px}
.badge{display:inline-block;border-radius:999px;padding:5px 12px;font-size:12px;font-weight:800;margin-top:8px}
.s-Critico,.s-Alto{background:#3a1420;color:#ff9db0}
.s-Medio{background:#3a2f12;color:#fcd779}
.s-Basso{background:#13321f;color:#86efac}
.meta{color:#94a3b8;font-size:13px}
ul{margin:0;padding-left:20px}li{margin:4px 0}
code{background:#16213a;padding:2px 6px;border-radius:6px;font-size:13px}
footer{margin-top:48px;border-top:1px solid #24344f;padding-top:14px;color:#64748b;font-size:12px}
</style></head><body><div class="wrap">
<h1>${esc(scenario.title)}</h1>
<div class="meta">${esc(scenario.category)} · generato ${new Date().toLocaleString(
    'it-IT',
  )}</div>
<span class="badge s-${sev}">Severità: ${esc(sev)}</span>
<h2>Executive Summary</h2>
<p>${esc(
    input.overview.split('\n').find((l) => l.trim() && !l.startsWith('#')) ||
      'Scenario educativo Red→Blue.',
  )}</p>
<h2>Findings &amp; Osservabili</h2><ul>${items(indicators?.observables)}</ul>
${
  indicators?.process_chain?.length
    ? `<h2>Process Chain</h2><p><code>${esc(
        indicators.process_chain.join(' → '),
      )}</code></p>`
    : ''
}
${
  indicators?.mitre?.length
    ? `<h2>MITRE-style Mapping</h2><ul>${indicators.mitre
        .map(
          (m) =>
            `<li><code>${esc(m.id)}</code> — ${esc(m.tactic)} / ${esc(
              m.technique,
            )}</li>`,
        )
        .join('')}</ul>`
    : ''
}
<h2>Mitigation Checklist</h2><ul>${items(
    indicators?.mitigation_checklist ?? indicators?.mitigations,
  )}</ul>
${
  notes.length
    ? `<h2>Note di Workspace</h2><ul>${notes
        .map(
          (n) =>
            `<li><b>${esc(n.title)}</b> <span class="meta">(${esc(
              n.kind,
            )})</span><br/>${esc(n.body)}</li>`,
        )
        .join('')}</ul>`
    : ''
}
<footer>Mythos Lab — report a uso educativo e difensivo. Nessun payload operativo incluso.</footer>
</div></body></html>`;
}

function firstParagraph(md: string): string {
  return (
    md
      .split('\n')
      .map((l) => l.trim())
      .find((l) => l && !l.startsWith('#') && !l.startsWith('**')) || ''
  );
}
function stripMd(md: string): string {
  return md
    .replace(/^#{1,6}\s/gm, '')
    .replace(/\*\*/g, '')
    .trim();
}
function esc(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      (({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      }) as Record<string, string>)[c],
  );
}

export function downloadFile(
  name: string,
  text: string,
  type = 'text/plain',
): void {
  const blob = new Blob([text], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}
