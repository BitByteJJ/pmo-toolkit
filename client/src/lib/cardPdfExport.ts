// cardPdfExport.ts
// Generates a full-page A4 PDF for a single PMO card using jsPDF.
// Includes: card illustration, header, tagline, What It Is, When To Use, Steps,
//           Pro Tip, Tags, Glossary Terms, Case Study, and educational disclaimer.
// All text is properly paginated — no content overflows page boundaries.

import jsPDF from 'jspdf';
import type { PMOCard, Deck } from './pmoData';
import type { CaseStudy } from './caseStudiesData';
import type { GlossaryTerm } from './glossaryData';

// ─── constants ───────────────────────────────────────────────────────────────

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 14;
const CONTENT_W = PAGE_W - MARGIN * 2;
const FOOTER_H = 18; // space reserved for footer
const BODY_BOTTOM = PAGE_H - FOOTER_H; // max Y before footer
const TOP_MARGIN = 14; // Y start on continuation pages
const LINE_H = 4.8; // line height for body text (9pt)
const STEP_LINE_H = 4.8;

// ─── helpers ─────────────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
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

  /** Check if we have enough room; if not, add a new page and reset Y */
  ensureSpace(needed: number) {
    if (this.y + needed > BODY_BOTTOM) {
      this.doc.addPage();
      this.y = TOP_MARGIN;
    }
  }

  /** Write wrapped lines one at a time, breaking pages as needed */
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

  // ─── HEADER BAND (page 1 only) ───────────────────────────────────────────
  const headerH = 38;
  doc.setFillColor(...deckColor);
  doc.rect(0, 0, PAGE_W, headerH, 'F');

  // Deck subtitle
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.setCharSpace(1.5);
  doc.text(deck.subtitle.toUpperCase(), MARGIN, 10);
  doc.setCharSpace(0);

  // Card code badge
  const codeW = doc.getTextWidth(card.code) + 6;
  roundRect(doc, PAGE_W - MARGIN - codeW, 6, codeW, 6, 1.5, [255, 255, 255]);
  doc.setFontSize(7);
  doc.setTextColor(...deckColor);
  doc.setFont('helvetica', 'bold');
  doc.text(card.code, PAGE_W - MARGIN - codeW / 2, 10.2, { align: 'center' });

  // Card title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  const titleLines = wrapText(doc, card.title, CONTENT_W);
  doc.text(titleLines, MARGIN, 20);
  let headerY = 20 + titleLines.length * 7;

  // Tagline
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doc.setGState(new (doc as any).GState({ opacity: 0.85 }));
  const tagLines = wrapText(doc, card.tagline, CONTENT_W);
  doc.text(tagLines, MARGIN, headerY);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doc.setGState(new (doc as any).GState({ opacity: 1 }));

  const cursor = new Cursor(doc, headerH + 4);

  // ─── ILLUSTRATION ─────────────────────────────────────────────────────────
  if (illustrationUrl) {
    const imgData = await loadImageAsBase64(illustrationUrl);
    if (imgData) {
      const imgW = 50;
      const imgH = 50;
      const imgX = (PAGE_W - imgW) / 2;

      cursor.ensureSpace(imgH + 8);
      const imgY = cursor.y;

      // Background circle
      doc.setFillColor(
        Math.min(deckBg[0] + 5, 255),
        Math.min(deckBg[1] + 5, 255),
        Math.min(deckBg[2] + 5, 255),
      );
      doc.circle(imgX + imgW / 2, imgY + imgH / 2, imgW / 2 + 2, 'F');

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      doc.setGState(new (doc as any).GState({ opacity: 0.85 }));
      try {
        doc.addImage(imgData, 'PNG', imgX, imgY, imgW, imgH);
      } catch {
        // continue without illustration
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      doc.setGState(new (doc as any).GState({ opacity: 1 }));

      cursor.y = imgY + imgH + 6;
    }
  }

  // ─── SECTION RENDERER (page-break aware) ──────────────────────────────────

  function drawSectionHeader(
    title: string,
    accentColor: [number, number, number],
  ) {
    cursor.ensureSpace(12); // need room for header + at least one line
    doc.setFillColor(...accentColor);
    doc.rect(MARGIN, cursor.y, 2.5, 5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(80, 80, 80);
    doc.setCharSpace(1);
    doc.text(title.toUpperCase(), MARGIN + 5, cursor.y + 4);
    doc.setCharSpace(0);
    cursor.advance(8);
  }

  function drawParagraph(text: string) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(40, 40, 40);
    const lines = wrapText(doc, text, CONTENT_W - 4);
    for (const line of lines) {
      cursor.ensureSpace(LINE_H);
      doc.text(line, MARGIN + 4, cursor.y);
      cursor.advance(LINE_H);
    }
    cursor.advance(4);
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
        const lines = wrapText(doc, item, CONTENT_W - 12);
        // Need room for at least the step circle + first line
        cursor.ensureSpace(STEP_LINE_H + 2);

        // Step number circle
        doc.setFillColor(...accentColor);
        doc.circle(MARGIN + 2.5, cursor.y + 2, 2.5, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.5);
        doc.setTextColor(255, 255, 255);
        doc.text(String(i + 1), MARGIN + 2.5, cursor.y + 2.7, { align: 'center' });

        // First line next to circle
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(40, 40, 40);
        if (lines.length > 0) {
          doc.text(lines[0], MARGIN + 8, cursor.y + 3.5);
          cursor.advance(STEP_LINE_H + 1);
        }

        // Remaining lines (page-break aware)
        for (let li = 1; li < lines.length; li++) {
          cursor.ensureSpace(STEP_LINE_H);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(40, 40, 40);
          doc.text(lines[li], MARGIN + 8, cursor.y);
          cursor.advance(STEP_LINE_H);
        }
        cursor.advance(2);
      });
    } else {
      const text = Array.isArray(body) ? body.join('\n') : body;
      drawParagraph(text);
    }
    cursor.advance(3);
  }

  // ─── BODY SECTIONS ────────────────────────────────────────────────────────

  drawSection('What It Is', card.whatItIs);
  drawSection('When To Use', card.whenToUse);

  if (card.steps.length > 0) {
    drawSection('How To Apply It', card.steps, true);
  }

  // Pro Tip
  if (card.proTip) {
    const tipLines = wrapText(doc, card.proTip, CONTENT_W - 14);
    // Render tip line by line with page breaks
    cursor.ensureSpace(12); // header + at least one line
    const tipBgColor: [number, number, number] = [
      Math.min(deckBg[0], 240),
      Math.min(deckBg[1], 240),
      Math.min(deckBg[2], 240),
    ];

    // Draw tip header
    roundRect(doc, MARGIN, cursor.y, CONTENT_W, 7, 3, tipBgColor);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...deckText);
    doc.setCharSpace(0.8);
    doc.text('PRO TIP', MARGIN + 5, cursor.y + 5);
    doc.setCharSpace(0);
    cursor.advance(8);

    // Tip body lines
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(40, 40, 40);
    for (const line of tipLines) {
      cursor.ensureSpace(LINE_H);
      doc.text(line, MARGIN + 5, cursor.y);
      cursor.advance(LINE_H);
    }
    cursor.advance(6);
  }

  // Tags
  if (card.tags.length > 0) {
    cursor.ensureSpace(12);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(80, 80, 80);
    doc.setCharSpace(1);
    doc.text('TAGS', MARGIN, cursor.y + 4);
    doc.setCharSpace(0);
    let tx = MARGIN + 12;
    for (const tag of card.tags) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      const tw = doc.getTextWidth(tag) + 5;
      if (tx + tw > PAGE_W - MARGIN) {
        tx = MARGIN;
        cursor.advance(7);
        cursor.ensureSpace(7);
      }
      roundRect(doc, tx, cursor.y, tw, 5.5, 1.5, deckBg);
      doc.setTextColor(...deckText);
      doc.text(tag, tx + tw / 2, cursor.y + 3.8, { align: 'center' });
      tx += tw + 2;
    }
    cursor.advance(12);
  }

  // ─── GLOSSARY TERMS ───────────────────────────────────────────────────────
  if (glossaryTerms.length > 0) {
    drawSectionHeader('Glossary Terms', deckColor);

    for (const term of glossaryTerms) {
      const defLines = wrapText(doc, term.definition, CONTENT_W - 8);

      // Term name
      cursor.ensureSpace(8);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(30, 30, 30);
      doc.text(`• ${term.term}`, MARGIN + 4, cursor.y);
      cursor.advance(5);

      // Definition lines (page-break aware)
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(90, 90, 90);
      for (const line of defLines) {
        cursor.ensureSpace(4.5);
        doc.text(line, MARGIN + 8, cursor.y);
        cursor.advance(4.5);
      }
      cursor.advance(3);
    }
    cursor.advance(3);
  }

  // ─── CASE STUDY ───────────────────────────────────────────────────────────
  if (caseStudy) {
    doc.addPage();
    cursor.y = TOP_MARGIN;

    // Case study header band
    doc.setFillColor(...deckColor);
    doc.rect(0, 0, PAGE_W, 22, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.setCharSpace(1.5);
    doc.text('CASE STUDY', MARGIN, 8);
    doc.setCharSpace(0);
    doc.setFontSize(14);
    doc.text(caseStudy.organisation, MARGIN, 16);

    // Industry badge
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    const industryW = doc.getTextWidth(caseStudy.industry) + 6;
    roundRect(doc, PAGE_W - MARGIN - industryW, 8, industryW, 6, 1.5, [255, 255, 255]);
    doc.setTextColor(...deckColor);
    doc.text(caseStudy.industry, PAGE_W - MARGIN - industryW / 2, 12.2, { align: 'center' });
    cursor.y = 30;

    // Project name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 30, 30);
    const projLines = wrapText(doc, caseStudy.projectName, CONTENT_W);
    for (const line of projLines) {
      cursor.ensureSpace(5.5);
      doc.text(line, MARGIN, cursor.y);
      cursor.advance(5.5);
    }
    cursor.advance(4);

    // Meta row
    const metas: string[] = [];
    if (caseStudy.timeframe) metas.push(`Timeframe: ${caseStudy.timeframe}`);
    if (caseStudy.teamSize) metas.push(`Team: ${caseStudy.teamSize}`);
    if (metas.length > 0) {
      cursor.ensureSpace(7);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(metas.join('   ·   '), MARGIN, cursor.y);
      cursor.advance(7);
    }

    const csRed: [number, number, number] = [239, 68, 68];
    const csGreen: [number, number, number] = [34, 197, 94];
    const csYellow: [number, number, number] = [234, 179, 8];

    drawSection('The Challenge', caseStudy.challenge, false, csRed);
    drawSection('How They Applied It', caseStudy.approach, false, deckColor);
    drawSection('The Outcome', caseStudy.outcome, false, csGreen);

    if (caseStudy.lessonsLearned.length > 0) {
      drawSection('Lessons Learned', caseStudy.lessonsLearned, true, csYellow);
    }

    // Quote
    if (caseStudy.quote) {
      const qLines = wrapText(doc, `"${caseStudy.quote.text}"`, CONTENT_W - 14);

      cursor.ensureSpace(14); // room for at least the quote start
      // Accent bar
      doc.setFillColor(...deckColor);
      doc.rect(MARGIN, cursor.y, 2.5, 4, 'F');

      doc.setFont('helvetica', 'bolditalic');
      doc.setFontSize(9);
      doc.setTextColor(40, 40, 40);
      for (const line of qLines) {
        cursor.ensureSpace(5.5);
        doc.text(line, MARGIN + 7, cursor.y);
        cursor.advance(5.5);
      }
      cursor.ensureSpace(5);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(120, 120, 120);
      doc.text(`— ${caseStudy.quote.attribution}`, MARGIN + 7, cursor.y);
      cursor.advance(8);
    }

    // Case study disclaimer
    cursor.ensureSpace(10);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(160, 160, 160);
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
    doc.setFillColor(245, 243, 238);
    doc.rect(0, PAGE_H - FOOTER_H, PAGE_W, FOOTER_H, 'F');

    // Accent line
    doc.setDrawColor(...deckColor);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, PAGE_H - FOOTER_H, PAGE_W - MARGIN, PAGE_H - FOOTER_H);

    // Row 1: app name + page number
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text('StratAlign — PM Toolkit', MARGIN, PAGE_H - FOOTER_H + 5);
    doc.text(`Page ${p} of ${totalPages}`, PAGE_W - MARGIN, PAGE_H - FOOTER_H + 5, { align: 'right' });

    // Row 2: educational purpose + card ref
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(150, 150, 150);
    doc.text('For educational and reference purposes only.', MARGIN, PAGE_H - FOOTER_H + 10);
    doc.text(`${card.code} · ${card.title}`, PAGE_W - MARGIN, PAGE_H - FOOTER_H + 10, { align: 'right' });

    // Row 3: IP disclaimer
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(5.5);
    doc.setTextColor(175, 175, 175);
    doc.text(
      'All referenced frameworks, models, and methodologies are the intellectual property of their respective owners. This app is an educational reference tool only.',
      MARGIN,
      PAGE_H - FOOTER_H + 14,
      { maxWidth: CONTENT_W },
    );
  }

  // ─── SAVE ─────────────────────────────────────────────────────────────────
  const filename = `${card.code}-${card.title.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase()}.pdf`;
  doc.save(filename);
}
