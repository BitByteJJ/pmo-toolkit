// PMO Toolkit Navigator — Fillable Template Field Schema
// Converts templateData.ts sections into structured, interactive form fields.
// Each TemplateField maps to a rendered input, textarea, table, checklist, or dynamic row group.

export type FieldType =
  | 'text'           // single-line text input
  | 'textarea'       // multi-line text area
  | 'date'           // date picker
  | 'select'         // dropdown with predefined options
  | 'rag'            // RAG status picker (🟢 Green / 🟡 Amber / 🔴 Red)
  | 'table'          // dynamic table with addable rows
  | 'checklist'      // dynamic checklist with addable items
  | 'number'         // numeric input
  | 'currency'       // currency input with £/$ prefix
  | 'percentage'     // 0–100 slider + text
  | 'priority'       // High / Medium / Low selector
  | 'yesno'          // Yes / No toggle
  | 'label';         // read-only section label / instruction text

export interface TableColumn {
  key: string;
  label: string;
  type: FieldType;
  width?: string;         // CSS width hint, e.g. '120px' or '30%'
  options?: string[];     // for 'select' columns
  placeholder?: string;
}

export interface TemplateField {
  key: string;            // unique key within this template
  label: string;          // displayed field label
  type: FieldType;
  placeholder?: string;
  options?: string[];     // for 'select' type
  columns?: TableColumn[]; // for 'table' type
  minRows?: number;       // for 'table' — minimum pre-filled rows
  maxRows?: number;       // for 'table' — optional cap
  required?: boolean;
  hint?: string;          // small helper text shown below the field
  defaultValue?: string;
}

export interface FillableSection {
  heading: string;
  instruction?: string;   // optional guidance text shown at top of section
  fields: TemplateField[];
}

export interface FillableTemplate {
  cardId: string;
  title: string;
  description: string;
  deckId: string;
  sections: FillableSection[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Deck colour map (mirrors pmoData.ts DECKS)
// ─────────────────────────────────────────────────────────────────────────────
export const DECK_THEME: Record<string, { color: string; bg: string; text: string; title: string }> = {
  phases:       { color: '#FBBF24', bg: 'rgba(217,119,6,0.18)',  text: '#fde68a', title: 'Project Phases' },
  archetypes:   { color: '#2DD4BF', bg: 'rgba(13,148,136,0.18)', text: '#99f6e4', title: 'Archetyping Guide' },
  methodologies:{ color: '#818CF8', bg: 'rgba(79,70,229,0.18)',  text: '#c7d2fe', title: 'Methodologies' },
  people:       { color: '#FB7185', bg: 'rgba(225,29,72,0.18)',  text: '#fecdd3', title: 'People Domain' },
  process:      { color: '#34D399', bg: 'rgba(5,150,105,0.18)',  text: '#a7f3d0', title: 'Process Domain' },
  business:     { color: '#A78BFA', bg: 'rgba(124,58,237,0.18)', text: '#ddd6fe', title: 'Business Environment' },
  tools:        { color: '#38BDF8', bg: 'rgba(2,132,199,0.18)',  text: '#bae6fd', title: 'Tools Deck' },
  techniques:   { color: '#94a3b8', bg: 'rgba(100,116,139,0.18)',text: '#e2e8f0', title: 'Advanced Techniques' },
};

// ─────────────────────────────────────────────────────────────────────────────
// Copyright statement embedded in every download
// ─────────────────────────────────────────────────────────────────────────────
export const COPYRIGHT_STATEMENT =
  '© PMO Toolkit Navigator. All rights reserved. This template is provided for educational and professional use. ' +
  'Reproduction or redistribution without permission is prohibited.';

// ─────────────────────────────────────────────────────────────────────────────
// Helper: parse a Markdown table string into TableColumn definitions
// Used to auto-generate table fields from existing templateData sections
// ─────────────────────────────────────────────────────────────────────────────
export function parseMarkdownTableToColumns(markdown: string): TableColumn[] {
  const lines = markdown.trim().split('\n').filter(l => l.trim().startsWith('|'));
  if (lines.length < 2) return [];
  const headers = lines[0].split('|').map(h => h.trim()).filter(Boolean);
  return headers.map((h, i) => {
    const key = h.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
    // Infer column type from header name
    let type: FieldType = 'text';
    if (/date|deadline|due|by when/i.test(h)) type = 'date';
    else if (/status|rag|colour|color/i.test(h)) type = 'rag';
    else if (/owner|responsible|assigned/i.test(h)) type = 'text';
    else if (/%|percent|complete/i.test(h)) type = 'percentage';
    else if (/priority/i.test(h)) type = 'priority';
    else if (/budget|cost|£|\$/i.test(h)) type = 'currency';
    else if (/notes?|comment|description|detail/i.test(h)) type = 'textarea';
    return { key: key || `col_${i}`, label: h, type, placeholder: '' };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: detect if a markdown content block is primarily a table
// ─────────────────────────────────────────────────────────────────────────────
export function isMarkdownTable(content: string): boolean {
  const lines = content.trim().split('\n');
  const tableLines = lines.filter(l => l.trim().startsWith('|'));
  return tableLines.length >= 2 && tableLines.length / lines.length > 0.5;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: count pre-filled data rows in a markdown table (excludes header + separator)
// ─────────────────────────────────────────────────────────────────────────────
export function countMarkdownTableDataRows(markdown: string): number {
  const lines = markdown.trim().split('\n').filter(l => l.trim().startsWith('|'));
  // lines[0] = header, lines[1] = separator (---|---), rest = data rows
  if (lines.length < 3) return 0;
  return lines.slice(2).filter(l => {
    // Count rows that have at least one non-empty cell
    const cells = l.split('|').map(c => c.trim()).filter(Boolean);
    return cells.some(c => c.length > 0 && c !== '');
  }).length;
}
