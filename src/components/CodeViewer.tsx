import React, { useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';
import { detectLang, highlightLine } from '../lib/highlight';
import { downloadFile } from '../lib/report';

interface Props {
  content: string;
  filename: string;
  loading?: boolean;
}

export function CodeViewer({ content, filename, loading }: Props) {
  const [copied, setCopied] = useState(false);
  const lang = detectLang(filename);
  const lines = content.split('\n');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="code-viewer">
      <div className="code-toolbar">
        <span className="code-file">{filename}</span>
        <div className="code-actions">
          <button
            className="btn-ghost"
            onClick={copy}
            aria-label="Copia contenuto"
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? 'Copiato' : 'Copia'}
          </button>
          <button
            className="btn-ghost"
            onClick={() => downloadFile(filename, content)}
            aria-label="Scarica file"
          >
            <Download size={15} />
            Scarica
          </button>
        </div>
      </div>
      <div className="code-surface" aria-readonly="true">
        {loading ? (
          <div className="code-loading">Caricamento…</div>
        ) : (
          <pre className="code-pre">
            <code>
              {lines.map((ln, i) => (
                <span className="code-row" key={i}>
                  <span className="code-gutter">{i + 1}</span>
                  <span className="code-line">
                    {highlightLine(ln, lang, i)}
                  </span>
                </span>
              ))}
            </code>
          </pre>
        )}
      </div>
    </div>
  );
}
