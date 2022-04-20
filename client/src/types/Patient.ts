import { PatientContactData } from './ContactData';
import { Event } from './Event';

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
  careFacility?: string;
  state?: string;
  archived?: Boolean;
  isAddpayFreed?: Boolean;
  addPayFreedFrom?: Date;
  addPayFreedUntil?: Date;
  validUntil?: Date;
  createdAt?: Date;
  firstContactAt?: Date;
  updatedAt?: Date;
  companyId?: string;
  tenantId?: string;
  contactData?: PatientContactData[];
  events?: Event[];
};

export interface PatientInput extends Patient {
  telephoneNumber?: string;
  mailAddress?: string;
}
