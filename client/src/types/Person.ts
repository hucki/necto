import { Doctor, NewDoctor } from './Doctor';
import { NewPatient, Patient, WaitingPatient } from './Patient';

export type Person = Doctor | Patient | WaitingPatient;
export type NewPerson = NewDoctor | NewPatient;

export const isWaitingPatient = (
  person: Person | NewPerson
): person is WaitingPatient => {
  if ('numberInLine' in person) return true;
  return false;
};

export const isPatient = (
  person: Person | NewPerson
): person is Patient | NewPatient => {
  if ('firstContactAt' in person) return true;
  return false;
};

export const isDoctor = (
  person: Person | NewPerson
): person is Doctor | NewDoctor => {
  if (!isWaitingPatient(person) && !isPatient(person)) return true;
  return false;
};

export const isNewPerson = (
  person: Person | NewPerson
): person is NewPerson => {
  if (!person.uuid) return true;
  return false;
};
