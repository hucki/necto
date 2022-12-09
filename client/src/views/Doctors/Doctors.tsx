import React from 'react';
import PersonList from '../../components/organisms/Person/PersonList';
import { useAllDoctors } from '../../hooks/doctor';
import { PersonListWrapper } from '../../components/atoms/Wrapper';
import { FullPageSpinner } from '../../components/atoms/LoadingSpinner';

function Doctors(): JSX.Element {
  const { isLoading, doctors } = useAllDoctors();

  return isLoading ? (
    <FullPageSpinner />
  ) : (
    <PersonListWrapper>
      <PersonList persons={doctors} listType="doctors" />
    </PersonListWrapper>
  );
}

export default Doctors;
