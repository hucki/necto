import { Doctor } from './Doctor';
import { Patient, WaitingPatient } from './Patient';

export type Person = Doctor | Patient | WaitingPatient;
