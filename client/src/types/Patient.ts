import { ContactData } from './ContactData';
import { Doctor } from './Doctor';
import { Event } from './Event';
import { Institution } from './Institution';

export type AddpayFreedom = {
  uuid?: string;
  pid: string;
  freedFrom: Date;
  freedUntil: Date;
};

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
  archived?: boolean;
  hasPrescritpion?: boolean;
  isWaitingAgain?: boolean;
  hasContract?: boolean;
  isAddpayFreed?: boolean;
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
  contactData?: ContactData[];
  events?: Event[];
  doctor?: Doctor;
  institution?: Institution;
  addpayFreedom?: AddpayFreedom[];
};

export type WaitingPatient = { numberInLine: number } & Patient;
