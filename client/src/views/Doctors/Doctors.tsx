/** @jsxRuntime classic */
/** @jsx jsx */
import { Spinner } from '@chakra-ui/react';
import { jsx } from '@emotion/react';
import { connect } from 'react-redux';
import DoctorList from '../../components/Doctors/DoctorList';
import { useAllDoctors } from '../../hooks/doctor';

function Doctors(): JSX.Element {
  const { isLoading, error, doctors } = useAllDoctors();

  return isLoading ? (
    <Spinner />
  ) : !doctors.length ? (
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
      <DoctorList doctors={doctors} />
    </div>
  );
}

export default connect(null, null)(Doctors);
