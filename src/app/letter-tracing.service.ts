import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';

@Injectable({
  providedIn: 'root',
})
export class LetterTracingService {
  constructor() {}

  async generateLetterTracingPDF(letters: string[]): Promise<void> {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const pageWidth = 210;
    const margin = 10;
    const spacing = 60;
    const lettersPerRow = 3;
    const letterSize = 60;
    const startY = 50;

    const logo = new Image();
    logo.src = 'https://www.relearntoday.com/assets/images/logo_app.png';

    // Wait for the logo to load
    await new Promise<void>((resolve) => {
      logo.onload = () => resolve();
      logo.onerror = () => resolve();
    });

    // Header
    const now = new Date();
    const formattedDate = now.toLocaleString();

    // doc.addImage(logo, 'PNG', margin, 10, 20, 15);
    doc.setFontSize(18);
    doc.setTextColor(255, 102, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('Relearn Education', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'normal');
    doc.text(formattedDate, pageWidth - margin, 15, { align: 'right' });

    // Draw letters
    letters.forEach((letter, index) => {
      const row = Math.floor(index / lettersPerRow);
      const col = index % lettersPerRow;

      const x = margin + col * ((pageWidth - 2 * margin) / lettersPerRow);
      const y = startY + row * spacing;

      doc.setFontSize(letterSize);
      doc.text(letter.toUpperCase(), x + 10, y);
    });

    doc.save('letter-tracing.pdf');
  }
}
