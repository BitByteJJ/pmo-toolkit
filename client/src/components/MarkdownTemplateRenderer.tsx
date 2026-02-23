// MarkdownTemplateRenderer.tsx
// Renders template section content (Markdown pipe-tables, checklists, bold prose)
// as polished visual HTML — no raw monospace text.

import React from 'react';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Parse a single Markdown pipe-table string into headers + rows */
function parsePipeTable(text: string): { headers: string[]; rows: string[][] } | null {
  const lines = text.trim().split('\n').map(l => l.trim());
  // Need at least header + separator + one data row
  if (lines.length < 3) return null;
  // Check separator line (second line, all dashes/pipes/spaces)
  if (!/^[\|\-\s:]+$/.test(lines[1])) return null;

  const parseRow = (line: string): string[] =>
    line
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map(cell => cell.trim());

  const headers = parseRow(lines[0]);
  const rows = lines.slice(2).map(parseRow);
  return { headers, rows };
}

/** Detect if a block is a pipe table */
function isPipeTable(text: string): boolean {
  const lines = text.trim().split('\n');
  return lines.length >= 2 && lines[0].includes('|') && /^[\|\-\s:]+$/.test(lines[1].trim());
}

/** Detect if a block is a checklist (lines starting with - [ ] or - [x]) */
function isChecklist(text: string): boolean {
  return text.trim().split('\n').some(l => /^-\s*\[[ xX]\]/.test(l.trim()));
}

/** Detect if a block is a numbered list */
function isNumberedList(text: string): boolean {
  return text.trim().split('\n').some(l => /^\d+\.\s/.test(l.trim()));
}

/** Detect if a block is a bullet list */
function isBulletList(text: string): boolean {
  return text.trim().split('\n').some(l => /^[-*]\s(?!\[)/.test(l.trim()));
}

/** Render inline Markdown: **bold**, *italic*, `code` */
function renderInline(text: string): React.ReactNode {
  // Split on **bold**, *italic*, `code`
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Bold
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    // Italic
    const italicMatch = remaining.match(/\*(.+?)\*/);
    // Code
    const codeMatch = remaining.match(/`(.+?)`/);

    // Find earliest match
    const candidates = [
      boldMatch ? { match: boldMatch, type: 'bold' as const } : null,
      italicMatch ? { match: italicMatch, type: 'italic' as const } : null,
      codeMatch ? { match: codeMatch, type: 'code' as const } : null,
    ].filter(Boolean) as { match: RegExpMatchArray; type: 'bold' | 'italic' | 'code' }[];

    if (candidates.length === 0) {
      parts.push(<React.Fragment key={key++}>{remaining}</React.Fragment>);
      break;
    }

    candidates.sort((a, b) => (a.match.index ?? 0) - (b.match.index ?? 0));
    const { match, type } = candidates[0];
    const idx = match.index ?? 0;

    if (idx > 0) {
      parts.push(<React.Fragment key={key++}>{remaining.slice(0, idx)}</React.Fragment>);
    }

    if (type === 'bold') {
      parts.push(<strong key={key++} className="font-semibold text-slate-200">{match[1]}</strong>);
    } else if (type === 'italic') {
      parts.push(<em key={key++} className="italic text-slate-400">{match[1]}</em>);
    } else {
      parts.push(
        <code key={key++} className="bg-white/10 text-slate-300 px-1 py-0.5 rounded text-[10px] font-mono">
          {match[1]}
        </code>
      );
    }

    remaining = remaining.slice(idx + match[0].length);
  }

  return <>{parts}</>;
}

// ─── Sub-renderers ────────────────────────────────────────────────────────────

