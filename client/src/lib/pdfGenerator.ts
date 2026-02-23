// pdfGenerator.ts — Generates a branded, formatted PDF from a filled template
// Uses jsPDF to render the template form data into a professional PDF.
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
  const h = hex.replace('#', '').padStart(6, '0');
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
  if (!result) return [0, 0, 0];
  return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
}

function lightenRgb(r: number, g: number, b: number, amount = 0.9): [number, number, number] {
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
  if (!/^[\|\-\s:]+$/.test(lines[1])) return null;
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

/** Sanitize cell text for jsPDF — replace unsupported Unicode chars, strip markdown */
function sanitizeCellText(text: string): string {
  return text
    // Strip markdown bold/italic markers (**text** or *text* or __text__)
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Replace Unicode block/bar characters (Gantt bars) with ASCII bars
    .replace(/[\u2580-\u259F]+/g, (match) => {
      const len = match.length;
      return '[' + '#'.repeat(Math.min(len, 8)) + ']';
    })
    // Preserve common punctuation: em dash, en dash, ellipsis, smart quotes, bullets
    .replace(/\u2014/g, '--')   // em dash — -> --
    .replace(/\u2013/g, '-')    // en dash – -> -
    .replace(/\u2026/g, '...')  // ellipsis … -> ...
    .replace(/[\u2018\u2019]/g, "'") // smart single quotes
    .replace(/[\u201C\u201D]/g, '"') // smart double quotes
    .replace(/\u2022/g, '-')    // bullet • -> -
    .replace(/\u00A0/g, ' ')    // non-breaking space
    // Replace any remaining non-ASCII with empty string (not ?)
    .replace(/[^\x00-\x7E]/g, '');
}

/** Compute smart column widths — first column wider for label-type headers */
function computeColWidths(headers: string[], totalW: number): number[] {
  const n = headers.length;
  if (n === 0) return [];
  if (n === 1) return [totalW];
  const firstIsLabel = /^(task|activity|name|role|item|risk|action|deliverable|milestone|stakeholder|requirement|issue|assumption|constraint|dependency)/i.test(headers[0]);
  const secondIsLabel = n >= 2 && /^(task name|name|title|description|activity|deliverable)/i.test(headers[1]);
  if (firstIsLabel && secondIsLabel && n >= 3) {
    // Two label columns (e.g. Gantt: Task ID + Task Name) — give them more space
    const firstFrac = n <= 6 ? 0.10 : 0.08;
    const secondFrac = n <= 6 ? 0.22 : 0.18;
    const firstW = totalW * firstFrac;
    const secondW = totalW * secondFrac;
    const rest = (totalW - firstW - secondW) / (n - 2);
    return [firstW, secondW, ...Array(n - 2).fill(rest)];
  }
  if (firstIsLabel && n >= 2) {
    // Give first column 30-35% for label, rest split evenly
    const firstFrac = n <= 4 ? 0.35 : n <= 6 ? 0.30 : 0.25;
    const firstW = totalW * firstFrac;
    const rest = (totalW - firstW) / (n - 1);
    return [firstW, ...Array(n - 1).fill(rest)];
  }
  return Array(n).fill(totalW / n);
}

/** Draw the page footer on the current page */
function drawFooter(doc: jsPDF, pageW: number, pageH: number, margin: number, r: number, g: number, b: number, pageNum: number, totalPages: number): void {
  const footerY = pageH - 10;
  doc.setFillColor(r, g, b);
  doc.rect(0, footerY, pageW, 10, 'F');
  doc.setFontSize(5.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(255, 255, 255);
  doc.text(COPYRIGHT_STATEMENT, margin, footerY + 4);
  doc.text(`Page ${pageNum} of ${totalPages}`, pageW - margin, footerY + 4, { align: 'right' });
}

/** Draw the page header on the current page (pages 2+) */
function drawPageHeader(doc: jsPDF, pageW: number, margin: number, title: string, r: number, g: number, b: number): void {
  doc.setFillColor(r, g, b);
  doc.rect(0, 0, pageW, 10, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(`PMO Toolkit — ${title}`, margin, 7);
}

export async function generateTemplatePDF(params: {
  card: { id: string; title: string; deckId: string };
  template: CardTemplate;
  theme: ThemeData;
  formData: FormData;
}): Promise<void> {
  const { card, template, theme, formData } = params;

  // Detect if any section has a wide table (5+ columns) — use landscape
  let hasWideTable = false;
  for (const section of formData.sections) {
    if (isTable(section.originalContent)) {
      const parsed = parseMarkdownTable(section.originalContent);
      if (parsed && parsed.headers.length >= 5) { hasWideTable = true; break; }
    }
  }

  const orientation = hasWideTable ? 'landscape' : 'portrait';
  const doc = new jsPDF({ orientation, unit: 'mm', format: 'a4' });

  const pageW = orientation === 'landscape' ? 297 : 210;
  const pageH = orientation === 'landscape' ? 210 : 297;
  const margin = 15;
  const contentW = pageW - margin * 2;
  const bottomLimit = pageH - 18; // leave space for footer

  let y = 0;
  let currentPage = 1;

  const [r, g, b] = hexToRgb(theme.color);
  const [lr, lg, lb] = lightenRgb(r, g, b, 0.9);

  // ── Cover header ───────────────────────────────────────────────────────────
  // Full-width colour band
  doc.setFillColor(r, g, b);
  doc.rect(0, 0, pageW, 42, 'F');

  // Subtle diagonal accent
  doc.setFillColor(255, 255, 255);
  doc.setGState(new (doc as any).GState({ opacity: 0.04 }));
  doc.triangle(pageW - 60, 0, pageW, 0, pageW, 42, 'F');
  doc.setGState(new (doc as any).GState({ opacity: 1 }));

  // Card ID badge
  doc.setFillColor(255, 255, 255);
  doc.setGState(new (doc as any).GState({ opacity: 0.2 }));
  doc.roundedRect(margin, 9, 20, 7, 1.5, 1.5, 'F');
  doc.setGState(new (doc as any).GState({ opacity: 1 }));
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text(card.id, margin + 10, 14, { align: 'center' });

  // Deck name
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(theme.title.toUpperCase(), margin + 23, 14);

  // Template title — allow wrapping
  doc.setFontSize(17);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  const titleLines = doc.splitTextToSize(template.title, contentW - 20);
  doc.text(titleLines, margin, 28);

  y = 50;

  // ── Metadata strip ─────────────────────────────────────────────────────────
  doc.setFillColor(lr, lg, lb);
  doc.roundedRect(margin, y, contentW, 20, 2.5, 2.5, 'F');

  const metaItems = [
    { label: 'PROJECT / ORGANISATION', value: formData.projectName || '—' },
    { label: 'PREPARED BY', value: formData.projectOwner || '—' },
    { label: 'DATE', value: formData.projectDate || '—' },
    { label: 'VERSION', value: formData.version || '1.0' },
  ];

  const colW = contentW / 4;
  metaItems.forEach((item, i) => {
    const x = margin + i * colW + 4;
    // Divider between cells
    if (i > 0) {
      doc.setDrawColor(r, g, b);
      doc.setLineWidth(0.2);
      doc.setGState(new (doc as any).GState({ opacity: 0.2 }));
      doc.line(margin + i * colW, y + 3, margin + i * colW, y + 17);
      doc.setGState(new (doc as any).GState({ opacity: 1 }));
    }
    doc.setFontSize(5.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(r, g, b);
    doc.text(item.label, x, y + 7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(8.5);
    // Truncate to fit column width
    const maxChars = Math.floor(colW / 2.2);
    const truncated = item.value.length > maxChars ? item.value.slice(0, maxChars - 1) + '…' : item.value;
    doc.text(truncated, x, y + 15);
  });

  y += 28;

  // ── Description ────────────────────────────────────────────────────────────
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(80, 80, 80);
  const descLines = doc.splitTextToSize(template.description, contentW);
  doc.text(descLines, margin, y);
  y += descLines.length * 4.5 + 8;

  // ── Sections ───────────────────────────────────────────────────────────────
  for (let si = 0; si < formData.sections.length; si++) {
    const section = formData.sections[si];
    const rawValue = getFieldValues(section.state, si, section.originalContent);

    // Page break check
    if (y > bottomLimit - 20) {
      doc.addPage();
      currentPage++;
      drawPageHeader(doc, pageW, margin, template.title, r, g, b);
      y = 18;
    }

    // Section heading bar
    doc.setFillColor(r, g, b);
    doc.roundedRect(margin, y, contentW, 9, 2, 2, 'F');
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(`${si + 1}.  ${section.heading}`, margin + 5, y + 6);
    y += 12;

    if (!rawValue) {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(160, 160, 160);
      doc.text('(not filled)', margin + 5, y + 4);
      y += 10;
      continue;
    }

    let parsed: { type: string; headers?: string[]; rows?: TableRow[]; items?: ChecklistItem[] } | null = null;
    try { parsed = JSON.parse(rawValue); } catch { /* plain text */ }

    if (parsed?.type === 'table' && parsed.headers && parsed.rows) {
      const headers = parsed.headers;
      const rows = parsed.rows;
      const colWidths = computeColWidths(headers, contentW);

      // Table header row
      const headerH = 8;
      doc.setFillColor(lr, lg, lb);
      doc.rect(margin, y, contentW, headerH, 'F');
      // Header bottom border
      doc.setDrawColor(r, g, b);
      doc.setLineWidth(0.3);
      doc.line(margin, y + headerH, margin + contentW, y + headerH);

      headers.forEach((h, hi) => {
        const cx = margin + colWidths.slice(0, hi).reduce((a, b) => a + b, 0);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(r, g, b);
        doc.text(h, cx + 3, y + 5.5);
      });
      y += headerH;

      // Data rows — with text wrapping
      for (let ri = 0; ri < rows.length; ri++) {
        const row = rows[ri];

        // Compute row height based on wrapped cell content
        let maxLines = 1;
        headers.forEach((h, hi) => {
          const cellVal = sanitizeCellText(row.cells[h] || '');
          const cellW = colWidths[hi] - 6;
          const wrapped = doc.splitTextToSize(cellVal, cellW);
          maxLines = Math.max(maxLines, wrapped.length);
        });
        const rowH = Math.max(8, maxLines * 4.5 + 3);

        // Page break check
        if (y + rowH > bottomLimit) {
          doc.addPage();
          currentPage++;
          drawPageHeader(doc, pageW, margin, template.title, r, g, b);
          y = 18;
          // Re-draw table header
          doc.setFillColor(lr, lg, lb);
          doc.rect(margin, y, contentW, headerH, 'F');
          headers.forEach((h, hi) => {
            const cx = margin + colWidths.slice(0, hi).reduce((a, b) => a + b, 0);
            doc.setFontSize(7);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(r, g, b);
            doc.text(h, cx + 3, y + 5.5);
          });
          y += headerH;
        }

        // Alternating row background
        if (ri % 2 === 0) {
          doc.setFillColor(250, 250, 252);
          doc.rect(margin, y, contentW, rowH, 'F');
        }

        // Cell content
        headers.forEach((h, hi) => {
          const cx = margin + colWidths.slice(0, hi).reduce((a, b) => a + b, 0);
          const cellVal = sanitizeCellText(row.cells[h] || '');
          const cellW = colWidths[hi] - 6;
          const wrapped = doc.splitTextToSize(cellVal, cellW);
          doc.setFontSize(7.5);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(30, 30, 30);
          doc.text(wrapped, cx + 3, y + 5);
        });

        // Row bottom border
        doc.setDrawColor(220, 220, 225);
        doc.setLineWidth(0.2);
        doc.line(margin, y + rowH, margin + contentW, y + rowH);
        y += rowH;
      }
      y += 5;

    } else if (parsed?.type === 'checklist' && parsed.items) {
      for (const item of parsed.items) {
        if (y > bottomLimit - 8) {
          doc.addPage();
          currentPage++;
          drawPageHeader(doc, pageW, margin, template.title, r, g, b);
          y = 18;
        }

        // Checkbox square
        const boxSize = 3.5;
        const boxY = y + 1;
        if (item.checked) {
          doc.setFillColor(r, g, b);
          doc.roundedRect(margin + 2, boxY, boxSize, boxSize, 0.5, 0.5, 'F');
          // Checkmark
          doc.setDrawColor(255, 255, 255);
          doc.setLineWidth(0.6);
          doc.line(margin + 2.8, boxY + 1.8, margin + 3.5, boxY + 2.8);
          doc.line(margin + 3.5, boxY + 2.8, margin + 5, boxY + 1.2);
        } else {
          doc.setDrawColor(r, g, b);
          doc.setLineWidth(0.5);
          doc.roundedRect(margin + 2, boxY, boxSize, boxSize, 0.5, 0.5, 'S');
        }

        // Item text with wrapping
        const textX = margin + 9;
        const textW = contentW - 9;
        const textLines = doc.splitTextToSize(item.text, textW);
        doc.setFontSize(8.5);
        doc.setFont('helvetica', item.checked ? 'italic' : 'normal');
        doc.setTextColor(item.checked ? 130 : 30, item.checked ? 130 : 30, item.checked ? 130 : 30);
        doc.text(textLines, textX, y + 4.5);
        y += textLines.length * 5 + 2;
      }
      y += 3;

    } else {
      // Plain text — label: value pairs
      const lines = rawValue.split('\n');
      for (const line of lines) {
        if (!line.trim()) continue;
        if (y > bottomLimit - 8) {
          doc.addPage();
          currentPage++;
          drawPageHeader(doc, pageW, margin, template.title, r, g, b);
          y = 18;
        }
        const colonIdx = line.indexOf(':');
        if (colonIdx > 0 && colonIdx < 60) {
          const label = line.slice(0, colonIdx).trim();
          const value = line.slice(colonIdx + 1).trim();
          // Label
          doc.setFontSize(8);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(r, g, b);
          const labelW = doc.getTextWidth(label + ':  ');
          doc.text(`${label}:  `, margin + 4, y + 4);
          // Value — wrap if needed
          const valueW = contentW - 4 - labelW;
          const valueLines = doc.splitTextToSize(value, valueW);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(30, 30, 30);
          doc.text(valueLines[0] || '', margin + 4 + labelW, y + 4);
          if (valueLines.length > 1) {
            for (let vl = 1; vl < valueLines.length; vl++) {
              y += 5;
              if (y > bottomLimit - 8) {
                doc.addPage();
                currentPage++;
                drawPageHeader(doc, pageW, margin, template.title, r, g, b);
                y = 18;
              }
              doc.text(valueLines[vl], margin + 4 + labelW, y + 4);
            }
          }
          y += 6;
        } else {
          doc.setFontSize(8.5);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(30, 30, 30);
          const wrapped = doc.splitTextToSize(line, contentW - 4);
          doc.text(wrapped, margin + 4, y + 4);
          y += wrapped.length * 5 + 1;
        }
      }
      y += 4;
    }
  }

  // ── Footer on every page ───────────────────────────────────────────────────
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    drawFooter(doc, pageW, pageH, margin, r, g, b, p, totalPages);
  }

  // ── Save ───────────────────────────────────────────────────────────────────
  const filename = `${card.id}_${template.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
  doc.save(filename);
}
