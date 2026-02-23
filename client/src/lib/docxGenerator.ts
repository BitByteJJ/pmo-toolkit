// docxGenerator.ts — Generates a branded Word (.docx) file from a filled template
// Uses the docx library to produce a professionally formatted document.
import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, WidthType, BorderStyle, ShadingType,
  Header, Footer, PageNumber, convertInchesToTwip, TabStopType, TabStopPosition,
} from 'docx';
import { saveAs } from 'file-saver';
import { CardTemplate } from './templateData';
import { COPYRIGHT_STATEMENT } from './templateFieldSchema';

interface TableRowData {
  id: string;
  cells: Record<string, string>;
}

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

type FieldValue = string | TableRowData[] | ChecklistItem[];

interface SectionData {
  heading: string;
  state: { fields: Record<string, FieldValue> };
  originalContent: string;
}

interface FormData {
  projectName: string;
  projectOwner: string;
  projectDate: string;
  version: string;
  sections: SectionData[];
}

interface ThemeData {
  color: string;
  bg: string;
  text: string;
  title: string;
}

function hexToDocxColor(hex: string): string {
  return hex.replace('#', '').toUpperCase().padStart(6, '0');
}

function lightenHex(hex: string): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const lighten = (c: number) => Math.min(255, c + Math.round((255 - c) * 0.88));
  return [lighten(r), lighten(g), lighten(b)]
    .map(c => c.toString(16).padStart(2, '0'))
    .join('').toUpperCase();
}

function isTable(content: string): boolean {
  const lines = content.trim().split('\n');
  return lines.length >= 2 && lines[0].includes('|') && /^[\|\-\s:]+$/.test((lines[1] || '').trim());
}

function isChecklist(content: string): boolean {
  return content.trim().split('\n').some(l => /^-\s*\[[ xX]\]/.test(l.trim()));
}

function parseMarkdownTable(content: string): { headers: string[]; rows: string[][] } | null {
  const lines = content.trim().split('\n').filter(l => l.trim().startsWith('|'));
  if (lines.length < 2) return null;
  const parseRow = (line: string) =>
    line.replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());
  const headers = parseRow(lines[0]);
  if (!/^[\|\-\s:]+$/.test(lines[1])) return null;
  return { headers, rows: lines.slice(2).map(parseRow) };
}

function getFieldValues(state: { fields: Record<string, FieldValue> }, sectionIndex: number, originalContent: string): string {
  const textKey = `text_${sectionIndex}`;
  const tableKey = `table_${sectionIndex}`;
  const checklistKey = `checklist_${sectionIndex}`;

  if (isTable(originalContent)) {
    const rows = state.fields[tableKey] as TableRowData[] | undefined;
    if (!rows || rows.length === 0) return '';
    const tableData = parseMarkdownTable(originalContent);
    if (!tableData) return '';
    return JSON.stringify({ type: 'table', headers: tableData.headers, rows });
  }

  if (isChecklist(originalContent)) {
    const items = state.fields[checklistKey] as ChecklistItem[] | undefined;
    if (!items) return '';
    return JSON.stringify({ type: 'checklist', items });
  }

  const fieldValues: string[] = [];
  const lines = originalContent.trim().split('\n');
  let fieldIndex = 0;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const boldMatch = trimmed.match(/^\*\*([^*]+)\*\*:?\s*(.*)?$/);
    const bulletMatch = trimmed.match(/^[-*]\s+(.+)$/);
    if (boldMatch || bulletMatch) {
      const label = boldMatch ? boldMatch[1].trim().replace(/:$/, '') : (bulletMatch![1].split(':')[0].trim());
      const val = (state.fields[`${textKey}_${fieldIndex}`] as string) || '';
      if (val) fieldValues.push(`${label}: ${val}`);
      fieldIndex++;
    } else if (fieldIndex === 0) {
      const val = (state.fields[`${textKey}_0`] as string) || '';
      if (val) fieldValues.push(val);
      fieldIndex++;
    }
  }
  return fieldValues.join('\n');
}

/** Compute smart column widths — first column wider for labels/names */
function computeColWidths(headers: string[], totalDxa: number): number[] {
  const n = headers.length;
  if (n === 0) return [];
  if (n === 1) return [totalDxa];
  // Give first column 30% more if it looks like a label column
  const firstIsLabel = /^(task|activity|name|role|item|risk|action|deliverable|milestone|stakeholder|requirement|issue|assumption|constraint|dependency)/i.test(headers[0]);
  if (firstIsLabel && n >= 2) {
    const firstW = Math.floor(totalDxa * 0.32);
    const rest = Math.floor((totalDxa - firstW) / (n - 1));
    return [firstW, ...Array(n - 1).fill(rest)];
  }
  return Array(n).fill(Math.floor(totalDxa / n));
}

