// Tiny dependency-free highlighter for the scenario viewer.
// Supports JSON and Markdown token coloring. Returns React nodes
// so we never use dangerouslySetInnerHTML on scenario content.

import React from 'react';

type Lang = 'json' | 'markdown' | 'text';

export function detectLang(filename: string): Lang {
  if (filename.endsWith('.json')) return 'json';
  if (filename.endsWith('.md')) return 'markdown';
  return 'text';
}

function jsonLine(line: string, key: number): React.ReactNode {
  // token regex: strings, numbers, booleans/null, punctuation
  const parts: React.ReactNode[] = [];
  const re =
    /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?)|([{}\[\],])/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(line))) {
    if (m.index > last) parts.push(line.slice(last, m.index));
    if (m[1]) {
      parts.push(
        <span key={i++} className={m[2] ? 'tk-key' : 'tk-str'}>
          {m[1]}
        </span>,
      );
      if (m[2]) parts.push(<span key={i++} className="tk-punct">{m[2]}</span>);
    } else if (m[3]) {
      parts.push(<span key={i++} className="tk-bool">{m[3]}</span>);
    } else if (m[4]) {
      parts.push(<span key={i++} className="tk-num">{m[4]}</span>);
    } else if (m[5]) {
      parts.push(<span key={i++} className="tk-punct">{m[5]}</span>);
    }
    last = re.lastIndex;
  }
  if (last < line.length) parts.push(line.slice(last));
  return <>{parts}</>;
}

function mdLine(line: string, key: number): React.ReactNode {
  if (/^#{1,6}\s/.test(line))
    return <span className="tk-head">{line}</span>;
  if (/^\s*[-*]\s/.test(line))
    return (
      <>
        <span className="tk-bullet">{line.match(/^\s*[-*]\s/)![0]}</span>
        {line.replace(/^\s*[-*]\s/, '')}
      </>
    );
  if (/^\s*\d+\.\s/.test(line))
    return (
      <>
        <span className="tk-bullet">{line.match(/^\s*\d+\.\s/)![0]}</span>
        {line.replace(/^\s*\d+\.\s/, '')}
      </>
    );
  // inline bold **x**
  const bold = line.split(/(\*\*[^*]+\*\*)/g).map((seg, idx) =>
    /^\*\*[^*]+\*\*$/.test(seg) ? (
      <span key={idx} className="tk-strong">
        {seg.replace(/\*\*/g, '')}
      </span>
    ) : (
      <React.Fragment key={idx}>{seg}</React.Fragment>
    ),
  );
  return <>{bold}</>;
}

export function highlightLine(
  line: string,
  lang: Lang,
  key: number,
): React.ReactNode {
  if (line.length === 0) return '\u00A0';
  if (lang === 'json') return jsonLine(line, key);
  if (lang === 'markdown') return mdLine(line, key);
  return line;
}
