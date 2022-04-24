import { DoctorContactData } from "./ContactData";
import { Patient } from "./Patient";

export type Doctor = {
  uuid?: string;
  firstName: string;
  lastName: string;
  title?: string;
  street?: string;
  zip?: string;
  city?: string;
  contactData?: DoctorContactData[];
  patients?: Patient[];
}

export type DoctorInput = Doctor & {
  telephoneNumber?: string;
  mailAddress?: string;
}