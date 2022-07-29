import { InstitutionContactData } from "./ContactData";
import { Patient } from "./Patient";

export type Institution = {
  uuid?: string;
  name: string;
  description: string;
  street?: string;
  zip?: string;
  city?: string;
  contactData?: InstitutionContactData[];
  patients?: Patient[];
}

export type InstitutionInput = Institution & {
  telephoneNumber?: string;
  mailAddress?: string;
}