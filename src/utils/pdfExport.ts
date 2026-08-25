import { jsPDF } from 'jspdf';
import { FOCUS_DNA_SLIDES, SlideData } from '../data/presentationSlides';

export interface PdfExportOptions {
  includeSpeakerNotes?: boolean;
  theme?: 'clean-light' | 'monochrome';
  slides?: number[]; // indices of slides to export, default all
  format?: 'landscape-16-9' | 'a4-handout';
  onProgress?: (current: number, total: number, message: string) => void;
}

export async function exportPresentationToPdf(options: PdfExportOptions = {}): Promise<void> {
  const {
    includeSpeakerNotes = true,
    theme = 'clean-light',
    slides = FOCUS_DNA_SLIDES.map((_, i) => i),
    format = 'landscape-16-9',
    onProgress,
  } = options;

  const totalSlidesToRender = slides.length;

  // 16:9 Landscape dimensions in mm: 280mm x 157.5mm (or A4 Landscape: 297 x 210)
  const is169 = format === 'landscape-16-9';
  const pageWidth = is169 ? 280 : 297;
  const pageHeight = is169 ? 157.5 : 210;

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [pageWidth, pageHeight],
    compress: true,
  });

  for (let i = 0; i < totalSlidesToRender; i++) {
    const slideIdx = slides[i];
    const slide = FOCUS_DNA_SLIDES[slideIdx];

    if (onProgress) {
      onProgress(i + 1, totalSlidesToRender, `Rendering Slide ${slide.slideNumber}: ${slide.title}`);
    }

    if (i > 0) {
      doc.addPage([pageWidth, pageHeight], 'landscape');
    }

    // Render Slide Background & Framing
    renderSlideBackground(doc, pageWidth, pageHeight, theme);

    // Render Slide Header (Category Badge, App Name, Slide Counter)
    renderSlideHeader(doc, slide, pageWidth, i + 1, totalSlidesToRender, theme);

    // Render Title & Subtitle
    const contentTopY = renderSlideTitle(doc, slide, pageWidth, theme);

    // Render Body according to slide layout
    renderSlideBody(doc, slide, pageWidth, pageHeight, contentTopY, theme, includeSpeakerNotes);

    // Render Footer
    renderSlideFooter(doc, slide, pageWidth, pageHeight, i + 1, totalSlidesToRender, theme);

    // Small delay to allow UI state progress updates to be smooth
    await new Promise((resolve) => setTimeout(resolve, 30));
  }

  if (onProgress) {
    onProgress(totalSlidesToRender, totalSlidesToRender, 'Packaging & Saving PDF...');
  }

  // Save the document
  const fileName = `FocusDNA_Presentation_Deck_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}

function renderSlideBackground(
  doc: jsPDF,
  width: number,
  height: number,
  theme: 'clean-light' | 'monochrome'
) {
  // Pure crisp white slide background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, width, height, 'F');

  // Subtle outer aesthetic boundary / neat frame
  doc.setDrawColor(228, 228, 231); // zinc-200
  doc.setLineWidth(0.4);
  doc.roundedRect(8, 8, width - 16, height - 16, 3, 3, 'S');

  // Top header accent line
  doc.setDrawColor(79, 70, 229); // Indigo 600
  doc.setLineWidth(1.2);
  doc.line(14, 8, 38, 8);
}

function renderSlideHeader(
  doc: jsPDF,
  slide: SlideData,
  pageWidth: number,
  currentNum: number,
  totalNum: number,
  theme: string
) {
  const y = 16;

  // Category Tag Badge
  doc.setFillColor(244, 244, 245); // zinc-100
  doc.setDrawColor(212, 212, 216); // zinc-300
  doc.setLineWidth(0.3);
  doc.roundedRect(14, y - 4, 52, 6.5, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(39, 39, 42); // zinc-800
  doc.text(slide.category, 17, y + 0.5);

  // App Identity & Slide Number
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(113, 113, 122); // zinc-500
  doc.text(`FocusDNA Attention Architecture`, 72, y + 0.5);

  // Right slide count
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(79, 70, 229); // indigo-600
  doc.text(`SLIDE ${slide.slideNumber} / ${String(totalNum).padStart(2, '0')}`, pageWidth - 14, y + 0.5, {
    align: 'right',
  });

  // Divider line
  doc.setDrawColor(240, 240, 242);
  doc.setLineWidth(0.3);
  doc.line(14, y + 4.5, pageWidth - 14, y + 4.5);
}

function renderSlideTitle(
  doc: jsPDF,
  slide: SlideData,
  pageWidth: number,
  theme: string
): number {
  const startY = 27;

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(9, 9, 11); // zinc-950
  doc.text(slide.title, 14, startY);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(82, 82, 91); // zinc-600
  const splitSubtitle = doc.splitTextToSize(slide.subtitle, pageWidth - 28);
  doc.text(splitSubtitle, 14, startY + 6);

  return startY + 6 + splitSubtitle.length * 4.5 + 4;
}

function renderSlideBody(
  doc: jsPDF,
  slide: SlideData,
  pageWidth: number,
  pageHeight: number,
  startY: number,
  theme: string,
  includeSpeakerNotes: boolean
) {
  const contentWidth = pageWidth - 28;
  let currentY = startY;

  switch (slide.layout) {
    case 'hero': {
      // 3 Top Metric Highlight Cards
      if (slide.metrics) {
        const cardWidth = (contentWidth - 8) / 3;
        const cardHeight = 25;

        slide.metrics.forEach((m, idx) => {
          const cardX = 14 + idx * (cardWidth + 4);
          doc.setFillColor(249, 250, 251);
          doc.setDrawColor(228, 228, 231);
          doc.setLineWidth(0.3);
          doc.roundedRect(cardX, currentY, cardWidth, cardHeight, 2, 2, 'FD');

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(15);
          doc.setTextColor(79, 70, 229); // Indigo
          doc.text(m.value, cardX + 4, currentY + 7);

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7.5);
          doc.setTextColor(24, 24, 27);
          doc.text(m.label.toUpperCase(), cardX + 4, currentY + 13);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7);
          doc.setTextColor(113, 113, 122);
          const descLines = doc.splitTextToSize(m.description, cardWidth - 8);
          doc.text(descLines, cardX + 4, currentY + 18);
        });

        currentY += cardHeight + 5;
      }

      // 3 Bottom Feature Bullet Cards
      if (slide.bullets) {
        const cardWidth = (contentWidth - 8) / 3;
        const cardHeight = 30;

        slide.bullets.forEach((b, idx) => {
          const cardX = 14 + idx * (cardWidth + 4);
          doc.setFillColor(255, 255, 255);
          doc.setDrawColor(228, 228, 231);
          doc.setLineWidth(0.3);
          doc.roundedRect(cardX, currentY, cardWidth, cardHeight, 2, 2, 'FD');

          if (b.tag) {
            doc.setFillColor(238, 242, 255);
            doc.roundedRect(cardX + 4, currentY + 4, 30, 4.5, 1, 1, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(6.5);
            doc.setTextColor(67, 56, 202);
            doc.text(b.tag.toUpperCase(), cardX + 6, currentY + 7.2);
          }

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8.5);
          doc.setTextColor(9, 9, 11);
          doc.text(b.title, cardX + 4, currentY + 13.5);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.5);
          doc.setTextColor(82, 82, 91);
          const lines = doc.splitTextToSize(b.description, cardWidth - 8);
          doc.text(lines, cardX + 4, currentY + 18.5);
        });
      }
      break;
    }

    case 'comparison': {
      if (slide.comparison) {
        const colWidth = (contentWidth - 6) / 2;
        const colHeight = 62;

        // Left: Traditional Pomodoro
        const leftX = 14;
        doc.setFillColor(254, 242, 242); // Rose-50
        doc.setDrawColor(254, 205, 211); // Rose-200
        doc.roundedRect(leftX, currentY, colWidth, colHeight, 2.5, 2.5, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(159, 18, 57); // Rose-900
        doc.text(slide.comparison.leftTitle, leftX + 5, currentY + 8);

        doc.setFillColor(254, 226, 226);
        doc.roundedRect(leftX + colWidth - 28, currentY + 4, 23, 5, 1, 1, 'F');
        doc.setFontSize(6.5);
        doc.setTextColor(190, 18, 60);
        doc.text(slide.comparison.leftBadge, leftX + colWidth - 26, currentY + 7.5);

        let ptY = currentY + 15;
        slide.comparison.leftPoints.forEach((pt) => {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.setTextColor(225, 29, 72);
          doc.text('✕', leftX + 5, ptY);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.5);
          doc.setTextColor(136, 19, 55);
          const lines = doc.splitTextToSize(pt, colWidth - 14);
          doc.text(lines, leftX + 10, ptY);
          ptY += lines.length * 3.8 + 2;
        });

        // Right: FocusDNA
        const rightX = 14 + colWidth + 6;
        doc.setFillColor(240, 253, 244); // Emerald-50
        doc.setDrawColor(187, 247, 208); // Emerald-200
        doc.roundedRect(rightX, currentY, colWidth, colHeight, 2.5, 2.5, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(6, 95, 70); // Emerald-800
        doc.text(slide.comparison.rightTitle, rightX + 5, currentY + 8);

        doc.setFillColor(209, 250, 229);
        doc.roundedRect(rightX + colWidth - 36, currentY + 4, 31, 5, 1, 1, 'F');
        doc.setFontSize(6.5);
        doc.setTextColor(4, 120, 87);
        doc.text(slide.comparison.rightBadge, rightX + colWidth - 34, currentY + 7.5);

        let rptY = currentY + 15;
        slide.comparison.rightPoints.forEach((pt) => {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.setTextColor(5, 150, 105);
          doc.text('✓', rightX + 5, rptY);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.5);
          doc.setTextColor(6, 78, 59);
          const lines = doc.splitTextToSize(pt, colWidth - 14);
          doc.text(lines, rightX + 10, rptY);
          rptY += lines.length * 3.8 + 2;
        });
      }
      break;
    }

    case 'three-card':
    case 'circadian': {
      if (slide.cards) {
        const cardWidth = (contentWidth - 8) / 3;
        const cardHeight = 60;

        slide.cards.forEach((c, idx) => {
          const cardX = 14 + idx * (cardWidth + 4);
          doc.setFillColor(249, 250, 251);
          doc.setDrawColor(228, 228, 231);
          doc.setLineWidth(0.3);
          doc.roundedRect(cardX, currentY, cardWidth, cardHeight, 2.5, 2.5, 'FD');

          // Accent Tag
          if (c.accent) {
            doc.setFillColor(238, 242, 255);
            doc.roundedRect(cardX + 4, currentY + 4.5, 34, 4.5, 1, 1, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(6.5);
            doc.setTextColor(67, 56, 202);
            doc.text(c.accent.toUpperCase(), cardX + 6, currentY + 7.8);
          }

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(17, 24, 39);
          doc.text(c.title, cardX + 4, currentY + 14.5);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.5);
          doc.setTextColor(75, 85, 99);
          const lines = doc.splitTextToSize(c.desc, cardWidth - 8);
          doc.text(lines, cardX + 4, currentY + 20);

          if (c.subtext) {
            doc.setDrawColor(229, 231, 235);
            doc.setLineWidth(0.2);
            doc.line(cardX + 4, currentY + cardHeight - 10, cardX + cardWidth - 4, currentY + cardHeight - 10);

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7);
            doc.setTextColor(79, 70, 229);
            doc.text(c.subtext, cardX + 4, currentY + cardHeight - 5);
          }
        });
      }
      break;
    }

    case 'formula': {
      if (slide.formulaDetails) {
        // Formula Banner
        doc.setFillColor(238, 242, 255);
        doc.setDrawColor(199, 210, 254);
        doc.setLineWidth(0.4);
        doc.roundedRect(14, currentY, contentWidth, 14, 2, 2, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(67, 56, 202);
        doc.text('FOCUSDNA COMPOSITE MULTI-FACTOR EQUATION', 18, currentY + 4.5);

        doc.setFont('courier', 'bold');
        doc.setFontSize(10.5);
        doc.setTextColor(30, 27, 75);
        doc.text(slide.formulaDetails.formula, 18, currentY + 10.5);

        currentY += 18;

        // 4 Variables in 2x2 Grid
        const varWidth = (contentWidth - 6) / 2;
        const varHeight = 16;

        slide.formulaDetails.variables.forEach((v, idx) => {
          const col = idx % 2;
          const row = Math.floor(idx / 2);
          const vX = 14 + col * (varWidth + 6);
          const vY = currentY + row * (varHeight + 3);

          doc.setFillColor(249, 250, 251);
          doc.setDrawColor(228, 228, 231);
          doc.setLineWidth(0.3);
          doc.roundedRect(vX, vY, varWidth, varHeight, 1.5, 1.5, 'FD');

          doc.setFont('courier', 'bold');
          doc.setFontSize(8.5);
          doc.setTextColor(79, 70, 229);
          doc.text(v.symbol, vX + 3.5, vY + 5.5);

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.setTextColor(17, 24, 39);
          doc.text(`— ${v.name}`, vX + 18, vY + 5.5);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7);
          doc.setTextColor(107, 114, 128);
          const lines = doc.splitTextToSize(v.impact, varWidth - 7);
          doc.text(lines, vX + 3.5, vY + 10.5);
        });

        currentY += varHeight * 2 + 7;

        // Takeaway
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(228, 228, 231);
        doc.roundedRect(14, currentY, contentWidth, 9, 1.5, 1.5, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(17, 24, 39);
        doc.text('Key Outcome:', 18, currentY + 5.5);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(75, 85, 99);
        doc.text(slide.formulaDetails.takeaway, 38, currentY + 5.5);
      }
      break;
    }

    case 'two-column':
    case 'digest': {
      const colWidth = (contentWidth - 6) / 2;

      // Left column: Bullets
      if (slide.bullets) {
        let bY = currentY;
        slide.bullets.forEach((b) => {
          doc.setFillColor(249, 250, 251);
          doc.setDrawColor(228, 228, 231);
          doc.setLineWidth(0.3);
          doc.roundedRect(14, bY, colWidth, 13.5, 1.5, 1.5, 'FD');

          doc.setFillColor(79, 70, 229);
          doc.circle(18, bY + 4.5, 1, 'F');

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.setTextColor(17, 24, 39);
          doc.text(b.title, 21, bY + 5.5);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7);
          doc.setTextColor(107, 114, 128);
          const lines = doc.splitTextToSize(b.description, colWidth - 10);
          doc.text(lines, 18, bY + 9.5);

          bY += 16;
        });
      }

      // Right column: Cards
      if (slide.cards) {
        let cY = currentY;
        const rightX = 14 + colWidth + 6;
        slide.cards.forEach((c) => {
          doc.setFillColor(255, 251, 235); // Amber-50
          doc.setDrawColor(253, 230, 138); // Amber-200
          doc.setLineWidth(0.3);
          doc.roundedRect(rightX, cY, colWidth, 27, 2, 2, 'FD');

          if (c.accent) {
            doc.setFillColor(254, 243, 199);
            doc.roundedRect(rightX + 4, cY + 4, 34, 4.5, 1, 1, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(6.5);
            doc.setTextColor(146, 64, 14);
            doc.text(c.accent.toUpperCase(), rightX + 6, cY + 7.2);
          }

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8.5);
          doc.setTextColor(120, 53, 15);
          doc.text(c.title, rightX + 4, cY + 13.5);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.5);
          doc.setTextColor(146, 64, 14);
          const lines = doc.splitTextToSize(c.desc, colWidth - 8);
          doc.text(lines, rightX + 4, cY + 18);

          cY += 30;
        });
      }
      break;
    }

    case 'metrics-grid': {
      if (slide.metrics) {
        const gridWidth = (contentWidth - 9) / 4;
        const gridHeight = 36;

        slide.metrics.forEach((m, idx) => {
          const mX = 14 + idx * (gridWidth + 3);
          doc.setFillColor(249, 250, 251);
          doc.setDrawColor(228, 228, 231);
          doc.setLineWidth(0.3);
          doc.roundedRect(mX, currentY, gridWidth, gridHeight, 2, 2, 'FD');

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(16);
          doc.setTextColor(79, 70, 229);
          doc.text(m.value, mX + 4, currentY + 10);

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7.5);
          doc.setTextColor(17, 24, 39);
          doc.text(m.label.toUpperCase(), mX + 4, currentY + 17);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7);
          doc.setTextColor(107, 114, 128);
          const lines = doc.splitTextToSize(m.description, gridWidth - 7);
          doc.text(lines, mX + 4, currentY + 22);
        });

        currentY += gridHeight + 6;
      }

      if (slide.summary) {
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(228, 228, 231);
        doc.roundedRect(14, currentY, contentWidth, 14, 1.5, 1.5, 'FD');

        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(75, 85, 99);
        const sLines = doc.splitTextToSize(`"${slide.summary}"`, contentWidth - 10);
        doc.text(sLines, 18, currentY + 6);
      }
      break;
    }

    case 'architecture': {
      if (slide.architectureLayers) {
        const layerHeight = 12.5;
        slide.architectureLayers.forEach((layer, idx) => {
          const lY = currentY + idx * (layerHeight + 2.5);
          doc.setFillColor(249, 250, 251);
          doc.setDrawColor(228, 228, 231);
          doc.setLineWidth(0.3);
          doc.roundedRect(14, lY, contentWidth, layerHeight, 1.5, 1.5, 'FD');

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.setTextColor(17, 24, 39);
          doc.text(layer.layer, 18, lY + 5);

          doc.setFont('courier', 'normal');
          doc.setFontSize(6.5);
          doc.setTextColor(79, 70, 229);
          doc.text(layer.components, 18, lY + 9.5);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.5);
          doc.setTextColor(75, 85, 99);
          const pLines = doc.splitTextToSize(layer.purpose, contentWidth - 95);
          doc.text(pLines, 95, lY + 5.5);
        });
      }
      break;
    }

    case 'conclusion': {
      if (slide.bullets) {
        const cardWidth = (contentWidth - 8) / 3;
        const cardHeight = 32;

        slide.bullets.forEach((b, idx) => {
          const cardX = 14 + idx * (cardWidth + 4);
          doc.setFillColor(249, 250, 251);
          doc.setDrawColor(228, 228, 231);
          doc.setLineWidth(0.3);
          doc.roundedRect(cardX, currentY, cardWidth, cardHeight, 2, 2, 'FD');

          if (b.highlight) {
            doc.setFillColor(236, 253, 245);
            doc.roundedRect(cardX + 4, currentY + 4, 30, 4.5, 1, 1, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(6.5);
            doc.setTextColor(5, 150, 105);
            doc.text(b.highlight.toUpperCase(), cardX + 6, currentY + 7.2);
          }

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8.5);
          doc.setTextColor(17, 24, 39);
          doc.text(b.title, cardX + 4, currentY + 14);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.5);
          doc.setTextColor(75, 85, 99);
          const lines = doc.splitTextToSize(b.description, cardWidth - 8);
          doc.text(lines, cardX + 4, currentY + 19);
        });

        currentY += cardHeight + 6;
      }

      // Live Demo Callout
      doc.setFillColor(238, 242, 255);
      doc.setDrawColor(199, 210, 254);
      doc.roundedRect(14, currentY, contentWidth, 18, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(30, 27, 75);
      doc.text('Ready for Live Interactive Demonstration', 18, currentY + 7);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(67, 56, 202);
      doc.text(
        'Explore the live dashboard, trigger circadian schedule optimization, or launch an adaptive focus sprint.',
        18,
        currentY + 13
      );
      break;
    }
  }

  // Speaker notes section at bottom if option enabled
  if (includeSpeakerNotes && slide.speakerNotes && slide.speakerNotes.length > 0) {
    const notesY = pageHeight - 24;
    doc.setFillColor(254, 252, 232); // Light yellow
    doc.setDrawColor(254, 240, 138);
    doc.setLineWidth(0.2);
    doc.roundedRect(14, notesY, contentWidth, 11, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(133, 77, 14);
    doc.text('TALKING POINT / SPEAKER NOTE:', 18, notesY + 3.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(113, 63, 18);
    const noteText = doc.splitTextToSize(slide.speakerNotes[0], contentWidth - 10);
    doc.text(noteText, 18, notesY + 7);
  }
}

function renderSlideFooter(
  doc: jsPDF,
  slide: SlideData,
  pageWidth: number,
  pageHeight: number,
  currentNum: number,
  totalNum: number,
  theme: string
) {
  const footerY = pageHeight - 11;

  doc.setDrawColor(240, 240, 242);
  doc.setLineWidth(0.3);
  doc.line(14, footerY - 2, pageWidth - 14, footerY - 2);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(156, 163, 175);
  doc.text('FocusDNA: Empirical Attention Modeling & Circadian Scheduling', 14, footerY + 1.5);

  doc.text(
    `Page ${currentNum} of ${totalNum} · Generated on ${new Date().toLocaleDateString()}`,
    pageWidth - 14,
    footerY + 1.5,
    { align: 'right' }
  );
}
