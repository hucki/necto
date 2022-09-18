import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import { Company } from '../types/Company';
import { Patient } from '../types/Patient';

/**
 * creates a contract to be printed and signed by
 * the patient before starting the therapy
 * @param {Patient} p - patient to print the contract for
 * @returns {jsPDF} jsPDF doc object
 */
export const contract = (p: Patient, c: Company | undefined): jsPDF => {
  const topOffset = 80;
  const lineWidth = 98;
  const centerOffset = 105;
  let currentLine = topOffset;
  const lineHeight = 6;
  const paragraphDistance = 10;

  const nextLine = (offset: number = 0) => {
    return currentLine += lineHeight + offset;
  };

  const printFooter = () => {
    const currentFontSize = doc.getFontSize();
    const currentFont = doc.getFont();
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Behandlungsvetrag - Seite ' + doc.getCurrentPageInfo().pageNumber, 13, 285, {});
    doc.setFontSize(currentFontSize);
    doc.setFont(currentFont.fontName, currentFont.fontStyle);
  };

  const nextParagraph = (offset: number = 0) => {
    return currentLine += paragraphDistance + offset;
  };
  const doc = new jsPDF();

  const printParagraph = (text: string, offsetFirstLine: number = 10) => {
    const res = [];
    let remains = text;
    for (let i = 0; i < text.length; i += lineWidth ) {
      const lastEmptySpace = remains.lastIndexOf(' ',lineWidth);
      const current = remains.length < lineWidth ? remains : remains.substring(0, lastEmptySpace);
      remains = remains.substring(lastEmptySpace);
      res.push(current.trim());
    };
    res.forEach((value, key) => {
      doc.text(value, key === 0 ? offsetFirstLine : 13, key === 0 ? nextParagraph(): nextLine());
    });
  };


  doc.setFontSize(22);
  doc.text('Behandlungsvertrag', centerOffset, topOffset, {align: 'center'} );
  doc.setFontSize(12);
  doc.text('zwischen', 10, nextParagraph());
  doc.setFont('helvetica', 'bold');
  doc.text((c?.name || '__________________________'), centerOffset, nextParagraph(), {align: 'center'});
  doc.text((c?.name2 || '__________________________'), centerOffset, nextLine(), {align: 'center'});
  doc.text((c?.street || '__________________________'), centerOffset, nextLine(), {align: 'center'});
  doc.text(c?.city ? c.zip + ' ' + c?.city : '__________________________', centerOffset, nextLine(), {align: 'center'});
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
  currentLine += 10;
  const paragraphOneA = '1 Die Vertragsparteien schließen einen Vertrag über die Erbringung logopädischer Leistungen. Das Behandlungsverhältnis beginnt mit der Durchführung der Verordnung von';
  printParagraph(paragraphOneA);
  doc.text(p.doctor?.title + ' ' + p.doctor?.firstName + ' ' + p.doctor?.lastName + ' vom ' + '__________________________', centerOffset, nextParagraph(), {align: 'center'});
  const paragraphOneB = 'Das Vertragsverhältnis wird auf unbestimmte Zeit geschlossen und umfasst alle folgenden Verordnungen sowie Verordnungen aufgrund neuer Behandlungsfälle, egal von welcher Ärztin bzw. welchem Arzt verordnet.';
  printParagraph(paragraphOneB, 13);
  const paragraphTwo = '2. Der/die Logopäd:in weist den/die Patient:in auf die Zuzahlungspflicht gemäß § 32 Abs. 2 SGB V i.V.m. § 61 Satz 3 SGB V hin. Nach dieser gesetzlichen Regelung haben Patient:innen, die das 18. Lebensjahr vollendet haben, 10 Prozent der Kosten sowie 10 Euro je Verordnung selbst zu zahlen, soweit sie auf ihren Antrag nicht von der Zuzahlung befreit sind. Kinder und Jugendliche unter 18 Jahren sind immer von der Zuzahlung befreit.';
  printParagraph(paragraphTwo);
  printFooter();
  doc.addPage();
  currentLine = 30;
  const paragraphThreeA = '3. Die Zuzahlung ist spätestens 4 Wochen nach Rechnungseingang auf das folgende Konto zu zahlen:';
  printParagraph(paragraphThreeA);
  // bank account data
  doc.setFont('courier', 'bold');
  doc.text('Kontoinhaber: ' + (c?.name || '__________________________') ,13,nextParagraph());
  doc.text('IBAN:         DEXX XXXX XXXX XXXX XXXX XX',13,nextLine());
  doc.text('SWIFT-BIC:    XXXXXXXXXXX',13,nextLine());
  doc.setFont('helvetica', 'normal');
  const paragraphThreeB = 'Der/die Patient:in erklärt ausdrücklich die Einwilligung, dass der/die Logopäd:in aus dem geschlossenen Behandlungsvertrag entstehenden Honoraransprüche zum Zwecke der Rechnungsstellung und Einziehung der Forderung an _______ (Name und Anschrift der Abrechnungsstelle) abtritt.';
  printParagraph(paragraphThreeB, 13);
  doc.setFont('helvetica','bold');
  const paragraphThreeC = 'Im Falle des Zahlungsverzuges wird für Zahlungsaufforderungen/Mahnungen eine von dem/der Patient:in zu zahlende Bearbeitungsgebühr i.H.v. 5,00 € vereinbart.';
  printParagraph(paragraphThreeC, 13);
  doc.setFont('helvetica','normal');
  const paragraphThreeD = 'Im Falle der Nichteinhaltung der o.g. Zahlungsfrist ist der Rechnungsbetrag nach den gesetzlichen Vorschriften zu verzinsen.';
  printParagraph(paragraphThreeD, 13);
  const paragraphFour = '4. Der Erfolg einer logopädischen Behandlung hängt wesentlich von der aktiven Teilnahme des/der Patient:in ab. Daher ist wichtig, die vereinbarten Termine zuverlässig wahrzunehmen. Die Terminabsprache dient zwar auch der Sicherung eines zeitgemäßen Behandlungsablaufs. Die logopädische Praxis ist jedoch eine reine Bestellpraxis, da die Behandlungssituation die persönliche Gegenwart des/der behandelnden Logopäd:in zwingend voraussetzt. Die vereinbarten Zeiten sind ausschließlich für die jeweiligen Patient:innen reserviert. Die Vertragsparteien vereinbaren für den Fall, dass der/die Patient:in einen vereinbarten Termin nicht wahrnehmen kann und den/die Logopäd:in nicht spätestens 24 Stunden vor dem vereinbarten Termin hierüber informiert, dass der übliche Kassensatz i.H.v. ____ € dem/der Patient:in als Ausfallgebühr privat in Rechnung gestellt wird. Hierbei wird der/die Logopäd:in mögliche Aufwendungen, die die Praxis in Folge des Therapieausfalls erspart hat, in Abzug bringen.';
  printParagraph(paragraphFour);
  const paragraphFive = '5. Die Patientin/der Patient verpflichtet sich, die Logopädin/den Logopäden umgehend über Änderungen der Kontaktdaten (Adresse/Telefonnummer/E-Mail Adresse) zu informieren.';
  printParagraph(paragraphFive);
  const paragraphSix = '6. Die Logopädin/der Logopäde erhebt die personenbezogene Daten ausschließlich im Rahmen der geltenden Datenschutzbestimmungen zum Zwecke der Gesundheitsbehandlung, Dokumentation und Abrechnung der erbrachten Leistungen mit den gesetzlichen Krankenkassen nach § 302 SGB V. Die gesetzlich zugelassenen Rechenzentren wurden im Rahmen der Auftragsdatenverarbeitung zur Einhaltung der Datenschutzbestimmungen verpflichtet. ';
  printParagraph(paragraphSix);
  const paragraphSeven = '7. Durch die Unterschrift bestätigt die Patientin/ der Patient, eine Kopie des Vertrages erhalten zu haben.';
  printParagraph(paragraphSeven);

  const today = dayjs.utc(new Date()).format('DD.MM.YYYY');

  doc.text('Arnsberg, den ' + today, 13, nextLine(8));
  doc.text('________________________', 70, currentLine);
  doc.text('________________________', 135, currentLine);
  doc.text('Praxisstempel', 70, nextLine());
  doc.text('Unterschrift Patient:in ', 135, currentLine);
  doc.text('Unterschrift Logopäd:in', 70, nextLine());
  doc.text('Eltern / Betreuer:in    ', 135, currentLine);
  printFooter();
  return doc;
};