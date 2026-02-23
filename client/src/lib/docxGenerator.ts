// docxGenerator.ts — Generates a branded Word (.docx) file from a filled template
// Uses the docx library to produce a professionally formatted document.
import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, WidthType, BorderStyle, ShadingType,
  Header, Footer, PageNumber, NumberFormat, convertInchesToTwip,
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

function buildTableSection(headers: string[], rows: TableRowData[], accentColor: string): Table {
  const colCount = headers.length;
  const colWidth = Math.floor(9000 / colCount);

  const headerRow = new TableRow({
    children: headers.map(h => new TableCell({
      children: [new Paragraph({
        children: [new TextRun({ text: h, bold: true, color: hexToDocxColor(accentColor), size: 18 })],
      })],
      shading: { type: ShadingType.SOLID, color: lightenHex(accentColor), fill: lightenHex(accentColor) },
      width: { size: colWidth, type: WidthType.DXA },
    })),
  });

  const dataRows = rows.map((row, ri) => new TableRow({
    children: headers.map(h => new TableCell({
      children: [new Paragraph({
        children: [new TextRun({ text: row.cells[h] || '', size: 18 })],
      })],
      shading: ri % 2 === 0
        ? { type: ShadingType.SOLID, color: 'FFFFFF', fill: 'FFFFFF' }
        : { type: ShadingType.SOLID, color: 'F8FAFC', fill: 'F8FAFC' },
      width: { size: colWidth, type: WidthType.DXA },
    })),
  }));

  return new Table({
    rows: [headerRow, ...dataRows],
    width: { size: 9000, type: WidthType.DXA },
  });
}

