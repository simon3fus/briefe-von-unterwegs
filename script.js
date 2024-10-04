document.getElementById('generatePDF').addEventListener('click', function() {
    // Den eingegebenen Brieftext und die Empfängeradresse holen
    const text = document.getElementById('textInput').value;
    const recipient = document.getElementById('recipientInput').value;

    if (!text || !recipient) {
        alert('Bitte geben Sie sowohl den Text als auch die Empfängeradresse ein!');
        return;
    }

    // jsPDF initialisieren
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Briefkopf (du kannst hier Name, Adresse, Datum usw. hinzufügen)
    doc.setFontSize(12);
    doc.text("Dein Name", 20, 30);
    doc.text("Deine Adresse", 20, 40);
    doc.text("Datum: " + new Date().toLocaleDateString(), 150, 40);

    // Empfängeradresse aus dem Textfeld einfügen
    doc.text("Empfänger:", 20, 60);
    const recipientLines = doc.splitTextToSize(recipient, 180); // Empfängeradresse umbrechen
    doc.text(recipientLines, 20, 70); // Empfängeradresse platzieren

    // Startposition des Brieftexts
    let currentY = 90;

    // Betreff
    doc.setFontSize(14);
    doc.text("Betreff: Wichtiger Brief", 20, currentY);
    currentY += 10;

    // Text wird aufgeteilt in Zeilen, die in die Breite der PDF-Seite passen
    const pageHeight = doc.internal.pageSize.height;  // Höhe der Seite
    const margin = 20;                                // Seitenrand
    const lineHeight = 10;                            // Zeilenhöhe
    const maxLineY = pageHeight - margin;             // Maximale Y-Position bevor eine neue Seite erforderlich ist
    const textLines = doc.splitTextToSize(text, 180); // Text wird auf Zeilen umgebrochen

    doc.setFontSize(12);

    // Für jede Textzeile prüfen, ob sie auf die aktuelle Seite passt, sonst neue Seite hinzufügen
    textLines.forEach(line => {
        if (currentY + lineHeight > maxLineY) {
            doc.addPage();                            // Neue Seite hinzufügen
            currentY = margin;                        // Position auf neuer Seite resetten
        }
        doc.text(line, 20, currentY);                 // Text auf die aktuelle Position schreiben
        currentY += lineHeight;                       // Y-Position für nächste Zeile aktualisieren
    });

    // Abschiedsgruß, immer auf der letzten Seite
    if (currentY + 30 > maxLineY) {
        doc.addPage();
        currentY = margin;
    }
    doc.text("Mit freundlichen Grüßen,", 20, currentY + 20);
    doc.text("Dein Name", 20, currentY + 30);

    // PDF speichern
    doc.save('brief.pdf');
});
