import { Account } from './Accounts';
import { Event } from './Event';
import { Patient } from './Patient';
import { TimesheetEntry } from './Times';

export interface EventAPIData {
  type: string;
  attributes: Event;
}
export interface TimesAPIData {
  type: string;
  attributes: TimesheetEntry;
}
export interface AccountsAPIData {
  type: string;
  attributes: Account;
}
export interface PatientAPIData {
  type: string;
  attributes: Patient;
}
export interface EventAPIResponse {
  data: EventAPIData[];
  jsonapi: {
    version: string;
  };
}
export interface TimesAPIResponse {
  data: TimesAPIData[];
  jsonapi: {
    version: string;
  };
}
export interface AccountsAPIResponse {
  data: AccountsAPIData[];
  jsonapi: {
    version: string;
  };
}
export interface PatientAPIResponse {
  data: PatientAPIData[];
  jsonapi: {
    version: string;
  };
}
