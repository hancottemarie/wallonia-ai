import jsPDF from 'jspdf';
import axios from 'axios';

export const exportToPDF = async (itinerary) => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
    const margin = 20;
    const pageWidth = 190;
    const lineHeight = 6; // mm par ligne

    // 1. Récupération du récit narratif
    let aiStory = "";
    try {
        const response = await axios.post('http://127.0.0.1:8000/generate-itinerary-story', itinerary);
        aiStory = response.data.story;
    } catch (error) {
        aiStory = "Un voyage mémorable vous attend à travers les provinces wallonnes.";
    }

    // --- DESIGN DU HEADER ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(30, 58, 138);
    doc.text("WALLONIA.AI - MON CARNET DE ROUTE", margin, 25);

    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(`Édition du ${date} - Itinéraire Sur-Mesure`, margin, 32);
    doc.line(margin, 35, pageWidth, 35);

    // --- SECTION 1 : LE RÉCIT NARRATIF ---
    doc.setFontSize(14);
    doc.setTextColor(37, 99, 235);
    doc.text("L'histoire de votre voyage :", margin, 45);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(60);

    const storyLines = doc.splitTextToSize(aiStory, pageWidth - margin);
    doc.text(storyLines, margin, 55);

    // CALCUL DYNAMIQUE DE LA POSITION SUIVANTE
    let currentY = 60 + (storyLines.length * lineHeight);

    // --- SECTION 2 : LES ÉTAPES ---
    if (currentY > 250) { doc.addPage(); currentY = 25; }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(30, 58, 138);
    doc.text("Vos escales", margin, currentY);
    currentY += 12;

    itinerary.forEach((city, index) => {
		// Juste après le nom de la ville
		if (city.weather) {
			doc.setFontSize(9);
			doc.setTextColor(50, 50, 50);
			doc.text(`Météo actuelle : ${city.weather.temp}°C - ${city.weather.desc}`, margin + 5, currentY + 12);
			currentY += 5; // On décale un peu le texte suivant
		}
        // Nouveau titre d'étape
        doc.setFontSize(12);
        doc.setTextColor(30);
        doc.text(`${index + 1}. ${city.name} (${city.province})`, margin, currentY);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(80);

        // Texte de l'étape
        const desc = city.ai_description || "Détails à découvrir sur place.";
        const splitDesc = doc.splitTextToSize(desc, pageWidth - 30);

        // On vérifie si l'étape tient encore sur la page
        const blockHeight = (splitDesc.length * 5) + 15;
        if (currentY + blockHeight > 280) {
            doc.addPage();
            currentY = 25;
        }

        doc.text(splitDesc, margin + 5, currentY + 7);

        // MISE À JOUR DE Y POUR LA PROCHAINE ÉTAPE
        currentY += blockHeight;
    });

    doc.save(`Roadtrip_Wallonia_AI.pdf`);
};
