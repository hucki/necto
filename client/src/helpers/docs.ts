import jsPDF from 'jspdf';
import { Patient } from '../types/Patient';


export const contract = (p: Patient) => {
  const topOffset = 80;
  const lineWidth = 98;
  const centerOffset = 105;
  let currentLine = topOffset;
  const lineHeight = 6;
  const paragraphDistance = 10;
  const nextLine = () => {
    return currentLine += lineHeight;
  };
  const nextParagraph = () => {
    return currentLine += paragraphDistance;
  };
  const doc = new jsPDF();

  const printParagraph = (text: string) => {
    const res = [];
    let remains = text;
    for (let i = 0; i < text.length; i += lineWidth ) {
      const lastEmptySpace = remains.lastIndexOf(' ',lineWidth);
      const current = remains.length < lineWidth ? remains : remains.substring(0, lastEmptySpace);
      remains = remains.substring(lastEmptySpace);
      res.push(current);
    };
    res.forEach((value, key) => {
      doc.text(value, key === 0 ? 10 : 13, key === 0 ? nextParagraph(): nextLine());
    });
  };


  doc.setFontSize(22);
  doc.text('Behandlungsvertrag', centerOffset, topOffset, {align: 'center'} );
  doc.setFontSize(12);
  doc.text('zwischen', 10, nextParagraph());
  doc.setFont('helvetica', 'bold');
  doc.text('Mundwerk Logopädische Praxis', centerOffset, nextParagraph(), {align: 'center'});
  doc.text('Anja Wette, Logopädin & Sabine Huckschlag, Logopädin (Partnerschaft)', centerOffset, nextLine(), {align: 'center'});
  doc.text('Neumarkt 7', centerOffset, nextLine(), {align: 'center'});
  doc.text('59821 Arnsberg', centerOffset, nextLine(), {align: 'center'});
  doc.setFont('helvetica', 'italic');
  doc.text('-im Folgenden Logopäd:in genannt-', centerOffset, nextLine(), {align: 'center'});
  doc.setFont('helvetica', 'normal');
  doc.text('und', 10, nextParagraph(),);
  doc.text(p.lastName + ', ' + p.firstName, centerOffset, nextParagraph(), {align: 'center'});
  doc.text('Name der Eltern/Erziehungsberechtigten    ___________________________________', centerOffset, nextLine(), {align: 'center'});
  doc.text('Adresse: ' + (p.street || '__________________________') + ', ' + (p.city ? p.zip + ' ' + p.city : '__________________________'), centerOffset, nextLine(), {align: 'center'});
  doc.text('Versicherung: ' + (p.insurance || '__________________________') + ', ' + 'befreit: ' + (p.isAddpayFreed ? 'ja' : 'nein') , centerOffset, nextLine(), {align: 'center'});
  doc.setFont('helvetica', 'italic');
  doc.text('-im Folgenden Patient:in genannt-', centerOffset, nextLine(), {align: 'center'});
  doc.setFont('helvetica', 'normal');
  doc.text('über die Erbringung logopädischer Leistungen.', 10, nextParagraph());
  doc.text('1. Die Vertragsparteien schließen einen Vertrag über die Erbringung logopädischer Leistungen.', 10, nextParagraph());
  doc.text('Das Behandlungsverhältnis beginnt mit der Durchführung der Verordnung von', 10, nextLine());
  doc.text(p.doctor?.title + ' ' + p.doctor?.firstName + ' ' + p.doctor?.lastName + ' vom ' + '__________________________', centerOffset, nextParagraph(), {align: 'center'});
  doc.text('Das Vertragsverhältnis wird auf unbestimmte Zeit geschlossen und umfasst alle folgenden', 10, nextParagraph());
  doc.text('Verordnungen sowie Verordnungen aufgrund neuer Behandlungsfälle, egal von welcher Ärztin bzw.', 10, nextLine());
  doc.text('welchem Arzt verordnet. ', 10, nextLine());
  const paragraphTwo = '2. Der/die Logopäd:in weist den/die Patient:in auf die Zuzahlungspflicht gemäß § 32 Abs. 2 SGB V i.V.m. § 61 Satz 3 SGB V hin. Nach dieser gesetzlichen Regelung haben Patient:innen, die das 18. Lebensjahr vollendet haben, 10 Prozent der Kosten sowie 10 Euro je Verordnung selbst zu zahlen, soweit sie auf ihren Antrag nicht von der Zuzahlung befreit sind. Kinder und Jugendliche unter 18 Jahren sind immer von der Zuzahlung befreit.';
  printParagraph(paragraphTwo);
  doc.addPage();
  currentLine = 30;
  doc.text('3. Die Zuzahlung ist spätestens _____ Tage/Wochen nach Rechnungseingang auf das folgende',10,nextParagraph());
  doc.text('Konto zu zahlen:',10,nextLine());
  doc.setFont('courier', 'bold');
  doc.text('Kontoinhaber: Mundwerk Logopädische Praxis Wette & Huckschlag',10,nextParagraph());
  doc.text('IBAN:         DE41 4665 0005 0001 0224 41',10,nextLine());
  doc.text('SWIFT-BIC:    WELADED1ARN',10,nextLine());
  doc.setFont('helvetica', 'normal');
  doc.text('Der/die Patient:in erklärt ausdrücklich die Einwilligung, dass der/die Logopäd:in aus dem ', 10,nextParagraph());
  doc.text('geschlossenen Behandlungsvertrag entstehenden Honoraransprüche zum Zwecke der', 10,nextLine());
  doc.text('Rechnungsstellung und Einziehung der Forderung an _______ (Name und Anschrift der', 10,nextLine());
  doc.text('Abrechnungsstelle) abtritt. ', 10,nextLine());
  doc.setFont('helvetica','bold');
  doc.text('Im Falle des Zahlungsverzuges wird für Zahlungsaufforderungen/Mahnungen eine von', 10, nextParagraph());
  doc.text('dem/der Patient:in zu zahlende Bearbeitungsgebühr i.H.v. 5,00 € vereinbart. ', 10, nextLine());
  doc.setFont('helvetica','normal');
  doc.text('Im Falle der Nichteinhaltung der o.g. Zahlungsfrist ist der Rechnungsbetrag nach den gesetzlichen', 10, nextLine());
  doc.text('Vorschriften zu verzinsen.', 10, nextLine());
  const paragraphFour = '4. Der Erfolg einer logopädischen Behandlung hängt wesentlich von der aktiven Teilnahme des/der Patient:in ab. Daher ist wichtig, die vereinbarten Termine zuverlässig wahrzunehmen. Die Terminabsprache dient zwar auch der Sicherung eines zeitgemäßen Behandlungsablaufs. Die logopädische Praxis ist jedoch eine reine Bestellpraxis, da die Behandlungssituation die persönliche Gegenwart des/der behandelnden Logopäd:in zwingend voraussetzt. Die vereinbarten Zeiten sind ausschließlich für die jeweiligen Patient:innen reserviert. Die Vertragsparteien vereinbaren für den Fall, dass der/die Patient:in einen vereinbarten Termin nicht wahrnehmen kann und den/die Logopäd:in nicht spätestens 24 Stunden vor dem vereinbarten Termin hierüber informiert, dass der übliche Kassensatz i.H.v. ____ € dem/der Patient:in als Ausfallgebühr privat in Rechnung gestellt wird. Hierbei wird der/die Logopäd:in mögliche Aufwendungen, die die Praxis in Folge des Therapieausfalls erspart hat, in Abzug bringen.';
  printParagraph(paragraphFour);
  const paragraphFive = '5. Die Patientin/der Patient verpflichtet sich, die Logopädin/den Logopäden umgehend über Änderungen der Kontaktdaten (Adresse/Telefonnummer/E-Mail Adresse) zu informieren.';
  printParagraph(paragraphFive);
  const paragraphSix = '6. Die Logopädin/der Logopäde erhebt die personenbezogene Daten ausschließlich im Rahmen der geltenden Datenschutzbestimmungen zum Zwecke der Gesundheitsbehandlung, Dokumentation und Abrechnung der erbrachten Leistungen mit den gesetzlichen Krankenkassen nach § 302 SGB V. Die gesetzlich zugelassenen Rechenzentren wurden im Rahmen der Auftragsdatenverarbeitung zur Einhaltung der Datenschutzbestimmungen verpflichtet. ';
  printParagraph(paragraphSix);
  const paragraphSeven = '7. Durch die Unterschrift bestätigt die Patientin/ der Patient, eine Kopie des Vertrages erhalten zu haben.';
  printParagraph(paragraphSeven);



  return doc;
};