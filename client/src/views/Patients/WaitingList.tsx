/** @jsxRuntime classic */
/** @jsx jsx */
import { Spinner } from '@chakra-ui/react';
import { jsx } from '@emotion/react';
import { connect } from 'react-redux';
import PersonList from '../../components/Person/PersonList';
import { useAllWaitingPatients } from '../../hooks/patient';

function WaitingList(): JSX.Element {
  const { isLoading, error, patients } = useAllWaitingPatients();
  const waitingPatients = patients.map((patient, index) => ({numberInLine: index + 1, ...patient}));

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
      <PersonList persons={waitingPatients} />
    </div>
  );
}

export default connect(null, null)(WaitingList);
