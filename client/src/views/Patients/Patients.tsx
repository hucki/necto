/** @jsxRuntime classic */
/** @jsx jsx */
import { Spinner } from '@chakra-ui/react';
import { jsx } from '@emotion/react';
import { connect } from 'react-redux';
import FilterBar from '../../components/FilterBar/FilterBar';
import { PatientsList } from '../../components/Patients/PatientsList';
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
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <FilterBar
        hasCompanyFilter
        hasBuildingFilter={false}
        hasTeamsFilter={false}
      />
      <PatientsList patients={patients} />
    </div>
  );
}

export default connect(null, null)(Patients);
