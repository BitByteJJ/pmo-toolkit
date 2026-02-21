// cardPdfExport.ts
// Generates a full-page A4 PDF for a single PMO card using jsPDF.
// Includes: card illustration, header, tagline, What It Is, When To Use, Steps,
//           Pro Tip, Glossary Terms, Case Study, copyright, and author credit.

import jsPDF from 'jspdf';
import type { PMOCard, Deck } from './pmoData';
import type { CaseStudy } from './caseStudiesData';
import type { GlossaryTerm } from './glossaryData';

// ─── helpers ──────────────────────────────────────────────────────────────────

/** Convert a CSS hex colour (#rrggbb) to [r, g, b] 0-255 */
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Wrap text to fit within maxWidth, return array of lines */
function wrapText(doc: jsPDF, text: string, maxWidth: number): string[] {
  return doc.splitTextToSize(text, maxWidth) as string[];
}

/** Draw a filled rounded rectangle */
function roundRect(
  doc: jsPDF,
  x: number, y: number, w: number, h: number,
  r: number,
  fillColor: [number, number, number],
) {
  doc.setFillColor(...fillColor);
  doc.roundedRect(x, y, w, h, r, r, 'F');
}

/** Load an image from URL and return as base64 data URL */
async function loadImageAsBase64(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
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

// ─── main export ──────────────────────────────────────────────────────────────

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

  const pageW = 210;
  const pageH = 297;
  const margin = 14;
  const contentW = pageW - margin * 2;
  const footerH = 16; // space reserved for footer

  const deckColor = hexToRgb(deck.color);
  const deckBg = hexToRgb(deck.bgColor);
  const deckText = hexToRgb(deck.textColor);

  let y = 0; // current Y cursor

  // ─── HEADER BAND ──────────────────────────────────────────────────────────
  const headerH = 38;
  doc.setFillColor(...deckColor);
  doc.rect(0, 0, pageW, headerH, 'F');

  // Deck subtitle (small caps)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.setCharSpace(1.5);
  doc.text(deck.subtitle.toUpperCase(), margin, 10);
  doc.setCharSpace(0);

  // Card code badge
  const codeW = doc.getTextWidth(card.code) + 6;
  roundRect(doc, pageW - margin - codeW, 6, codeW, 6, 1.5, [255, 255, 255]);
  doc.setFontSize(7);
  doc.setTextColor(...deckColor);
  doc.setFont('helvetica', 'bold');
  doc.text(card.code, pageW - margin - codeW / 2, 10.2, { align: 'center' });

  // Card title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  const titleLines = wrapText(doc, card.title, contentW);
  doc.text(titleLines, margin, 20);
  y = 20 + titleLines.length * 7;

  // Tagline
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doc.setGState(new (doc as any).GState({ opacity: 0.85 }));
  const tagLines = wrapText(doc, card.tagline, contentW);
  doc.text(tagLines, margin, y);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doc.setGState(new (doc as any).GState({ opacity: 1 }));
  y = headerH + 4;

  // ─── ILLUSTRATION ─────────────────────────────────────────────────────────
  if (illustrationUrl) {
    const imgData = await loadImageAsBase64(illustrationUrl);
    if (imgData) {
      const imgW = 50; // mm width
      const imgH = 50; // mm height (square)
      const imgX = (pageW - imgW) / 2; // centered
      const imgY = y;

      // Light background circle behind illustration
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
        // If image fails to embed, continue without it
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      doc.setGState(new (doc as any).GState({ opacity: 1 }));

      y = imgY + imgH + 6;
    }
  }

  // ─── BODY ─────────────────────────────────────────────────────────────────

  function drawSection(
    title: string,
    body: string | string[],
    isList = false,
    accentColor: [number, number, number] = deckColor,
  ) {
    // Check if we need a new page
    const estimatedH = isList
      ? (Array.isArray(body) ? body.length : 1) * 7 + 14
      : wrapText(doc, Array.isArray(body) ? body.join(' ') : body, contentW - 6).length * 5 + 14;

    if (y + estimatedH > pageH - footerH) {
      doc.addPage();
      y = 14;
    }

    // Section header row
    doc.setFillColor(...accentColor);
    doc.rect(margin, y, 2.5, 5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(80, 80, 80);
    doc.setCharSpace(1);
    doc.text(title.toUpperCase(), margin + 5, y + 4);
    doc.setCharSpace(0);
    y += 8;

    if (isList && Array.isArray(body)) {
      body.forEach((item, i) => {
        const lines = wrapText(doc, item, contentW - 10);
        if (y + lines.length * 5 > pageH - footerH) {
          doc.addPage();
          y = 14;
        }
        // Step number circle
        doc.setFillColor(...accentColor);
        doc.circle(margin + 2.5, y + 2, 2.5, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.5);
        doc.setTextColor(255, 255, 255);
        doc.text(String(i + 1), margin + 2.5, y + 2.7, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(40, 40, 40);
        doc.text(lines, margin + 8, y + 3.5);
        y += lines.length * 5 + 2;
      });
    } else {
      const text = Array.isArray(body) ? body.join('\n') : body;
      const lines = wrapText(doc, text, contentW - 4);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(40, 40, 40);
      doc.text(lines, margin + 4, y);
      y += lines.length * 5 + 2;
    }
    y += 5; // spacing between sections
  }

  // What It Is
  drawSection('What It Is', card.whatItIs);

  // When To Use
  drawSection('When To Use', card.whenToUse);

  // Steps
  if (card.steps.length > 0) {
    drawSection('How To Apply It', card.steps, true);
  }

  // Pro Tip
  if (card.proTip) {
    const tipLines = wrapText(doc, card.proTip, contentW - 12);
    const tipH = tipLines.length * 5 + 10;
    if (y + tipH > pageH - footerH) { doc.addPage(); y = 14; }
    roundRect(doc, margin, y, contentW, tipH, 3, [
      Math.min(deckBg[0], 240),
      Math.min(deckBg[1], 240),
      Math.min(deckBg[2], 240),
    ]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...deckText);
    doc.setCharSpace(0.8);
    doc.text('PRO TIP', margin + 5, y + 5.5);
    doc.setCharSpace(0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(40, 40, 40);
    doc.text(tipLines, margin + 5, y + 10);
    y += tipH + 6;
  }

  // Tags
  if (card.tags.length > 0) {
    if (y + 12 > pageH - footerH) { doc.addPage(); y = 14; }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(80, 80, 80);
    doc.setCharSpace(1);
    doc.text('TAGS', margin, y + 4);
    doc.setCharSpace(0);
    let tx = margin + 12;
    card.tags.forEach(tag => {
      const tw = doc.getTextWidth(tag) + 5;
      if (tx + tw > pageW - margin) { tx = margin; y += 7; }
      roundRect(doc, tx, y, tw, 5.5, 1.5, deckBg);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...deckText);
      doc.text(tag, tx + tw / 2, y + 3.8, { align: 'center' });
      tx += tw + 2;
    });
    y += 12;
  }

  // ─── GLOSSARY TERMS ───────────────────────────────────────────────────────
  if (glossaryTerms.length > 0) {
    if (y + 20 > pageH - footerH) { doc.addPage(); y = 14; }

    doc.setFillColor(...deckColor);
    doc.rect(margin, y, 2.5, 5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(80, 80, 80);
    doc.setCharSpace(1);
    doc.text('GLOSSARY TERMS', margin + 5, y + 4);
    doc.setCharSpace(0);
    y += 9;

    glossaryTerms.forEach(term => {
      const defLines = wrapText(doc, term.definition, contentW - 4);
      const blockH = defLines.length * 4.5 + 9;
      if (y + blockH > pageH - footerH) { doc.addPage(); y = 14; }

      roundRect(doc, margin, y, contentW, blockH, 2.5, [247, 245, 240]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(30, 30, 30);
      doc.text(term.term, margin + 4, y + 5.5);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(90, 90, 90);
      doc.text(defLines, margin + 4, y + 10);
      y += blockH + 3;
    });
    y += 3;
  }

  // ─── CASE STUDY ───────────────────────────────────────────────────────────
  if (caseStudy) {
    doc.addPage();
    y = 14;

    // Case study header band
    doc.setFillColor(...deckColor);
    doc.rect(0, 0, pageW, 22, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.setCharSpace(1.5);
    doc.text('CASE STUDY', margin, 8);
    doc.setCharSpace(0);
    doc.setFontSize(14);
    doc.text(caseStudy.organisation, margin, 16);
    const industryW = doc.getTextWidth(caseStudy.industry) + 6;
    roundRect(doc, pageW - margin - industryW, 8, industryW, 6, 1.5, [255, 255, 255]);
    doc.setFontSize(7.5);
    doc.setTextColor(...deckColor);
    doc.text(caseStudy.industry, pageW - margin - industryW / 2, 12.2, { align: 'center' });
    y = 30;

    // Project name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 30, 30);
    const projLines = wrapText(doc, caseStudy.projectName, contentW);
    doc.text(projLines, margin, y);
    y += projLines.length * 5.5 + 4;

    // Meta row
    const metas: string[] = [];
    if (caseStudy.timeframe) metas.push(`Timeframe: ${caseStudy.timeframe}`);
    if (caseStudy.teamSize) metas.push(`Team: ${caseStudy.teamSize}`);
    if (metas.length > 0) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(metas.join('   ·   '), margin, y);
      y += 7;
    }

    const csColor: [number, number, number] = [239, 68, 68];
    drawSection('The Challenge', caseStudy.challenge, false, csColor);
    drawSection('How They Applied It', caseStudy.approach, false, deckColor);
    drawSection('The Outcome', caseStudy.outcome, false, [34, 197, 94]);

    if (caseStudy.lessonsLearned.length > 0) {
      drawSection('Lessons Learned', caseStudy.lessonsLearned, true, [234, 179, 8]);
    }

    // Quote
    if (caseStudy.quote) {
      const qLines = wrapText(doc, `"${caseStudy.quote.text}"`, contentW - 12);
      const qH = qLines.length * 5.5 + 14;
      if (y + qH > pageH - footerH) { doc.addPage(); y = 14; }
      roundRect(doc, margin, y, contentW, qH, 3, [247, 245, 240]);
      doc.setFillColor(...deckColor);
      doc.rect(margin, y, 2.5, qH, 'F');
      doc.setFont('helvetica', 'bolditalic');
      doc.setFontSize(9);
      doc.setTextColor(40, 40, 40);
      doc.text(qLines, margin + 7, y + 7);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(120, 120, 120);
      doc.text(`— ${caseStudy.quote.attribution}`, margin + 7, y + qH - 4);
      y += qH + 6;
    }

    // Case study disclaimer
    if (y + 10 > pageH - footerH) { doc.addPage(); y = 14; }
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(160, 160, 160);
    doc.text(
      'Case studies are illustrative summaries based on publicly available information. Details may be simplified for educational purposes.',
      margin, y, { maxWidth: contentW },
    );
  }

  // ─── FOOTER (all pages) — includes author credit + copyright ─────────────
  const totalPages = doc.getNumberOfPages();
  const currentYear = new Date().getFullYear();

  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);

    // Footer background
    doc.setFillColor(245, 243, 238);
    doc.rect(0, pageH - footerH, pageW, footerH, 'F');

    // Thin accent line at top of footer
    doc.setDrawColor(...deckColor);
    doc.setLineWidth(0.3);
    doc.line(margin, pageH - footerH, pageW - margin, pageH - footerH);

    // Top row: author credit + page number
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text('Jackson Joy · February 2026', margin, pageH - footerH + 5);
    doc.text(`Page ${p} of ${totalPages}`, pageW - margin, pageH - footerH + 5, { align: 'right' });

    // Bottom row: copyright + card reference
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `© ${currentYear} StratAlign — PM Toolkit. All rights reserved. For personal and educational use only.`,
      margin,
      pageH - footerH + 10,
    );
    doc.text(`${card.code} · ${card.title}`, pageW - margin, pageH - footerH + 10, { align: 'right' });

    // Bottom-most row: IP notice
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(5.5);
    doc.setTextColor(175, 175, 175);
    doc.text(
      'This content is the intellectual property of Jackson Joy. Reproduction or redistribution without permission is prohibited.',
      margin,
      pageH - footerH + 14,
    );
  }

  // ─── SAVE ─────────────────────────────────────────────────────────────────
  const filename = `${card.code}-${card.title.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase()}.pdf`;
  doc.save(filename);
}
