import { InstitutionContactData } from './ContactData';
import { Patient } from './Patient';

export type Institution = {
  uuid?: string;
  name: string;
  description: string;
  street?: string;
  zip?: string;
  city?: string;
  contactData?: InstitutionContactData[];
  patients?: Patient[];
  archived?: boolean;
};

export type InstitutionInput = Institution & {
  telephoneNumber?: string;
  mailAddress?: string;
};
