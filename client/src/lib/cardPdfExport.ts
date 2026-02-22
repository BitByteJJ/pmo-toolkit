// cardPdfExport.ts
// Generates a well-formatted A4 PDF for a single PMO card using jsPDF.
// Includes: card header, tagline, What It Is, When To Use, Steps,
//           Pro Tip, Tags, Glossary Terms, and Case Study.
// All text is properly paginated — no content overflows page boundaries.

import jsPDF from 'jspdf';
import type { PMOCard, Deck } from './pmoData';
import type { CaseStudy } from './caseStudiesData';
import type { GlossaryTerm } from './glossaryData';

// ─── constants ───────────────────────────────────────────────────────────────

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 16;
const CONTENT_W = PAGE_W - MARGIN * 2;
const FOOTER_H = 16;
const BODY_BOTTOM = PAGE_H - FOOTER_H - 4;
const TOP_MARGIN = 16;
const LINE_H = 5.2;
const STEP_LINE_H = 5.0;

// ─── helpers ─────────────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function lighten(rgb: [number, number, number], amount = 0.85): [number, number, number] {
  return [
    Math.round(rgb[0] + (255 - rgb[0]) * amount),
    Math.round(rgb[1] + (255 - rgb[1]) * amount),
    Math.round(rgb[2] + (255 - rgb[2]) * amount),
  ];
}

function wrapText(doc: jsPDF, text: string, maxWidth: number): string[] {
  return doc.splitTextToSize(text, maxWidth) as string[];
}

function roundRect(
  doc: jsPDF,
  x: number, y: number, w: number, h: number,
  r: number,
  fillColor: [number, number, number],
) {
  doc.setFillColor(...fillColor);
  doc.roundedRect(x, y, w, h, r, r, 'F');
}

