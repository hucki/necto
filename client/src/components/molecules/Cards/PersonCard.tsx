import styled from '@emotion/styled/macro';
import dayjs from 'dayjs';
import React from 'react';
import { FaBirthdayCake, FaExclamation } from 'react-icons/fa';
import { getDisplayName } from '../../../helpers/displayNames';
import { Patient } from '../../../types/Patient';
import { Person } from '../../../types/Person';
import { ContactDataDisplay } from '../DataDisplay/ContactData';

interface PersonCardContainerProps {
  hasBorder: boolean;
}
const PersonCardContainer = styled.div((p: PersonCardContainerProps) => ({
  display: 'grid',
  minWidth: '350px',
  gridTemplateColumns: '42px auto auto',
  gridTemplateRows: '1fr 1fr',
  gridTemplateAreas: `"avatar name name phone phone"
  "avatar address address birthday birthday"`,
  border: p.hasBorder ? '1px solid #3333' : 'none',
  borderRadius: '0.25rem',
  padding: '0.2rem',
  fontSize: '0.75rem',
  '.name': {
    fontWeight: 'bold',
  },
}));
const AvatarContainer = styled.div({
  backgroundColor: 'grey',
  color: 'white',
  fontSize: '1rem',
  textAlign: 'center',
  placeSelf: 'center',
  width: '32px',
  height: '32px',
  lineHeight: '32px',
  gridArea: 'avatar',
  borderRadius: '50%',
});
interface PersonCardProps {
  person: Person;
  hasBorder?: boolean;
  // eslint-disable-next-line no-unused-vars
  handleClickPerson?: ({ person }: { person: Person }) => void;
}
export const PersonCard = ({
  person,
  hasBorder = false,
  handleClickPerson,
}: PersonCardProps) => {
  const currentPhones =
    person.contactData &&
    person.contactData.filter((c) => c.type === 'telephone');

  const onClickedPerson = () => {
    handleClickPerson ? handleClickPerson({ person }) : console.log('');
  };

  const isPatient = (person: Person): person is Patient => {
    if ('firstContactAt' in person) return true;
    return false;
  };

  return (
    <>
      <PersonCardContainer onClick={onClickedPerson} hasBorder={hasBorder}>
        <div
          className="name"
          style={{
            gridArea: 'name',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {isPatient(person) && !person.hasContract && (
            <FaExclamation key="noContractIcon" color="red" />
          )}
          {getDisplayName({ person, type: 'full' })}
        </div>
        {isPatient(person) && person.birthday && (
          <div
            className="birthday"
            style={{
              gridArea: 'birthday',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            {person.birthday && <FaBirthdayCake />}
            {dayjs(person.birthday).format('ll')}
          </div>
        )}
        {isPatient(person) && person.institution ? (
          <div
            className="institution"
            style={{
              gridArea: 'address',
            }}
          >
            {person.institution.name +
              ' ' +
              (person.institution.description
                ? `(${person.institution.description})`
                : null)}
          </div>
        ) : (
          <div
            className="address"
            style={{
              gridArea: 'address',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {person.street + ', ' + person.city}
          </div>
        )}
        {currentPhones && (
          <div
            className="phones"
            style={{
              gridArea: 'phone',
            }}
          >
            <ContactDataDisplay contactData={currentPhones} />
          </div>
        )}
        <AvatarContainer>
          {person.firstName.substring(0, 1).toUpperCase() +
            person.lastName.substring(0, 1).toUpperCase()}
        </AvatarContainer>
      </PersonCardContainer>
    </>
  );
};