import React from 'react';
import { usePatients } from '../../../hooks/patient';
import { PersonCard } from '../../molecules/Cards/PersonCard';
export const InstitutionsPatients = ({
  institutionId,
}: {
  institutionId: string;
}) => {
  const { rawPatients: patients } = usePatients({
    filter: { institutionId },
    includes: 'contactData',
  });
  return (
    <>
      {!patients.length ? (
        <div className="test">no patients</div>
      ) : (
        patients.map((p, i) => <PersonCard person={p} key={i} />)
      )}
    </>
  );
};
