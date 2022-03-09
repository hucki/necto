import { PatientContactData } from './ContactData';

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
  isAddpayFreed?: Boolean;
  addPayFreedFrom?: Date;
  addPayFreedUntil?: Date;
  validUntil?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  companyId?: string;
  tenantId?: string;
  contactData?: PatientContactData[];
  events?: Event[];
};