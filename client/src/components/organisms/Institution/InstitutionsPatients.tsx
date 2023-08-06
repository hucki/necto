import React from 'react';
import { useFilteredPatients } from '../../../hooks/patient';
import { PersonCard } from '../../molecules/Cards/PersonCard';
export const InstitutionsPatients = ({
  institutionId,
}: {
  institutionId: string;
}) => {
  const { patients } = useFilteredPatients({ institutionId });
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