function TableRenderer({ text, accentColor }: { text: string; accentColor: string }) {
  const parsed = parsePipeTable(text);
  if (!parsed) return <pre className="text-[11px] text-slate-400 whitespace-pre-wrap">{text}</pre>;

  const { headers, rows } = parsed;

  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-[11px] border-collapse" style={{ minWidth: '100%' }}>
        <thead>
          <tr style={{ backgroundColor: accentColor + '15' }}>
            {headers.map((h, i) => (
              <th
                key={i}
                className="text-left px-3 py-2 font-bold text-slate-300 whitespace-nowrap border-b"
                style={{ borderColor: accentColor + '30', color: accentColor === '#6B7280' ? '#374151' : accentColor }}
              >
                {renderInline(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              className="border-b transition-colors hover:bg-white/5"
              style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: ri % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)' }}
            >
              {row.map((cell, ci) => (
                <td key={ci} className="px-3 py-2 text-slate-400 align-top leading-relaxed">
                  {/* First column often acts as a label — make it slightly bolder */}
                  {ci === 0 ? (
                    <span className="font-medium text-slate-300">{renderInline(cell)}</span>
                  ) : (
                    renderInline(cell)
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ChecklistRenderer({ text, accentColor }: { text: string; accentColor: string }) {
  const lines = text.trim().split('\n');
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        const checkedMatch = trimmed.match(/^-\s*\[([xX ])\]\s*(.*)/);
        if (checkedMatch) {
          const checked = checkedMatch[1].toLowerCase() === 'x';
          return (
            <div key={i} className="flex items-start gap-2.5">
              <div
                className="shrink-0 mt-0.5 w-4 h-4 rounded flex items-center justify-center border"
                style={{
                  backgroundColor: checked ? accentColor : 'transparent',
                  borderColor: checked ? accentColor : '#D1D5DB',
                }}
              >
                {checked && (
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className={`text-[12px] leading-relaxed ${checked ? 'line-through text-slate-400' : 'text-slate-400'}`}>
                {renderInline(checkedMatch[2])}
              </span>
            </div>
          );
        }
        // Regular list item
        if (/^[-*]\s/.test(trimmed)) {
          return (
            <div key={i} className="flex items-start gap-2.5">
              <div
                className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: accentColor }}
              />
              <span className="text-[12px] text-slate-400 leading-relaxed">
                {renderInline(trimmed.replace(/^[-*]\s/, ''))}
              </span>
            </div>
          );
        }
        return (
          <p key={i} className="text-[12px] text-slate-400 leading-relaxed">
            {renderInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

function NumberedListRenderer({ text, accentColor }: { text: string; accentColor: string }) {
  const lines = text.trim().split('\n').filter(l => l.trim());
  return (
    <ol className="space-y-2">
      {lines.map((line, i) => {
        const match = line.trim().match(/^\d+\.\s+(.*)/);
        const content = match ? match[1] : line.trim();
        return (
          <li key={i} className="flex items-start gap-2.5">
            <span
              className="shrink-0 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center mt-0.5 text-white"
              style={{ backgroundColor: accentColor }}
            >
              {i + 1}
            </span>
            <span className="text-[12px] text-slate-400 leading-relaxed">{renderInline(content)}</span>
          </li>
        );
      })}
    </ol>
  );
}

function BulletListRenderer({ text, accentColor }: { text: string; accentColor: string }) {
  const lines = text.trim().split('\n').filter(l => l.trim());
  return (
    <ul className="space-y-1.5">
      {lines.map((line, i) => {
        const content = line.trim().replace(/^[-*]\s/, '');
        return (
          <li key={i} className="flex items-start gap-2.5">
            <div
              className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
            <span className="text-[12px] text-slate-400 leading-relaxed">{renderInline(content)}</span>
          </li>
        );
      })}
    </ul>
  );
}

function ProseRenderer({ text }: { text: string }) {
  const lines = text.trim().split('\n').filter(l => l.trim());
  return (
    <div className="space-y-2">
      {lines.map((line, i) => (
        <p key={i} className="text-[12px] text-slate-400 leading-relaxed">
          {renderInline(line.trim())}
        </p>
      ))}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

interface MarkdownTemplateRendererProps {
  content: string;
  accentColor: string;
}

export function MarkdownTemplateRenderer({ content, accentColor }: MarkdownTemplateRendererProps) {
  // Split content into blocks separated by blank lines
  const blocks = content.split(/\n{2,}/).map(b => b.trim()).filter(Boolean);

  return (
    <div className="space-y-4">
      {blocks.map((block, i) => {
        if (isPipeTable(block)) {
          return <TableRenderer key={i} text={block} accentColor={accentColor} />;
        }
        if (isChecklist(block)) {
          return <ChecklistRenderer key={i} text={block} accentColor={accentColor} />;
        }
        if (isNumberedList(block)) {
          return <NumberedListRenderer key={i} text={block} accentColor={accentColor} />;
        }
        if (isBulletList(block)) {
          return <BulletListRenderer key={i} text={block} accentColor={accentColor} />;
        }
        return <ProseRenderer key={i} text={block} />;
      })}
    </div>
  );
}

// ─── CSV export helper ────────────────────────────────────────────────────────

/** Convert the first pipe-table found in a section's content to CSV string */
export function sectionToCSV(content: string): string | null {
  const blocks = content.split(/\n{2,}/);
  for (const block of blocks) {
    const parsed = parsePipeTable(block.trim());
    if (parsed) {
      const escape = (s: string) => `"${s.replace(/"/g, '""')}"`;
      const header = parsed.headers.map(escape).join(',');
      const rows = parsed.rows.map(row => row.map(escape).join(','));
      return [header, ...rows].join('\n');
    }
  }
  return null;
}

/** Convert all pipe-tables in all sections to a single CSV (first table per section) */
export function templateToCSV(sections: { heading: string; content: string }[]): string {
  const parts: string[] = [];
  for (const section of sections) {
    const csv = sectionToCSV(section.content);
    if (csv) {
      parts.push(`# ${section.heading}`);
      parts.push(csv);
      parts.push('');
    }
  }
  return parts.join('\n');
}
