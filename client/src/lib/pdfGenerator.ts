// pdfGenerator.ts — Generates a branded, formatted PDF from a filled template
// Uses jsPDF + html2canvas to render the template form data into a professional PDF.
import jsPDF from 'jspdf';
import { CardTemplate } from './templateData';
import { COPYRIGHT_STATEMENT } from './templateFieldSchema';

interface TableRow {
  id: string;
  cells: Record<string, string>;
}

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

type FieldValue = string | TableRow[] | ChecklistItem[];

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

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.replace('#', '').padStart(6, '0'));
  if (!result) return [0, 0, 0];
  return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
}

function lightenHex(hex: string, amount: number): [number, number, number] {
  const [r, g, b] = hexToRgb(hex);
  return [
    Math.min(255, r + Math.round((255 - r) * amount)),
    Math.min(255, g + Math.round((255 - g) * amount)),
    Math.min(255, b + Math.round((255 - b) * amount)),
  ];
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
  const sepLine = lines[1];
  if (!/^[\|\-\s:]+$/.test(sepLine)) return null;
  return { headers, rows: lines.slice(2).map(parseRow) };
}

function getFieldValues(state: { fields: Record<string, FieldValue> }, sectionIndex: number, originalContent: string): string {
  const textKey = `text_${sectionIndex}`;
  const tableKey = `table_${sectionIndex}`;
  const checklistKey = `checklist_${sectionIndex}`;

  if (isTable(originalContent)) {
    const rows = state.fields[tableKey] as TableRow[] | undefined;
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

  // Prose fields
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

export async function generateTemplatePDF(params: {
  card: { id: string; title: string; deckId: string };
  template: CardTemplate;
  theme: ThemeData;
  formData: FormData;
}): Promise<void> {
  const { card, template, theme, formData } = params;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageW = 210;
  const pageH = 297;
  const margin = 15;
  const contentW = pageW - margin * 2;
  let y = 0;

  const [r, g, b] = hexToRgb(theme.color);
  const [lr, lg, lb] = lightenHex(theme.color, 0.92);

  // ── Cover header ──────────────────────────────────────────────────────────
  doc.setFillColor(r, g, b);
  doc.rect(0, 0, pageW, 38, 'F');

  // Card ID badge
  doc.setFillColor(255, 255, 255, 0.25);
  doc.roundedRect(margin, 8, 18, 7, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text(card.id, margin + 9, 13, { align: 'center' });

  // Deck name
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(theme.title.toUpperCase(), margin + 21, 13);

  // Template title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(template.title, margin, 28, { maxWidth: contentW - 10 });

  y = 46;

  // ── Document metadata strip ───────────────────────────────────────────────
  doc.setFillColor(lr, lg, lb);
  doc.roundedRect(margin, y, contentW, 18, 3, 3, 'F');

  const metaItems = [
    { label: 'Project', value: formData.projectName || '—' },
    { label: 'Prepared By', value: formData.projectOwner || '—' },
    { label: 'Date', value: formData.projectDate || '—' },
    { label: 'Version', value: formData.version || '1.0' },
  ];

  const colW = contentW / 4;
  metaItems.forEach((item, i) => {
    const x = margin + i * colW + 4;
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(r, g, b);
    doc.text(item.label.toUpperCase(), x, y + 6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(8);
    const truncated = item.value.length > 22 ? item.value.slice(0, 22) + '…' : item.value;
    doc.text(truncated, x, y + 13);
  });

  y += 26;

  // ── Template description ──────────────────────────────────────────────────
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(80, 80, 80);
  const descLines = doc.splitTextToSize(template.description, contentW);
  doc.text(descLines, margin, y);
  y += descLines.length * 4.5 + 6;

  // ── Sections ──────────────────────────────────────────────────────────────
  for (let si = 0; si < formData.sections.length; si++) {
    const section = formData.sections[si];
    const rawValue = getFieldValues(section.state, si, section.originalContent);

    // Check page break
    if (y > pageH - 40) {
      doc.addPage();
      y = margin;
    }

    // Section heading bar
    doc.setFillColor(r, g, b);
    doc.roundedRect(margin, y, contentW, 8, 2, 2, 'F');
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(`${si + 1}. ${section.heading}`, margin + 4, y + 5.5);
    y += 11;

    if (!rawValue) {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(160, 160, 160);
      doc.text('(not filled)', margin + 4, y + 4);
      y += 10;
      continue;
    }

    // Try to parse as structured data
    let parsed: { type: string; headers?: string[]; rows?: TableRow[]; items?: ChecklistItem[] } | null = null;
    try { parsed = JSON.parse(rawValue); } catch { /* plain text */ }

    if (parsed?.type === 'table' && parsed.headers && parsed.rows) {
      // Render table
      const headers = parsed.headers;
      const rows = parsed.rows;
      const colWidths = headers.map(() => contentW / headers.length);

      // Table header
      doc.setFillColor(lr, lg, lb);
      doc.rect(margin, y, contentW, 7, 'F');
      headers.forEach((h, hi) => {
        const cx = margin + colWidths.slice(0, hi).reduce((a, b) => a + b, 0);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(r, g, b);
        doc.text(h, cx + 2, y + 5);
      });
      y += 7;

      // Table rows
      rows.forEach((row, ri) => {
        if (y > pageH - 20) { doc.addPage(); y = margin; }
        const rowH = 8;
        if (ri % 2 === 0) {
          doc.setFillColor(250, 250, 252);
          doc.rect(margin, y, contentW, rowH, 'F');
        }
        headers.forEach((h, hi) => {
          const cx = margin + colWidths.slice(0, hi).reduce((a, b) => a + b, 0);
          const cellVal = row.cells[h] || '';
          doc.setFontSize(7.5);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(30, 30, 30);
          const truncated = cellVal.length > 28 ? cellVal.slice(0, 28) + '…' : cellVal;
          doc.text(truncated, cx + 2, y + 5.5);
        });
        // Row border
        doc.setDrawColor(220, 220, 220);
        doc.line(margin, y + rowH, margin + contentW, y + rowH);
        y += rowH;
      });
      y += 4;

    } else if (parsed?.type === 'checklist' && parsed.items) {
      // Render checklist
      for (const item of parsed.items) {
        if (y > pageH - 15) { doc.addPage(); y = margin; }
        const symbol = item.checked ? '☑' : '☐';
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(item.checked ? 100 : 30, item.checked ? 100 : 30, item.checked ? 100 : 30);
        const lines = doc.splitTextToSize(`${symbol} ${item.text}`, contentW - 4);
        doc.text(lines, margin + 2, y + 4);
        y += lines.length * 5 + 2;
      }
      y += 2;

    } else {
      // Plain text
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 30, 30);
      const lines = doc.splitTextToSize(rawValue, contentW - 4);
      for (const line of lines) {
        if (y > pageH - 15) { doc.addPage(); y = margin; }
        doc.text(line, margin + 2, y + 4);
        y += 5;
      }
      y += 3;
    }
  }

  // ── Footer on every page ──────────────────────────────────────────────────
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    // Footer bar
    doc.setFillColor(r, g, b);
    doc.rect(0, pageH - 10, pageW, 10, 'F');
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(255, 255, 255);
    doc.text(COPYRIGHT_STATEMENT, margin, pageH - 4);
    doc.text(`Page ${p} of ${totalPages}`, pageW - margin, pageH - 4, { align: 'right' });
  }

  // ── Save ──────────────────────────────────────────────────────────────────
  const filename = `${card.id}_${template.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
  doc.save(filename);
}
