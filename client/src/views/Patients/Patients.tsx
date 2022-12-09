import React from 'react';
import PersonList from '../../components/organisms/Person/PersonList';
import { useAllPatients } from '../../hooks/patient';
import { PersonListWrapper } from '../../components/atoms/Wrapper';
import { FullPageSpinner } from '../../components/atoms/LoadingSpinner';

function Patients(): JSX.Element {
  const { isLoading, patients } = useAllPatients();

  return isLoading ? (
    <FullPageSpinner />
  ) : (
    <PersonListWrapper>
      <PersonList persons={patients} listType="patients" />
    </PersonListWrapper>
  );
}

export default Patients;
