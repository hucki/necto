import React from 'react';
import { useAllArchivedPatients, usePatients } from '../../hooks/patient';
import { FullPageSpinner } from '../../components/atoms/LoadingSpinner';
import { flattenJsonRecursively, jsonToCsv } from '../../helpers/dataConverter';

function PatientData(): JSX.Element {
  const { isLoading, rawPatients: patients } = usePatients({
    includes: 'contactData',
  });
  const { isLoading: isLoadingArchivedPatients, archivedPatients } =
    useAllArchivedPatients();
  const isPending = isLoading || isLoadingArchivedPatients;

  const handleOnClick = (type: 'patients' | 'archivedPatients') => {
    const data = type === 'patients' ? patients : archivedPatients;
    const flattendData: Record<string, never>[] = [];
    data.forEach((item) => {
      const flattened = {};
      flattenJsonRecursively(item, flattened);
      flattendData.push(flattened);
    });
    const csv = jsonToCsv(flattendData);
    const blob = new Blob([csv], { type: 'application/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const buttonStyle = {
    margin: '1rem',
    padding: '0.5rem',
    fontSize: '1rem',
    backgroundColor: 'lightblue',
    borderRadius: '5px',
    border: 'none',
  };
  return isPending ? (
    <FullPageSpinner />
  ) : (
    <>
      <button onClick={() => handleOnClick('patients')} style={buttonStyle}>
        Download Patients (csv)
      </button>
      <button
        onClick={() => handleOnClick('archivedPatients')}
        style={buttonStyle}
      >
        Download archived Patients (csv)
      </button>
    </>
  );
}

export default PatientData;
