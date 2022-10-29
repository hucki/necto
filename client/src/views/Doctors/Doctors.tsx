import React from 'react';
import { Spinner } from '@chakra-ui/react';
import { connect } from 'react-redux';
import PersonList from '../../components/organisms/Person/PersonList';
import { useAllDoctors } from '../../hooks/doctor';
import { PersonListWrapper } from '../../components/atoms/Wrapper';

function Doctors(): JSX.Element {
  const { isLoading, doctors } = useAllDoctors();

  return isLoading ? (
    <Spinner />
  ) : !doctors.length ? (
    <div>no data available</div>
  ) : (
    <PersonListWrapper>
      <PersonList persons={doctors} />
    </PersonListWrapper>
  );
}

export default connect(null, null)(Doctors);