async function loadImageAsBase64(url: string): Promise<string | null> {
  try {
    const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) return null;
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

// ─── page-break aware cursor ────────────────────────────────────────────────

class Cursor {
  y: number;
  doc: jsPDF;

  constructor(doc: jsPDF, startY: number) {
    this.doc = doc;
    this.y = startY;
  }

  ensureSpace(needed: number) {
    if (this.y + needed > BODY_BOTTOM) {
      this.doc.addPage();
      this.y = TOP_MARGIN;
    }
  }

  writeLines(lines: string[], lineH: number) {
    for (const line of lines) {
      this.ensureSpace(lineH);
      this.doc.text(line, MARGIN + 4, this.y);
      this.y += lineH;
    }
  }

  advance(amount: number) {
    this.y += amount;
  }
}

// ─── main export ─────────────────────────────────────────────────────────────

export interface CardPDFOptions {
  card: PMOCard;
  deck: Deck;
  caseStudy?: CaseStudy;
  glossaryTerms?: GlossaryTerm[];
  illustrationUrl?: string;
}

export async function generateCardPDF({
  card,
  deck,
  caseStudy,
  glossaryTerms = [],
  illustrationUrl,
}: CardPDFOptions): Promise<void> {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

  const deckColor = hexToRgb(deck.color);
  const deckBg = hexToRgb(deck.bgColor);
  const deckText = hexToRgb(deck.textColor);
  const deckColorLight = lighten(deckColor, 0.88);

  // ─── HEADER BAND (dynamic height) ────────────────────────────────────────

  // Pre-measure title to determine header height
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  const titleLines = wrapText(doc, card.title, CONTENT_W - 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  const tagLines = wrapText(doc, card.tagline, CONTENT_W - 20);

  // Header height: top padding (10) + subtitle (6) + gap (4) + title lines + gap (3) + tagline lines + bottom padding (8)
  const titleBlockH = titleLines.length * 8;
  const tagBlockH = tagLines.length * 5.5;
  const headerH = 10 + 6 + 4 + titleBlockH + 3 + tagBlockH + 8;

  // Draw header background
  doc.setFillColor(...deckColor);
  doc.rect(0, 0, PAGE_W, headerH, 'F');

  // Subtle diagonal stripe pattern for depth
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.15);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doc.setGState(new (doc as any).GState({ opacity: 0.06 }));
  for (let i = -PAGE_H; i < PAGE_W + PAGE_H; i += 8) {
    doc.line(i, 0, i + PAGE_H, PAGE_H);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doc.setGState(new (doc as any).GState({ opacity: 1 }));

  // Deck subtitle (all-caps label)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.setCharSpace(2);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doc.setGState(new (doc as any).GState({ opacity: 0.7 }));
  doc.text(deck.subtitle.toUpperCase(), MARGIN, 10);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doc.setGState(new (doc as any).GState({ opacity: 1 }));
  doc.setCharSpace(0);

  // Card code badge (top-right)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  const codeText = card.code;
  const codeW = doc.getTextWidth(codeText) + 8;
  roundRect(doc, PAGE_W - MARGIN - codeW, 5.5, codeW, 7, 2, [255, 255, 255]);
  doc.setTextColor(...deckColor);
  doc.text(codeText, PAGE_W - MARGIN - codeW / 2, 10.5, { align: 'center' });

  // Card title
  let curY = 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text(titleLines, MARGIN, curY);
  curY += titleBlockH + 3;

  // Tagline
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(255, 255, 255);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doc.setGState(new (doc as any).GState({ opacity: 0.82 }));
  doc.text(tagLines, MARGIN, curY);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doc.setGState(new (doc as any).GState({ opacity: 1 }));

  const cursor = new Cursor(doc, headerH + 6);

  // ─── ILLUSTRATION ─────────────────────────────────────────────────────────

  if (illustrationUrl) {
    const imgData = await loadImageAsBase64(illustrationUrl);
    if (imgData) {
      const imgW = 44;
      const imgH = 44;
      const imgX = (PAGE_W - imgW) / 2;

      cursor.ensureSpace(imgH + 10);
      const imgY = cursor.y;

      // Soft rounded background square
      roundRect(doc, imgX - 4, imgY - 4, imgW + 8, imgH + 8, 6, deckColorLight);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      doc.setGState(new (doc as any).GState({ opacity: 0.9 }));
      try {
        doc.addImage(imgData, 'PNG', imgX, imgY, imgW, imgH);
      } catch {
        // continue without illustration
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      doc.setGState(new (doc as any).GState({ opacity: 1 }));

      cursor.y = imgY + imgH + 10;
    }
  }

  // ─── SECTION RENDERER ─────────────────────────────────────────────────────

  function drawSectionHeader(title: string, accentColor: [number, number, number]) {
    cursor.ensureSpace(14);
    // Accent pill left
    roundRect(doc, MARGIN, cursor.y - 1, 3, 6.5, 1.5, accentColor);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);
    doc.setCharSpace(0.8);
    doc.text(title.toUpperCase(), MARGIN + 6, cursor.y + 4.5);
    doc.setCharSpace(0);
    cursor.advance(10);
  }

  function drawParagraph(text: string, indent = 4) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(45, 45, 45);
    const lines = wrapText(doc, text, CONTENT_W - indent);
    for (const line of lines) {
      cursor.ensureSpace(LINE_H);
      doc.text(line, MARGIN + indent, cursor.y);
      cursor.advance(LINE_H);
    }
    cursor.advance(3);
  }

  function drawSection(
    title: string,
    body: string | string[],
    isList = false,
    accentColor: [number, number, number] = deckColor,
  ) {
    drawSectionHeader(title, accentColor);

    if (isList && Array.isArray(body)) {
      body.forEach((item, i) => {
        const lines = wrapText(doc, item, CONTENT_W - 14);
        cursor.ensureSpace(STEP_LINE_H + 3);

        // Step number circle
        doc.setFillColor(...accentColor);
        doc.circle(MARGIN + 3, cursor.y + 2, 3, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.5);
        doc.setTextColor(255, 255, 255);
        doc.text(String(i + 1), MARGIN + 3, cursor.y + 2.8, { align: 'center' });

        // First line
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(45, 45, 45);
        if (lines.length > 0) {
          doc.text(lines[0], MARGIN + 9, cursor.y + 3.5);
          cursor.advance(STEP_LINE_H + 1.5);
        }

        // Remaining lines
        for (let li = 1; li < lines.length; li++) {
          cursor.ensureSpace(STEP_LINE_H);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9.5);
          doc.setTextColor(45, 45, 45);
          doc.text(lines[li], MARGIN + 9, cursor.y);
          cursor.advance(STEP_LINE_H);
        }
        cursor.advance(2.5);
      });
    } else {
      const text = Array.isArray(body) ? body.join('\n') : body;
      drawParagraph(text);
    }
    cursor.advance(4);
  }

  // ─── BODY SECTIONS ────────────────────────────────────────────────────────

  drawSection('What It Is', card.whatItIs);
  drawSection('When To Use', card.whenToUse);

  if (card.steps.length > 0) {
    drawSection('How To Apply It', card.steps, true);
  }

  // ─── PRO TIP ──────────────────────────────────────────────────────────────

  if (card.proTip) {
    const tipLines = wrapText(doc, card.proTip, CONTENT_W - 10);
    const tipBodyH = tipLines.length * LINE_H;
    const tipTotalH = 10 + tipBodyH + 6;

    cursor.ensureSpace(tipTotalH);

    // Tip background
    roundRect(doc, MARGIN, cursor.y, CONTENT_W, tipTotalH, 3, deckColorLight);

    // Left accent bar
    doc.setFillColor(...deckColor);
    doc.roundedRect(MARGIN, cursor.y, 3, tipTotalH, 1.5, 1.5, 'F');

    // "PRO TIP" label
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...deckText);
    doc.setCharSpace(0.8);
    doc.text('PRO TIP', MARGIN + 7, cursor.y + 6.5);
    doc.setCharSpace(0);
    cursor.advance(10);

    // Tip body
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(45, 45, 45);
    for (const line of tipLines) {
      doc.text(line, MARGIN + 7, cursor.y);
      cursor.advance(LINE_H);
    }
    cursor.advance(8);
  }

  // ─── TAGS ─────────────────────────────────────────────────────────────────

  if (card.tags.length > 0) {
    cursor.ensureSpace(14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    doc.setCharSpace(0.8);
    doc.text('TAGS', MARGIN, cursor.y + 4);
    doc.setCharSpace(0);

    let tx = MARGIN + 14;
    const tagY = cursor.y;

    for (const tag of card.tags) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      const tw = doc.getTextWidth(tag) + 6;
      if (tx + tw > PAGE_W - MARGIN) {
        tx = MARGIN + 14;
        cursor.advance(7);
        cursor.ensureSpace(7);
      }
      roundRect(doc, tx, tagY + cursor.y - tagY, tw, 5.5, 1.5, deckColorLight);
      doc.setTextColor(...deckText);
      doc.text(tag, tx + tw / 2, tagY + cursor.y - tagY + 3.8, { align: 'center' });
      tx += tw + 2.5;
    }
    cursor.advance(12);
  }

  // ─── GLOSSARY TERMS ───────────────────────────────────────────────────────

  if (glossaryTerms.length > 0) {
    drawSectionHeader('Key Terms', deckColor);

    for (const term of glossaryTerms) {
      const defLines = wrapText(doc, term.definition, CONTENT_W - 10);

      cursor.ensureSpace(9);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(30, 30, 30);
      doc.text(term.term, MARGIN + 4, cursor.y);
      cursor.advance(5.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 100, 100);
      for (const line of defLines) {
        cursor.ensureSpace(4.8);
        doc.text(line, MARGIN + 6, cursor.y);
        cursor.advance(4.8);
      }
      cursor.advance(3.5);
    }
    cursor.advance(3);
  }

  // ─── CASE STUDY ───────────────────────────────────────────────────────────

  if (caseStudy) {
    doc.addPage();
    cursor.y = TOP_MARGIN;

    // Case study header band
    const csHeaderH = 28;
    doc.setFillColor(...deckColor);
    doc.rect(0, 0, PAGE_W, csHeaderH, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.setCharSpace(2);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    doc.setGState(new (doc as any).GState({ opacity: 0.7 }));
    doc.text('CASE STUDY', MARGIN, 9);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    doc.setGState(new (doc as any).GState({ opacity: 1 }));
    doc.setCharSpace(0);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(255, 255, 255);
    const orgLines = wrapText(doc, caseStudy.organisation, CONTENT_W - 30);
    doc.text(orgLines, MARGIN, 18);

    // Industry badge
    const industryW = doc.getTextWidth(caseStudy.industry) + 8;
    roundRect(doc, PAGE_W - MARGIN - industryW, 8, industryW, 7, 2, [255, 255, 255]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...deckColor);
    doc.text(caseStudy.industry, PAGE_W - MARGIN - industryW / 2, 13, { align: 'center' });

    cursor.y = csHeaderH + 8;

    // Project name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(30, 30, 30);
    const projLines = wrapText(doc, caseStudy.projectName, CONTENT_W);
    for (const line of projLines) {
      cursor.ensureSpace(6);
      doc.text(line, MARGIN, cursor.y);
      cursor.advance(6);
    }
    cursor.advance(3);

    // Meta row
    const metas: string[] = [];
    if (caseStudy.timeframe) metas.push(`Timeframe: ${caseStudy.timeframe}`);
    if (caseStudy.teamSize) metas.push(`Team: ${caseStudy.teamSize}`);
    if (metas.length > 0) {
      cursor.ensureSpace(7);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(130, 130, 130);
      doc.text(metas.join('   ·   '), MARGIN, cursor.y);
      cursor.advance(8);
    }

    const csRed: [number, number, number] = [220, 38, 38];
    const csGreen: [number, number, number] = [22, 163, 74];
    const csYellow: [number, number, number] = [202, 138, 4];

    drawSection('The Challenge', caseStudy.challenge, false, csRed);
    drawSection('How They Applied It', caseStudy.approach, false, deckColor);
    drawSection('The Outcome', caseStudy.outcome, false, csGreen);

    if (caseStudy.lessonsLearned.length > 0) {
      drawSection('Lessons Learned', caseStudy.lessonsLearned, true, csYellow);
    }

    // Quote
    if (caseStudy.quote) {
      const qLines = wrapText(doc, `"${caseStudy.quote.text}"`, CONTENT_W - 12);
      const qH = qLines.length * 5.5 + 14;

      cursor.ensureSpace(qH);

      // Quote background
      roundRect(doc, MARGIN, cursor.y, CONTENT_W, qH, 3, deckColorLight);
      doc.setFillColor(...deckColor);
      doc.roundedRect(MARGIN, cursor.y, 3, qH, 1.5, 1.5, 'F');

      cursor.advance(5);
      doc.setFont('helvetica', 'bolditalic');
      doc.setFontSize(9.5);
      doc.setTextColor(40, 40, 40);
      for (const line of qLines) {
        cursor.ensureSpace(5.5);
        doc.text(line, MARGIN + 7, cursor.y);
        cursor.advance(5.5);
      }
      cursor.ensureSpace(5);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(`— ${caseStudy.quote.attribution}`, MARGIN + 7, cursor.y);
      cursor.advance(10);
    }

    // Disclaimer
    cursor.ensureSpace(10);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(170, 170, 170);
    const disclaimerLines = wrapText(
      doc,
      'Case studies are illustrative summaries based on publicly available information. Details may be simplified for educational purposes.',
      CONTENT_W,
    );
    for (const line of disclaimerLines) {
      cursor.ensureSpace(4);
      doc.text(line, MARGIN, cursor.y);
      cursor.advance(4);
    }
  }

  // ─── FOOTER (all pages) ──────────────────────────────────────────────────

  const totalPages = doc.getNumberOfPages();

  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);

    // Footer background
    doc.setFillColor(248, 246, 242);
    doc.rect(0, PAGE_H - FOOTER_H, PAGE_W, FOOTER_H, 'F');

    // Accent line
    doc.setFillColor(...deckColor);
    doc.rect(0, PAGE_H - FOOTER_H, PAGE_W, 0.6, 'F');

    // App name + page number
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(110, 110, 110);
    doc.text('StratAlign — PM Toolkit', MARGIN, PAGE_H - FOOTER_H + 5.5);
    doc.text(`${p} / ${totalPages}`, PAGE_W - MARGIN, PAGE_H - FOOTER_H + 5.5, { align: 'right' });

    // Card reference + disclaimer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(155, 155, 155);
    doc.text('For educational and reference purposes only.', MARGIN, PAGE_H - FOOTER_H + 10.5);
    doc.text(`${card.code} · ${card.title}`, PAGE_W - MARGIN, PAGE_H - FOOTER_H + 10.5, { align: 'right' });
  }

  // ─── SAVE ─────────────────────────────────────────────────────────────────

  const filename = `${card.code}-${card.title.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase()}.pdf`;
  doc.save(filename);
}
