import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

interface BadgePdfOptions {
  badgeName: string;
  date: string;
  badgeType: string;
  description: string;
  imageUrl: string;
  outputPath: string;
}

export async function generateBadgePdf(options: BadgePdfOptions): Promise<string> {
  const { badgeName, date, badgeType, description, imageUrl, outputPath } = options;
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });

  // White background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 595, 842, 'F');

  // Badge name at the top
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text(badgeName || badgeType, 297.5, 80, { align: 'center' });

  // Badge image (centered)
  let imgData: string | undefined;
  try {
    let imageBuffer: Buffer;
    if (imageUrl.startsWith('http')) {
      // Download image from URL
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      imageBuffer = Buffer.from(response.data, 'binary');
    } else {
      // Local file
      imageBuffer = fs.readFileSync(imageUrl);
    }
    imgData = 'data:image/png;base64,' + imageBuffer.toString('base64');
    doc.addImage(imgData, 'PNG', 197.5, 100, 200, 200);
  } catch (e) {
    console.error('Error loading badge image for PDF:', e);
  }

  // Date (rounded box)
  doc.setFillColor(240, 240, 240);
  doc.roundedRect(222.5, 320, 150, 30, 10, 10, 'F');
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(date, 297.5, 340, { align: 'center' });

  // Badge type (bold, centered) with extra space below date
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(badgeType, 297.5, 380, { align: 'center' });

  // Static line with extra space below type
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Awarded for completing a week of sessions toward this goals.', 297.5, 420, { align: 'center', maxWidth: 400 });

  // Description
//   doc.setFontSize(16);
//   doc.setFont('helvetica', 'normal');
//   doc.text(description, 297.5, 380, { align: 'center', maxWidth: 400 });

  // Save PDF
  const pdfBuffer = doc.output('arraybuffer');
  fs.writeFileSync(outputPath, Buffer.from(pdfBuffer));
  return outputPath;
} 