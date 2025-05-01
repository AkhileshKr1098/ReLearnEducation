// src/app/services/letter-tracing.service.ts

import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';

@Injectable({ providedIn: 'root' })
export class LetterTracingService {
  constructor() {}

  async generatePageWith4LettersPDF(letters: string[]): Promise<void> {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = 210;
    const pageHeight = 297;

    const logo = new Image();
    logo.src = '../assets/icon/logo_app.png';
    await new Promise(resolve => {
      logo.onload = () => resolve(true);
      logo.onerror = () => resolve(true);
    });

    for (let i = 0; i < letters.length; i += 4) {
      if (i > 0) doc.addPage();

      const now = new Date().toLocaleString();

      // Header
      doc.addImage(logo, 'PNG', 10, 10, 25, 15);
      doc.setFontSize(18);
      doc.setTextColor(255, 102, 0);
      doc.setFont('helvetica', 'bold');
      doc.text('Relearn Education', pageWidth / 2, 20, { align: 'center' });
      doc.setFontSize(10);
      doc.setTextColor(0);
      doc.setFont('helvetica', 'normal');
      doc.text(now, pageWidth - 10, 15, { align: 'right' });

      // Draw 4 letters vertically
      const sectionHeight = 60;
      for (let j = 0; j < 4; j++) {
        const letter = letters[i + j];
        if (!letter) break;

        const x = 55; // center horizontally
        const y = 35 + j * sectionHeight;

        await this.drawLetterAsDots(doc, letter.toUpperCase(), x, y, 100, 50);
      }
    }

    doc.save('letter-tracing.pdf');
  }

  private async drawLetterAsDots(doc: jsPDF, letter: string, x: number, y: number, w: number, h: number) {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = 'bold 250px Arial';
    ctx.textBaseline = 'top';
    ctx.fillText(letter, 10, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const dotSpacing = 6;
    for (let i = 0; i < canvas.width; i += dotSpacing) {
      for (let j = 0; j < canvas.height; j += dotSpacing) {
        const index = (j * canvas.width + i) * 4;
        const alpha = imageData[index + 3];
        if (alpha > 128) {
          const dotX = x + (i / canvas.width) * w;
          const dotY = y + (j / canvas.height) * h;
          doc.circle(dotX, dotY, 0.5, 'F');
        }
      }
    }
  }
}
