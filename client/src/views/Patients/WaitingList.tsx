import React from 'react';
import { PersonListWrapper } from '../../components/atoms/Wrapper';
import PersonList from '../../components/organisms/Person/PersonList';
import { useAllWaitingPatients } from '../../hooks/patient';
import { FullPageSpinner } from '../../components/atoms/LoadingSpinner';

function WaitingList(): JSX.Element {
  const { isLoading, patients } = useAllWaitingPatients();
  const waitingPatients = patients.map((patient, index) => ({
    numberInLine: index + 1,
    ...patient,
  }));

  return isLoading ? (
    <FullPageSpinner />
  ) : (
    <PersonListWrapper>
      <PersonList persons={waitingPatients} listType="waitingPatients" />
    </PersonListWrapper>
  );
}

export default WaitingList;
