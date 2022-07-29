import { PatientContactData } from './ContactData';
import { Doctor } from './Doctor';
import { Event } from './Event';
import { Institution } from './Institution';

export type Patient = {
  uuid?: string;
  firstName: string;
  lastName: string;
  title?: string;
  gender?: string;
  street?: string;
  zip?: string;
  city?: string;
  birthday?: Date;
  insurance?: string;
  insuranceNumber?: string;
  insuranceCardNumber?: string;
  insuranceCardValid?: string;
  notices?: string;
  appointmentRequest?: string;
  medicalReport?: string;
  careFacility?: string;
  state?: string;
  archived?: Boolean;
  hasPrescritpion?: Boolean;
  isWaitingAgain?: Boolean;
  hasContract?: Boolean;
  isAddpayFreed?: Boolean;
  addPayFreedFrom?: Date;
  addPayFreedUntil?: Date;
  validUntil?: Date;
  createdAt?: Date;
  firstContactAt?: Date;
  isWaitingSince?: Date;
  updatedAt?: Date;
  companyId?: string;
  tenantId?: string;
  doctorId?: string;
  institutionId?: string;
  contactData?: PatientContactData[];
  events?: Event[];
  doctor?: Doctor;
  institution?: Institution;
};

export type WaitingPatient = { numberInLine: number } & Patient

export interface PatientInput extends Patient {
  telephoneNumber?: string;
  mailAddress?: string;
}
