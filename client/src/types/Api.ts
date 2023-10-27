import { Event } from './Event';
import { Patient } from './Patient';

export interface EventAPIData {
  type: string;
  attributes: Event;
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
export interface PatientAPIResponse {
  data: PatientAPIData[];
  jsonapi: {
    version: string;
  };
}
