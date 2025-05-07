// src/app/services/letter-tracing.service.ts

import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
// import '../assets/font/KGPrimaryDots-normal.js'; 

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
    logo.src = '../assets/icon/logo_app.png';

    // Wait for logo to load
    await new Promise(resolve => {
      logo.onload = () => resolve(true);
      logo.onerror = () => resolve(true);
    });

    // Header
    const now = new Date();
    const formattedDate = now.toLocaleString();

    doc.addImage(logo, 'PNG', margin, 10, 20, 15);
    doc.setFontSize(18);
    doc.setTextColor(255, 102, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('Relearn Education', pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'normal');
    doc.text(formattedDate, pageWidth - margin, 15, { align: 'right' });

    // Set custom dotted font
    doc.setFont('KGPrimaryDots', 'normal');

    letters.forEach((letter, index) => {
      const row = Math.floor(index / lettersPerRow);
      const col = index % lettersPerRow;

      const x = margin + col * ((pageWidth - 2 * margin) / lettersPerRow);
      const y = startY + row * spacing;

      doc.setFontSize(letterSize);
      doc.text(letter.toUpperCase(), x + 20, y);
    });

    doc.save('letter-tracing.pdf');
  }
}
