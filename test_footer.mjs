import { Document, Packer, Paragraph, TextRun, Footer, PageNumber, AlignmentType, BorderStyle } from 'docx';
import { writeFileSync } from 'fs';

console.log('PageNumber:', PageNumber);
console.log('PageNumber.CURRENT:', PageNumber.CURRENT);
console.log('PageNumber.TOTAL_PAGES:', PageNumber.TOTAL_PAGES);

const doc = new Document({
  sections: [{
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: 'Copyright 2025 PMO Toolkit   |   Page ', size: 14, color: '94A3B8' }),
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
    children: [
      new Paragraph({ children: [new TextRun({ text: 'Test document with footer', size: 24 })] }),
    ],
  }],
});

const buffer = await Packer.toBuffer(doc);
writeFileSync('/home/ubuntu/Downloads/test_footer.docx', buffer);
console.log('Written /home/ubuntu/Downloads/test_footer.docx');
