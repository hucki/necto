import {
  ContactData,
  Doctor,
  Employee,
  Institution,
  Patient,
  Event,
} from '@prisma/client';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const ENCRYPTION_KEY: string = process.env.ENCRYPTION_KEY || ''; // Must be 256 bits (32 characters)
const IV_LENGTH: number = 16; // For AES, this is always 16

export const decryptContactData = (contactData) => {
  let decryptedContactData = [...contactData];
  for (let i = 0; i < decryptedContactData.length; i++) {
    decryptedContactData[i].contact = decryptedContactData[i].contact?.length
      ? decrypt(decryptedContactData[i].contact)
      : decryptedContactData[i].contact;
  }
  return decryptedContactData;
};

type PatientWithIncludes = Patient & {
  events: (Event & {
    employee: Employee;
  })[];
  contactData: ContactData[];
  doctor: Doctor;
  institution: Institution;
};
type DecryptPatientDataProps = {
  patient: Patient | PatientWithIncludes;
  fields: (keyof Patient)[];
};

export const decryptPatient = ({
  patient,
  fields,
}: DecryptPatientDataProps) => {
  let decryptedPatient: Patient | PatientWithIncludes = {
    ...patient,
  };
  for (let i = 0; i < fields.length; i++) {
    const key = fields[i];
    const value = decryptedPatient[key] as string;
    if (value && value.length) {
      decryptedPatient = {
        ...decryptedPatient,
        [key]: decrypt(value),
      };
    }
  }
  return decryptedPatient;
};

export const encrypt = (input: string) => {
  const iv = Buffer.from(crypto.randomBytes(IV_LENGTH))
    .toString('hex')
    .slice(0, IV_LENGTH);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let encrypted = cipher.update(input);

  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv + ':' + encrypted.toString('hex');
};

export const decrypt = (input: string) => {
  const textParts: string[] = input.includes(':') ? input.split(':') : [];
  const iv = Buffer.from(textParts.shift() || '', 'binary');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

export const encryptedPatientFields: (keyof Patient)[] = [
  'notices',
  'firstName',
  'lastName',
  /**
   * TODO: encrypt 'medicalReport'
   */
];

export const getEncryptedPatient = (patient) => {
  let encryptedPatient = {
    ...patient,
  };
  for (let i = 0; i < encryptedPatientFields.length; i++) {
    encryptedPatient[encryptedPatientFields[i]] = encryptedPatient[
      encryptedPatientFields[i]
    ]?.length
      ? encrypt(encryptedPatient[encryptedPatientFields[i]])
      : encryptedPatient[encryptedPatientFields[i]];
  }
  return encryptedPatient;
};
