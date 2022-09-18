import { Doctor } from '../types/Doctor';
import { Patient } from '../types/Patient';

export const getDisplayName = (p: Patient | Doctor) => {
  const title = p.title ? p.title + ' ' : '';
  const firstNameInitial = p.firstName
    ? p.firstName.substring(0, 1) + '. '
    : '';
  const lastName = p.lastName ? p.lastName : '';
  if ('firstContactAt' in p) {
    // Patient
    return title + firstNameInitial + lastName;
  } else {
    // Doctor
    return title + firstNameInitial + lastName;
  }
};
