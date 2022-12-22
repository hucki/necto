import { ContactData } from './ContactData';
import { Patient } from './Patient';

export type Doctor = {
  uuid?: string;
  firstName: string;
  lastName: string;
  title?: string;
  street?: string;
  zip?: string;
  city?: string;
  contactData?: ContactData[];
  patients?: Patient[];
  archived?: boolean;
};