export async function generateTemplateDocx(params: {
  card: { id: string; title: string; deckId: string };
  template: CardTemplate;
  theme: ThemeData;
  formData: FormData;
}): Promise<void> {
  const { card, template, theme, formData } = params;
  const accentColor = hexToDocxColor(theme.color);
  const lightColor = lightenHex(theme.color);

  const children: (Paragraph | Table)[] = [];

  // ── Title ─────────────────────────────────────────────────────────────────
  children.push(new Paragraph({
    children: [
      new TextRun({ text: `${card.id} — `, bold: true, color: accentColor, size: 28 }),
      new TextRun({ text: template.title, bold: true, color: accentColor, size: 28 }),
    ],
    spacing: { after: 120 },
  }));

  // Deck label
  children.push(new Paragraph({
    children: [new TextRun({ text: theme.title.toUpperCase(), color: accentColor, size: 16, bold: true })],
    spacing: { after: 200 },
  }));

  // ── Metadata table ────────────────────────────────────────────────────────
  children.push(new Table({
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({ children: [new TextRun({ text: 'PROJECT / ORGANISATION', bold: true, size: 14, color: accentColor })] }),
              new Paragraph({ children: [new TextRun({ text: formData.projectName || '—', size: 18 })] }),
            ],
            shading: { type: ShadingType.SOLID, color: lightColor, fill: lightColor },
            width: { size: 3000, type: WidthType.DXA },
          }),
          new TableCell({
            children: [
              new Paragraph({ children: [new TextRun({ text: 'PREPARED BY', bold: true, size: 14, color: accentColor })] }),
              new Paragraph({ children: [new TextRun({ text: formData.projectOwner || '—', size: 18 })] }),
            ],
            shading: { type: ShadingType.SOLID, color: lightColor, fill: lightColor },
            width: { size: 2000, type: WidthType.DXA },
          }),
          new TableCell({
            children: [
              new Paragraph({ children: [new TextRun({ text: 'DATE', bold: true, size: 14, color: accentColor })] }),
              new Paragraph({ children: [new TextRun({ text: formData.projectDate || '—', size: 18 })] }),
            ],
            shading: { type: ShadingType.SOLID, color: lightColor, fill: lightColor },
            width: { size: 2000, type: WidthType.DXA },
          }),
          new TableCell({
            children: [
              new Paragraph({ children: [new TextRun({ text: 'VERSION', bold: true, size: 14, color: accentColor })] }),
              new Paragraph({ children: [new TextRun({ text: formData.version || '1.0', size: 18 })] }),
            ],
            shading: { type: ShadingType.SOLID, color: lightColor, fill: lightColor },
            width: { size: 2000, type: WidthType.DXA },
          }),
        ],
      }),
    ],
    width: { size: 9000, type: WidthType.DXA },
  }));

  children.push(new Paragraph({ spacing: { after: 200 } }));

  // ── Description ───────────────────────────────────────────────────────────
  children.push(new Paragraph({
    children: [new TextRun({ text: template.description, italics: true, color: '555555', size: 18 })],
    spacing: { after: 300 },
  }));

  // ── Sections ──────────────────────────────────────────────────────────────
  for (let si = 0; si < formData.sections.length; si++) {
    const section = formData.sections[si];
    const rawValue = getFieldValues(section.state, si, section.originalContent);

    // Section heading
    children.push(new Paragraph({
      children: [
        new TextRun({ text: `${si + 1}. ${section.heading}`, bold: true, color: 'FFFFFF', size: 20 }),
      ],
      shading: { type: ShadingType.SOLID, color: accentColor, fill: accentColor },
      spacing: { before: 200, after: 100 },
    }));

    if (!rawValue) {
      children.push(new Paragraph({
        children: [new TextRun({ text: '(not filled)', italics: true, color: '999999', size: 18 })],
        spacing: { after: 100 },
      }));
      continue;
    }

    let parsed: { type: string; headers?: string[]; rows?: TableRowData[]; items?: ChecklistItem[] } | null = null;
    try { parsed = JSON.parse(rawValue); } catch { /* plain text */ }

    if (parsed?.type === 'table' && parsed.headers && parsed.rows) {
      children.push(buildTableSection(parsed.headers, parsed.rows, theme.color));
      children.push(new Paragraph({ spacing: { after: 150 } }));

    } else if (parsed?.type === 'checklist' && parsed.items) {
      for (const item of parsed.items) {
        children.push(new Paragraph({
          children: [
            new TextRun({ text: item.checked ? '☑ ' : '☐ ', size: 18, color: item.checked ? accentColor : '444444' }),
            new TextRun({ text: item.text, size: 18, strike: item.checked, color: item.checked ? '888888' : '1e293b' }),
          ],
          spacing: { after: 60 },
        }));
      }
      children.push(new Paragraph({ spacing: { after: 100 } }));

    } else {
      // Plain text — split into lines
      const lines = rawValue.split('\n');
      for (const line of lines) {
        if (!line.trim()) continue;
        const colonIdx = line.indexOf(':');
        if (colonIdx > 0 && colonIdx < 40) {
          const label = line.slice(0, colonIdx).trim();
          const value = line.slice(colonIdx + 1).trim();
          children.push(new Paragraph({
            children: [
              new TextRun({ text: `${label}: `, bold: true, size: 18, color: accentColor }),
              new TextRun({ text: value, size: 18 }),
            ],
            spacing: { after: 80 },
          }));
        } else {
          children.push(new Paragraph({
            children: [new TextRun({ text: line, size: 18 })],
            spacing: { after: 80 },
          }));
        }
      }
      children.push(new Paragraph({ spacing: { after: 100 } }));
    }
  }

  // ── Document ──────────────────────────────────────────────────────────────
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(1),
            bottom: convertInchesToTwip(1),
            left: convertInchesToTwip(1),
            right: convertInchesToTwip(1),
          },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: `PMO Toolkit Navigator — ${template.title}`, bold: true, color: accentColor, size: 18 }),
              ],
              border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: accentColor } },
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: COPYRIGHT_STATEMENT + '   |   Page ', size: 14, color: '888888' }),
                new TextRun({ children: [PageNumber.CURRENT], size: 14, color: '888888' }),
                new TextRun({ text: ' of ', size: 14, color: '888888' }),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 14, color: '888888' }),
              ],
              alignment: AlignmentType.CENTER,
              border: { top: { style: BorderStyle.SINGLE, size: 4, color: 'DDDDDD' } },
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
