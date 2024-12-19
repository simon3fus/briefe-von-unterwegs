document.getElementById('generatePDF').addEventListener('click', function() {
    // Den eingegebenen Brieftext und die Felder für Empfänger, Absender und Betreff holen
    const text = document.getElementById('textInput').value;
    const recipient = document.getElementById('recipientInput').value;
    const sender = document.getElementById('senderInput').value;
    const subject = document.getElementById('subjectInput').value;

    if (!text || !recipient || !sender || !subject) {
        alert('Bitte füllen Sie alle Felder aus!');
        return;
    }

    // jsPDF initialisieren
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Initiale Positionen
    let currentY = 20;
    const margin = 20;
    const lineHeight = 10;  // Standard Zeilenhöhe
    const reducedLineHeight = 5;  // Reduzierter Zeilenabstand
    const pageHeight = doc.internal.pageSize.height;
    const maxLineY = pageHeight - margin; // Maximale Y-Position bevor eine neue Seite erforderlich ist

    // Platz für Empfänger und Absender dynamisch berechnen
    const recipientLines = doc.splitTextToSize(recipient, 180); // Breite für Empfängertext
    const senderLines = doc.splitTextToSize(sender, 80); // Breite für Absendertext

    // Empfänger links
    doc.setFontSize(12);  // Gleiche Schriftgröße wie der restliche Text
    doc.text(recipientLines, 20, currentY);
    // Absender rechts
    doc.text(senderLines, 120, currentY);

    const recipientHeight = recipientLines.length * lineHeight;
    const senderHeight = senderLines.length * lineHeight;
    const maxHeight = Math.max(recipientHeight, senderHeight); // Höheren Wert nehmen

    currentY += maxHeight + 10; // Platz für Empfänger und Absender

    // Datum linksbündig, direkt über dem Betreff
    doc.setFontSize(12); // Gleiche Größe wie der Text
    doc.text(new Date().toLocaleDateString(), 20, currentY); // Datum linksbündig

    // Betreff direkt unter dem Datum, mit nur einer Zeile Abstand
    currentY += 10; // Ein Zeilenabstand zwischen Datum und Betreff

    doc.setFontSize(18);  // Betreff größer
    doc.setFont("helvetica", "bold");  // Betreff fett
    doc.text(subject, 20, currentY);
    currentY += 15;  // Kleiner Abstand nach dem Betreff

    // Text wird aufgeteilt in Zeilen, die in die Breite der PDF-Seite passen
    const textLines = doc.splitTextToSize(text, 280); // Text wird auf breitere Seitenbreite umgebrochen
    doc.setFontSize(12);  // Schriftgröße für den normalen Text
    doc.setFont("helvetica", "normal");  // Normaler Text, nicht fett

    // Für jede Textzeile prüfen, ob sie auf die aktuelle Seite passt, sonst neue Seite hinzufügen
    textLines.forEach(line => {
        if (currentY + reducedLineHeight > maxLineY) {
            doc.addPage();                            // Neue Seite hinzufügen
            currentY = margin;                        // Position auf neuer Seite resetten
        }
        doc.text(line, 20, currentY);                 // Text auf die aktuelle Position schreiben
        currentY += reducedLineHeight;                // Y-Position für nächste Zeile aktualisieren
    });

//     Abschiedsgruß und Name, immer auf der letzten Seite
//    if (currentY + 30 > maxLineY) {
//        doc.addPage();
//        currentY = margin;
//    }
//
//    doc.text("Mit freundlichen Grüßen,", 20, currentY + 20);
//    doc.text("Ihr Name", 20, currentY + 30);

    // PDF speichern
    doc.save('brief.pdf');
});
