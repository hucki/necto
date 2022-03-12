/** @jsxRuntime classic */
/** @jsx jsx */
import { Spinner } from '@chakra-ui/react';
import { jsx } from '@emotion/react';
import { connect } from 'react-redux';
import FilterBar from '../../components/FilterBar/FilterBar';
import PatientsList from '../../components/Patients/PatientsList';
import { useAllWaitingPatients } from '../../hooks/patient';

function WaitingList(): JSX.Element {
  const { isLoading, error, patients } = useAllWaitingPatients();

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
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      <FilterBar
        hasCompanyFilter
        hasBuildingFilter={false}
        hasTeamsFilter={false}
      />
      <PatientsList
        patients={patients}
        currentCompany={undefined}
        hasActions={false}
      />
    </div>
  );
}

export default connect(null, null)(WaitingList);