function buildTableSection(headers: string[], rows: TableRowData[], accentColor: string): Table {
  const totalDxa = 8640; // ~6 inches in DXA (1 inch = 1440 DXA)
  const colWidths = computeColWidths(headers, totalDxa);
  const accentHex = hexToDocxColor(accentColor);
  const lightHex = lightenHex(accentColor);

  const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
  const thinBorder = { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' };

  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) => new TableCell({
      children: [new Paragraph({
        children: [new TextRun({ text: h, bold: true, color: accentHex, size: 18 })],
        spacing: { before: 60, after: 60 },
      })],
      shading: { type: ShadingType.SOLID, color: lightHex, fill: lightHex },
      width: { size: colWidths[i], type: WidthType.DXA },
      margins: { top: 60, bottom: 60, left: 100, right: 100 },
      borders: {
        top: noBorder, bottom: thinBorder,
        left: i === 0 ? noBorder : thinBorder,
        right: noBorder,
      },
    })),
  });

  const dataRows = rows.map((row, ri) => new TableRow({
    children: headers.map((h, i) => {
      const cellText = row.cells[h] || '';
      return new TableCell({
        children: [new Paragraph({
          children: [new TextRun({ text: cellText, size: 18, color: '1E293B' })],
          spacing: { before: 60, after: 60 },
        })],
        shading: ri % 2 === 0
          ? { type: ShadingType.SOLID, color: 'FFFFFF', fill: 'FFFFFF' }
          : { type: ShadingType.SOLID, color: 'F8FAFC', fill: 'F8FAFC' },
        width: { size: colWidths[i], type: WidthType.DXA },
        margins: { top: 60, bottom: 60, left: 100, right: 100 },
        borders: {
          top: noBorder, bottom: thinBorder,
          left: i === 0 ? noBorder : thinBorder,
          right: noBorder,
        },
      });
    }),
  }));

  return new Table({
    rows: [headerRow, ...dataRows],
    width: { size: totalDxa, type: WidthType.DXA },
  });
}

function buildSectionHeading(num: number, heading: string, accentColor: string): Paragraph {
  const accentHex = hexToDocxColor(accentColor);
  const lightHex = lightenHex(accentColor);
  return new Paragraph({
    children: [
      new TextRun({ text: `${num}. `, bold: true, color: accentHex, size: 20 }),
      new TextRun({ text: heading, bold: true, color: '1E293B', size: 20 }),
    ],
    spacing: { before: 240, after: 80 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: accentHex },
    },
    shading: { type: ShadingType.SOLID, color: lightHex, fill: lightHex },
    indent: { left: 100, right: 100 },
  });
}

