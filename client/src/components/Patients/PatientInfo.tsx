import React from 'react';
import { Patient } from '../../types/Patient';

interface PatientInfoProps {
  patient: Patient
}

export const PatientInfo = ({patient}: PatientInfoProps) => {
  return (
    <>
      {Object.keys(patient).map((key) => typeof patient[key as keyof Patient] === 'string' ? <pre key={key}>{key + ': ' + patient[key as keyof Patient]}</pre> : null)}

    </>
  );
};