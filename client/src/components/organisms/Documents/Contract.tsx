import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Patient } from '../../../types/Patient';
import { getAddpayForTags } from '../Patients/AddpayForm';
import dayjs from 'dayjs';
import { Company } from '../../../types/Company';
import { getDisplayName } from '../../../helpers/displayNames';
import { Doctor } from '../../../types/Doctor';

interface ContractProps {
  p: Patient;
  c: Company;
}
/**
 * creates a contract to be printed and signed by
 * the patient before starting the therapy
 * @param {Patient} p - patient to print the contract for
 * @param {Company} c - company
 * @returns {JSX.Element} JSX.Element containing a PDF doc
 */
export const Contract = ({ p, c }: ContractProps) => {
  const addPay = getAddpayForTags({
    addpayFreedom: p.addpayFreedom || [],
    currentYear: dayjs().year(),
    onlyCurrentYear: true,
  });
  // Create styles
  const styles = StyleSheet.create({
    page: {
      padding: '100 40 50 40',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Helvetica',
      fontSize: '12pt',
    },
    heading: {
      margin: '20 0 20 0',
      fontSize: '16pt',
      width: '100%',
    },
    singleLine: {
      marginTop: 10,
    },
    footer: {
      position: 'absolute',
      fontSize: 8,
      bottom: 25,
      color: 'grey',
    },
    leftFooter: {
      left: 40,
      textAlign: 'left',
    },
    rightFooter: {
      right: 40,
      textAlign: 'right',
    },
    section: {
      marginTop: 20,
      gap: 10,
    },
    sectionMarker: {
      margin: -10,
      padding: '2px 10px',
      fontWeight: 'bold',
      backgroundColor: '#3333',
    },
    privateSection: {
      padding: 10,
      border: '1px solid #3333',
      borderRadius: '5px',
      display: 'flex',
      flexDirection: 'column',
    },
    endSection: {
      padding: 10,
      display: 'flex',
      flexDirection: 'row',
    },
  });
  const today = dayjs.utc(new Date()).format('DD.MM.YYYY');
  const addPayInfo = addPay
    .map((item) => item.year + ': ' + (item.addpayFreed ? 'ja' : 'nein'))
    .join();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={{ ...styles.section, ...styles.heading }}>
          <Text>Behandlungsvertrag</Text>
        </View>
        <View style={styles.singleLine}>
          <Text>zwischen</Text>
        </View>
        <View style={styles.section}>
          <Text>{c?.name || '__________________________'}</Text>
          <Text>{c?.name2 || '__________________________'} </Text>
          <Text>{c?.street || '__________________________'} </Text>
          <Text>
            {c?.city ? c.zip + ' ' + c?.city : '__________________________'}
          </Text>
          <Text>-im Folgenden Logopäd:in genannt-</Text>
        </View>
        <View style={styles.singleLine}>
          <Text>und</Text>
        </View>
        <View style={styles.section}>
          <Text>{p.lastName + ', ' + p.firstName}</Text>
          <Text>
            Name der Eltern/Erziehungsberechtigten
            ___________________________________
          </Text>
          <Text>{p.street || '__________________________ '}</Text>
          <Text>
            {p.city ? p.zip + ' ' + p.city : '__________________________'}
          </Text>
          <Text>
            {'Versicherung: ' + (p.insurance || '__________________________')}
          </Text>
          <Text>{'befreit: ' + addPayInfo || 'nein'}</Text>
        </View>
        <View style={styles.section}>
          <Text>
            1. Die Vertragsparteien schließen einen Vertrag über die Erbringung
            logopädischer Leistungen. Das Behandlungsverhältnis beginnt mit der
            Durchführung der Verordnung von
          </Text>
        </View>
        <View style={styles.singleLine}>
          <Text>
            {(p.doctorId
              ? getDisplayName({ person: p.doctor as Doctor, type: 'full' })
              : 'Frau (Dr.) / Herrn (Dr.) __________________________') +
              ' vom ' +
              '__________________________'}
          </Text>
        </View>
        <View style={styles.section}>
          <Text>
            Das Vertragsverhältnis wird auf unbestimmte Zeit geschlossen und
            umfasst alle folgenden Verordnungen sowie Verordnungen aufgrund
            neuer Behandlungsfälle, egal von welcher Ärztin bzw. welchem Arzt
            verordnet.
          </Text>
        </View>
        <View style={{ ...styles.section, ...styles.privateSection }}>
          <Text style={styles.sectionMarker}>privat versichert:</Text>
          <Text>
            Das Vertragsverhältnis kann jederzeit unter Einhaltung einer
            24-stündigen Frist zum nächsten Behndlungstermin gekündigt werden.
            Hiervon ausgenommen ist die außerordentliche Kündigung. Für die
            Wirksamkeit der Vereinbarung über die Höhe der Vergütung ist es ohne
            Belang, ob und in welcher Form der/die Patient:in einen
            Erstattungsanspruch gegen ein Krankenversicherungsunternehmen
            und/oder Beihilfestelle oder sonstige Kostenträger besitzt.
          </Text>
          <Text>
            2a. Es gelten die beihilfefähigen Vergütungssätze. Es ist der/dem
            Logopäd:in unbekannt, ob der/die Patient:in einen
            Erstattungsanspruch aus einem Versicherungsvertrag hat und in
            welcher Höhe. Der/die Logopäd:in empfiehlt dringend, soweit nicht im
            Vorfeld geschehen, umgehend die Kostenerstattung durch die
            Krankenversicherung zu klären.
          </Text>
        </View>
        <View style={{ ...styles.section, ...styles.privateSection }}>
          <Text style={styles.sectionMarker}>gesetzlich versichert:</Text>
          <Text>
            2b. Der/die Logopäd:in weist den/die Patient:in auf die
            Zuzahlungspflicht gemäß § 32 Abs. 2 SGB V i.V.m. § 61 Satz 3 SGB V
            hin. Nach dieser gesetzlichen Regelung haben Patient:innen, die das
            18. Lebensjahr vollendet haben, 10 Prozent der Kosten sowie 10 Euro
            je Verordnung selbst zu zahlen, soweit sie auf ihren Antrag nicht
            von der Zuzahlung befreit sind. Kinder und Jugendliche unter 18
            Jahren sind immer von der Zuzahlung befreit.
          </Text>
          <Text>
            Der/die Patient:in erklärt ausdrücklich die Einwilligung, dass
            der/die Logopäd:in aus dem geschlossenen Behandlungsvertrag
            entstehenden Honoraransprüche zum Zwecke der Rechnungsstellung und
            Einziehung der Forderung an die folgende Verrechnungsstelle abtritt.
          </Text>
          <Text>
            NOVENTI Healthcare GmbH <br />
            Geschäftsbereich AZH <br />
            Einsteinring 41-43 <br />
            85609 Aschheim bei München <br />
          </Text>
        </View>
        <View>
          <Text style={styles.section}>
            3. Die Zuzahlung / der Rechnungsbetrag ist spätestens 4 Wochen nach
            Rechnungseingang auf das folgende Konto zu zahlen:
          </Text>
        </View>
        <View style={{ ...styles.section }}>
          <Text>
            {'Kontoinhaber: ' + (c?.name || '__________________________')}
          </Text>
          <Text>
            {'IBAN:   ' + (c?.bankIban || '___________________________')}
          </Text>
          <Text>{'BIC:    ' + (c?.bankBic || '_______________')}</Text>
        </View>
        <View style={styles.section}>
          <Text>
            Im Falle der Nichteinhaltung der o.g. Zahlungsfrist ist der
            Rechnungsbetrag nach den gesetzlichen Vorschriften zu verzinsen.
          </Text>
        </View>
        <View style={styles.section}>
          <Text>
            4. Der Erfolg einer logopädischen Behandlung hängt wesentlich von
            der aktiven Teilnahme des/der Patient:in ab. Daher ist wichtig, die
            vereinbarten Termine zuverlässig wahrzunehmen. Die Terminabsprache
            dient zwar auch der Sicherung eines zeitgemäßen Behandlungsablaufs.
            Die logopädische Praxis ist jedoch eine reine Bestellpraxis, da die
            Behandlungssituation die persönliche Gegenwart des/der behandelnden
            Logopäd:in zwingend voraussetzt. Die vereinbarten Zeiten sind
            ausschließlich für die jeweiligen Patient:innen reserviert.
          </Text>
          <Text>
            Die Vertragsparteien vereinbaren für den Fall, dass der/die
            Patient:in einen vereinbarten Termin nicht wahrnehmen kann und
            den/die Logopäd:in nicht spätestens 24 Stunden vor dem vereinbarten
            Termin hierüber informiert, dass dem/der Patient:in der übliche
            Kassensatz bzw. bei privater Verordnung die beihilfefähigen
            Vergütungssätze als Ausfallgebühr privat in Rechnung gestellt wird.
            Hierbei wird der/die Logopäd:in mögliche Aufwendungen, die die
            Praxis in Folge des Therapieausfalls erspart hat, in Abzug bringen.
          </Text>
        </View>
        <View style={styles.section}>
          <Text>
            5. Der/die Patient:in verpflichtet sich, den/die Logopäd:in umgehend
            über Änderungen der Kontaktdaten (Adresse/Telefonnummer/E-Mail
            Adresse) zu informieren.
          </Text>
        </View>
        <View style={styles.section}>
          <Text>
            6. Der/die Logopäd:in erhebt die personenbezogene Daten
            ausschließlich im Rahmen der geltenden Datenschutzbestimmungen zum
            Zwecke der Gesundheitsbehandlung, Dokumentation und Abrechnung der
            erbrachten Leistungen mit den gesetzlichen Krankenkassen nach § 302
            SGB V. Die gesetzlich zugelassenen Rechenzentren wurden im Rahmen
            der Auftragsdatenverarbeitung zur Einhaltung der
            Datenschutzbestimmungen verpflichtet.
          </Text>
        </View>
        <View style={styles.section}>
          <Text>
            7. Durch die Unterschrift bestätigt der/die Patient:in, eine Kopie
            des Vertrages erhalten zu haben.
          </Text>
        </View>
        <View style={styles.section}>
          <Text>Arnsberg, den {today}</Text>
        </View>
        <View style={{ ...styles.section, ...styles.endSection }}>
          <div>
            <Text>________________________</Text>
            <Text>Praxisstempel</Text>
            <Text>Unterschrift Logopäd:in</Text>
          </div>
          <div>
            <Text>________________________</Text>
            <Text>Unterschrift Patient:in</Text>
            <Text>Eltern / Betreuer:in</Text>
          </div>
        </View>

        <Text
          style={{ ...styles.footer, ...styles.rightFooter }}
          render={({ pageNumber, totalPages }) =>
            `Behandlungsvertrag Mundwerk Seite ${pageNumber} / ${totalPages}`
          }
          fixed
        />
        <Text
          style={{ ...styles.footer, ...styles.leftFooter }}
          render={() => ` ${p.lastName}, ${p.firstName} - ${today}`}
          fixed
        />
      </Page>
    </Document>
  );
};
