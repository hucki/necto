/** @jsxRuntime classic */
/** @jsx jsx */
import { Spinner } from '@chakra-ui/react';
import { jsx } from '@emotion/react';
import { connect } from 'react-redux';
import PersonList from '../../components/Person/PersonList';
import { useAllPatients } from '../../hooks/patient';

function Patients(): JSX.Element {
  const { isLoading, error, patients } = useAllPatients();

  return isLoading ? (
    <Spinner />
  ) : !patients.length ? (
    <div>no data available</div>
  ) : (
    <div
      css={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}
    >
      <PersonList persons={patients} type="patients" />
    </div>
  );
}

export default connect(null, null)(Patients);
