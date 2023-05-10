import { Doctor } from './Doctor';
import { Patient, WaitingPatient } from './Patient';

export type Person = Doctor | Patient | WaitingPatient;

export const isWaitingPatient = (person: Person): person is WaitingPatient => {
  if ('numberInLine' in person) return true;
  return false;
};

export const isPatient = (person: Person): person is Patient => {
  if ('firstContactAt' in person) return true;
  return false;
};

export const isDoctor = (person: Person): person is Doctor => {
  if (!isWaitingPatient(person) && !isPatient(person)) return true;
  return false;
};