export async function generateTemplateDocx(params: {
  card: { id: string; title: string; deckId: string };
  template: CardTemplate;
  theme: ThemeData;
  formData: FormData;
}): Promise<void> {
  const { card, template, theme, formData } = params;
  const accentHex = hexToDocxColor(theme.color);
  const lightHex = lightenHex(theme.color);

  const children: (Paragraph | Table)[] = [];

  // ── Title block ────────────────────────────────────────────────────────────
  children.push(new Paragraph({
    children: [
      new TextRun({ text: card.id, bold: true, color: accentHex, size: 20 }),
      new TextRun({ text: '  ·  ', color: 'AAAAAA', size: 20 }),
      new TextRun({ text: theme.title.toUpperCase(), color: accentHex, size: 16 }),
    ],
    spacing: { before: 0, after: 80 },
  }));

  children.push(new Paragraph({
    children: [
      new TextRun({ text: template.title, bold: true, color: '0F172A', size: 36 }),
    ],
    spacing: { after: 60 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: accentHex } },
  }));

  children.push(new Paragraph({ spacing: { after: 120 } }));

  // ── Metadata table ─────────────────────────────────────────────────────────
  const metaBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
  children.push(new Table({
    rows: [
      new TableRow({
        children: [
          ['PROJECT / ORGANISATION', formData.projectName || '—'],
          ['PREPARED BY', formData.projectOwner || '—'],
          ['DATE', formData.projectDate || '—'],
          ['VERSION', formData.version || '1.0'],
        ].map(([label, value]) => new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: label, bold: true, size: 14, color: accentHex })],
              spacing: { before: 60, after: 30 },
            }),
            new Paragraph({
              children: [new TextRun({ text: value, size: 18, color: '1E293B' })],
              spacing: { after: 60 },
            }),
          ],
          shading: { type: ShadingType.SOLID, color: lightHex, fill: lightHex },
          width: { size: 2160, type: WidthType.DXA },
          margins: { top: 60, bottom: 60, left: 120, right: 120 },
          borders: {
            top: metaBorder, bottom: metaBorder,
            left: metaBorder, right: { style: BorderStyle.SINGLE, size: 4, color: 'FFFFFF' },
          },
        })),
      }),
    ],
    width: { size: 8640, type: WidthType.DXA },
    borders: {
      top: metaBorder, bottom: metaBorder, left: metaBorder, right: metaBorder,
    },
  }));

  children.push(new Paragraph({ spacing: { after: 160 } }));

  // ── Description ────────────────────────────────────────────────────────────
  children.push(new Paragraph({
    children: [new TextRun({ text: template.description, italics: true, color: '475569', size: 18 })],
    spacing: { after: 240 },
  }));

  // ── Sections ───────────────────────────────────────────────────────────────
  for (let si = 0; si < formData.sections.length; si++) {
    const section = formData.sections[si];
    const rawValue = getFieldValues(section.state, si, section.originalContent);

    // Section heading
    children.push(buildSectionHeading(si + 1, section.heading, theme.color));

    if (!rawValue) {
      children.push(new Paragraph({
        children: [new TextRun({ text: '(not filled)', italics: true, color: '94A3B8', size: 18 })],
        spacing: { after: 120 },
      }));
      continue;
    }

    let parsed: { type: string; headers?: string[]; rows?: TableRowData[]; items?: ChecklistItem[] } | null = null;
    try { parsed = JSON.parse(rawValue); } catch { /* plain text */ }

    if (parsed?.type === 'table' && parsed.headers && parsed.rows) {
      children.push(buildTableSection(parsed.headers, parsed.rows, theme.color));
      children.push(new Paragraph({ spacing: { after: 200 } }));

    } else if (parsed?.type === 'checklist' && parsed.items) {
      for (const item of parsed.items) {
        const checkChar = item.checked ? '\u2611' : '\u2610'; // ☑ or ☐
        children.push(new Paragraph({
          children: [
            new TextRun({
              text: `${checkChar}  `,
              size: 20,
              color: item.checked ? accentHex : '64748B',
            }),
            new TextRun({
              text: item.text,
              size: 18,
              strike: item.checked,
              color: item.checked ? '94A3B8' : '1E293B',
            }),
          ],
          spacing: { after: 80 },
          indent: { left: 100 },
        }));
      }
      children.push(new Paragraph({ spacing: { after: 120 } }));

    } else {
      // Plain text — render label: value pairs
      const lines = rawValue.split('\n');
      for (const line of lines) {
        if (!line.trim()) continue;
        const colonIdx = line.indexOf(':');
        if (colonIdx > 0 && colonIdx < 50) {
          const label = line.slice(0, colonIdx).trim();
          const value = line.slice(colonIdx + 1).trim();
          children.push(new Paragraph({
            children: [
              new TextRun({ text: `${label}:  `, bold: true, size: 18, color: accentHex }),
              new TextRun({ text: value, size: 18, color: '1E293B' }),
            ],
            spacing: { after: 80 },
            indent: { left: 100 },
          }));
        } else {
          children.push(new Paragraph({
            children: [new TextRun({ text: line, size: 18, color: '1E293B' })],
            spacing: { after: 80 },
            indent: { left: 100 },
          }));
        }
      }
      children.push(new Paragraph({ spacing: { after: 120 } }));
    }
  }

  // ── Build document ─────────────────────────────────────────────────────────
  const doc = new Document({
    creator: 'StratAlign — PMO Toolkit Navigator',
    title: template.title,
    description: template.description,
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(1.0),
            bottom: convertInchesToTwip(1.1),
            left: convertInchesToTwip(1.0),
            right: convertInchesToTwip(1.0),
          },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: 'PMO Toolkit Navigator', bold: true, color: accentHex, size: 18 }),
                new TextRun({ text: '  ·  ', color: 'AAAAAA', size: 18 }),
                new TextRun({ text: template.title, color: '475569', size: 18 }),
              ],
              border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: accentHex } },
              spacing: { after: 60 },
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: COPYRIGHT_STATEMENT, size: 14, color: '94A3B8' }),
                new TextRun({ text: '   |   Page ', size: 14, color: '94A3B8' }),
                new TextRun({ children: [PageNumber.CURRENT], size: 14, color: '64748B' }),
                new TextRun({ text: ' of ', size: 14, color: '94A3B8' }),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 14, color: '64748B' }),
              ],
              alignment: AlignmentType.CENTER,
              border: { top: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' } },
              spacing: { before: 60 },
            }),
          ],
        }),
      },
      children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  const filename = `${card.id}_${template.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.docx`;
  saveAs(blob, filename);
}
