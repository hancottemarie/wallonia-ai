import jsPDF from 'jspdf';

export const exportToPDF = (destinations) => {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString();

  // --- Style ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(37, 99, 235);
  doc.text("Wallonia.ai - Mon Roadtrip", 20, 20);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Généré le ${date} - Itinéraire personnalisé`, 20, 30);
  doc.line(20, 35, 190, 35);

  let yOffset = 50;

  destinations.forEach((city, index) => {
    // Ville et Province
    doc.setFontSize(16);
    doc.setTextColor(30, 41, 59);
    doc.text(`${index + 1}. ${city.name} (${city.province})`, 20, yOffset);

    // Score
    doc.setFontSize(10);
    doc.setTextColor(37, 99, 235);
    doc.text(`Pertinence : ${city.match_score}%`, 20, yOffset + 7);

    // Description IA (Gère le retour à la ligne automatique)
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    const description = doc.splitTextToSize(city.ai_description, 165);
    doc.text(description, 20, yOffset + 15);

    yOffset += 45; // Espacement pour le prochain bloc

    if (yOffset > 270) {
      doc.addPage();
      yOffset = 20;
    }
  });

  doc.save(`Roadtrip_Wallonia.pdf`);
};
