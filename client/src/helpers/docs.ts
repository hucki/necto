import jsPDF from 'jspdf';
import { Person } from '../types/Person';

export const contract = (p: Person) => {
  const topOffset = 80;
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
  doc.setFontSize(22);
  doc.text('Behandlungsvertrag', 105, topOffset, {align: 'center'} );
  doc.setFontSize(12);
  doc.text('zwischen', 10, nextParagraph());
  console.log(doc.getFont());
  doc.setFont('helvetica', 'bold');
  doc.text('Mundwerk Logopädische Praxis', 10, nextParagraph(), {align: 'center'});
  doc.text('Anja Wette, Logopädin & Sabine Huckschlag, Logopädin (Partnerschaft)', 10, nextLine());
  doc.text('Neumarkt 7', 10, nextLine());
  doc.text('59821 Arnsberg', 10, nextLine());
  doc.setFont('helvetica', 'normal');
  doc.text('und', 10, nextParagraph());
  doc.text(p.lastName + ', ' + p.firstName, 10, nextParagraph());
  doc.text(p.street + ', ' + p.zip + ' '+p.city, 10, nextLine());

  return doc;
};