import React from 'react';
import { usePDF } from '@react-pdf/renderer';
import { Contract } from '../organisms/Documents/Contract';
import { RiPrinterLine } from 'react-icons/ri';
import { Patient } from '../../types/Patient';
import dayjs from 'dayjs';
import { Company } from '../../types/Company';
import { IconButton } from './Buttons';

type PatientContractButtonProps = {
  patient: Patient;
  company: Company;
  handleReset: () => void;
};

export const PatientContractButton = ({
  patient,
  company,
  handleReset,
}: PatientContractButtonProps) => {
  const contractFileName = `vertrag_${(
    patient.lastName +
    '_' +
    patient.firstName
  ).replace(' ', '')}_${dayjs().format('YYYYMMDD')}.pdf`;

  const [instance] = usePDF({
    document: <Contract p={patient} c={company} />,
  });

  if (instance.error) return <div>Something went wrong: {instance.error}</div>;

  return (
    <>
      <IconButton
        disabled={instance.loading || !instance.url}
        aria-label="download"
        href={instance.url || ''}
        as="a"
        icon={<RiPrinterLine />}
        download={contractFileName}
        colorScheme="blue"
        onClick={handleReset}
      />
    </>
  );
};
