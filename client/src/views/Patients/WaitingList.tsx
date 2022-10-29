import React from 'react';
import { Spinner } from '@chakra-ui/react';
import { PersonListWrapper } from '../../components/atoms/Wrapper';
import PersonList from '../../components/organisms/Person/PersonList';
import { useAllWaitingPatients } from '../../hooks/patient';

function WaitingList(): JSX.Element {
  const { isLoading, patients } = useAllWaitingPatients();
  const waitingPatients = patients.map((patient, index) => ({
    numberInLine: index + 1,
    ...patient,
  }));

  return isLoading ? (
    <Spinner />
  ) : !patients.length ? (
    <div>no data available</div>
  ) : (
    <PersonListWrapper>
      <PersonList persons={waitingPatients} />
    </PersonListWrapper>
  );
}

export default WaitingList;
