import { NewPerson, Person } from '../types/Person';

interface GetDisplayNameProps {
  person: Person | NewPerson;
  type: 'full' | 'short';
}
export const getDisplayName = ({ person, type }: GetDisplayNameProps) => {
  const title = person.title ? person.title + ' ' : '';
  const firstNameInitial = person.firstName
    ? person.firstName.substring(0, 1) + '. '
    : '';
  const firstName = type === 'full' ? person.firstName + ' ' : firstNameInitial;
  const lastName = person.lastName ? person.lastName : '';
  if ('firstContactAt' in person) {
    // Patient
    return title + firstName + lastName;
  } else {
    // Doctor
    return title + firstName + lastName;
  }
};
