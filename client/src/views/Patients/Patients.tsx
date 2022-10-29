import React from 'react';
import { Spinner } from '@chakra-ui/react';
import { connect } from 'react-redux';
import PersonList from '../../components/organisms/Person/PersonList';
import { useAllPatients } from '../../hooks/patient';
import { PersonListWrapper } from '../../components/atoms/Wrapper';

function Patients(): JSX.Element {
  const { isLoading, patients } = useAllPatients();

  return isLoading ? (
    <Spinner />
  ) : !patients.length ? (
    <div>no data available</div>
  ) : (
    <PersonListWrapper>
      <PersonList persons={patients} />
    </PersonListWrapper>
  );
}

export default connect(null, null)(Patients);
