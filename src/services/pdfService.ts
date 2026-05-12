import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { VestDimensions, Gauge } from "../types";

export async function exportToPDF(
  elementId: string,
  dimensions: VestDimensions,
  gauge: Gauge
) {
  // We'll try to find the print-specific element first
  let element = document.getElementById("pdf-print-container");
  if (!element) {
    element = document.getElementById(elementId);
  }
  
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#ffffff",
      logging: false,
      useCORS: true,
      allowTaint: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Technical calculations (same as DetailedCalculations.tsx)
    const st = (cm: number) => Math.round((cm * gauge.stitchesPer10cm) / 10);
    const rows = (cm: number) => Math.round((cm * gauge.rowsPer10cm) / 10);
    
    const totalShoulderWidthCm = (dimensions.shoulderWidth * 2 + dimensions.neckWidth);
    const armholeWidthCm = (dimensions.bustWidth - totalShoulderWidthCm) / 2;
    const armholeStitches = st(armholeWidthCm);
    const neckStitches = st(dimensions.neckWidth / 2);
    const neckRows = rows(dimensions.armholeHeight);
    const neckFrequency = Math.ceil(neckRows / (neckStitches || 1));
    const armholeInitialCastOff = Math.floor(armholeStitches * 0.4);
    const armholeRemainingSt = armholeStitches - armholeInitialCastOff;

    // --- PAGE 1: Header & Pattern ---
    
    // Header Banner
    pdf.setFillColor(0, 0, 0);
    pdf.rect(0, 0, pageWidth, 35, "F");
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.text("Atelier Marco", 15, 20);
    
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.text("SPECIFICHE TECNICHE CARTAMODELLO MAGLIERIA", 15, 28);
    pdf.text(new Date().toLocaleDateString("it-IT"), pageWidth - 40, 20);

    // Pattern Image Section
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("1. Prospetto Cartamodello", 15, 45);

    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pageWidth - 30;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
    
    pdf.addImage(imgData, "PNG", 15, 50, imgWidth, imgHeight);

    // Summary Box
    let currentY = 55 + imgHeight;
    pdf.setDrawColor(200, 200, 200);
    pdf.setFillColor(248, 248, 248);
    pdf.roundedRect(15, currentY, pageWidth - 30, 25, 2, 2, "FD");

    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text("CAMPIONE (10x10cm)", 20, currentY + 8);
    pdf.text("DIMENSIONI PRINCIPALI", 100, currentY + 8);

    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont("helvetica", "bold");
    pdf.text(`${gauge.stitchesPer10cm} Punti / ${gauge.rowsPer10cm} Giri`, 20, currentY + 16);
    pdf.text(`H: ${dimensions.totalHeight}cm / L: ${dimensions.bustWidth}cm`, 100, currentY + 16);

    // --- PAGE 2: Calculations ---
    pdf.addPage();
    
    // Header for Page 2
    pdf.setFillColor(0, 0, 0);
    pdf.rect(0, 0, pageWidth, 15, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.text("SVILUPPO TECNICO E CALCOLI COMPLETI", 15, 10);

    currentY = 30;
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("2. Istruzioni di Maglieria", 15, currentY);

    // 2.1 Avvio e Struttura Base
    currentY += 15;
    pdf.setFontSize(11);
    pdf.text("2.1 Avvio e Struttura Base", 15, currentY);
    
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    currentY += 8;
    pdf.text(`• Avvio (Fondo): ${dimensions.bottomWidth} cm -> ${st(dimensions.bottomWidth)} punti`, 20, currentY);
    currentY += 6;
    pdf.text(`• Bordo (Hem): ${dimensions.hemHeight} cm -> ${rows(dimensions.hemHeight)} giri`, 20, currentY);
    currentY += 6;
    pdf.text(`• Corpo (Fino a giromanica): ${dimensions.bodyHeight} cm -> ${rows(dimensions.bodyHeight)} giri`, 20, currentY);
    currentY += 6;
    pdf.text(`• Larghezza Torace: ${dimensions.bustWidth} cm -> ${st(dimensions.bustWidth)} punti`, 20, currentY);

    // 2.2 Giro Manica
    currentY += 15;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.text("2.2 Modellatura Giro Manica", 15, currentY);
    
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    currentY += 8;
    pdf.text(`• Ampiezza totale spalle (spalla+scollo+spalla): ${totalShoulderWidthCm} cm`, 20, currentY);
    currentY += 6;
    pdf.text(`• Profondità scavo: (${dimensions.bustWidth} - ${totalShoulderWidthCm}) / 2 = ${armholeWidthCm.toFixed(1)} cm`, 20, currentY);
    currentY += 6;
    pdf.setFont("helvetica", "bold");
    pdf.text(`• Cali totali lato giromanica: ${armholeStitches} pt`, 20, currentY);
    
    currentY += 10;
    pdf.setFont("helvetica", "italic");
    pdf.text("Sequenza cali suggerita:", 20, currentY);
    pdf.setFont("helvetica", "normal");
    currentY += 6;
    pdf.text(`  1. Cali immediati (intreccio): ${armholeInitialCastOff} pt`, 25, currentY);
    currentY += 6;
    pdf.text(`  2. Cali graduali (1pt ogni 2 giri): ${armholeRemainingSt} volte`, 25, currentY);

    // 2.3 Scollo
    currentY += 15;
    pdf.setFont("helvetica", "bold");
    pdf.text("2.3 Modellatura Scollo a V", 15, currentY);
    
    pdf.setFont("helvetica", "normal");
    currentY += 8;
    pdf.text(`• Inizio scollo: Contemporaneo all'inizio del giromanica`, 20, currentY);
    currentY += 6;
    pdf.text(`• Altezza scollo: ${dimensions.armholeHeight} cm (${rows(dimensions.armholeHeight)} giri)`, 20, currentY);
    currentY += 6;
    pdf.text(`• Metà scollo (punti da calare): ${dimensions.neckWidth/2} cm`, 20, currentY);
    currentY += 6;
    pdf.setFont("helvetica", "bold");
    pdf.text(`• Totale cali scollo per lato: ${neckStitches} pt`, 20, currentY);
    
    currentY += 10;
    pdf.setFont("helvetica", "italic");
    pdf.text("Istruzione tecnica:", 20, currentY);
    pdf.setFont("helvetica", "normal");
    currentY += 6;
    pdf.text(`Diminuire 1 punto ogni ${neckFrequency} giri per ${neckStitches} volte.`, 25, currentY);

    // 2.4 Verifica Finale
    currentY += 20;
    pdf.setDrawColor(220, 220, 220);
    pdf.setFillColor(250, 250, 250);
    pdf.roundedRect(15, currentY, pageWidth - 30, 40, 2, 2, "FD");
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFont("helvetica", "bold");
    pdf.text("RIEPILOGO E VERIFICA SPALLA", 20, currentY + 8);
    
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    currentY += 15;
    pdf.text(`Punti iniziali metà davanti (torace):`, 25, currentY);
    pdf.text(`${st(dimensions.bustWidth / 2)} pt`, pageWidth - 45, currentY, { align: "right" });
    
    currentY += 5;
    pdf.text(`Meno cali giromanica:`, 25, currentY);
    pdf.text(`- ${armholeStitches} pt`, pageWidth - 45, currentY, { align: "right" });
    
    currentY += 5;
    pdf.text(`Meno cali scollo:`, 25, currentY);
    pdf.text(`- ${neckStitches} pt`, pageWidth - 45, currentY, { align: "right" });
    
    currentY += 8;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.text(`PUNTI SPALLA RIMASTI:`, 25, currentY);
    pdf.text(`${st(dimensions.shoulderWidth)} pt`, pageWidth - 45, currentY, { align: "right" });

    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text("Generato da Atelier Marco - Knitwear Design Tool", pageWidth / 2, pageHeight - 10, { align: "center" });

    pdf.save(`Atelier-Marco-${dimensions.bustWidth}cm-Gilet.pdf`);
  } catch (error) {
    console.error("PDF Export failed:", error);
    // Fallback simple alert if needed, but console is fine for now
  }
}
