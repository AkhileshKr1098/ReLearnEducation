import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';

@Injectable({
  providedIn: 'root',
})
export class LetterTracingService {
  constructor() {}
  
  async loadCustomFont(fontUrl: string): Promise<string> {
    const response = await fetch(fontUrl);
    const buffer = await response.arrayBuffer();
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
  }

  async generateLetterTracingPDF(letters: string[]): Promise<void> {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const fontBase64 = await this.loadCustomFont('../assets/dotline-font/DotlineBold-g25Y.ttf');

    doc.addFileToVFS('Dotline.ttf', fontBase64);
    doc.addFont('Dotline.ttf', 'Dotline', 'normal');
    doc.setFont('Dotline'); // <-- use the font

    const pageWidth = 210;
    const margin = 10;
    const spacing = 60;
    const lettersPerRow = 3;
    const letterSize = 60;
    const startY = 50;

    const now = new Date();
    const formattedDate = now.toLocaleString();

    doc.setFontSize(18);
    doc.setTextColor(255, 102, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('Relearn Education', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'normal');
    doc.text(formattedDate, pageWidth - margin, 15, { align: 'right' });

    // Draw letters using custom font
    doc.setFont('Dotline');
    doc.setFontSize(letterSize);

    letters.forEach((letter, index) => {
      const row = Math.floor(index / lettersPerRow);
      const col = index % lettersPerRow;
      const x = margin + col * ((pageWidth - 2 * margin) / lettersPerRow);
      const y = startY + row * spacing;
      doc.text(letter.toUpperCase(), x + 10, y);
    });

    doc.save('letter-tracing.pdf');
  }
}
