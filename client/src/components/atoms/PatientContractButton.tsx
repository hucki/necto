import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Contract } from '../organisms/Documents/Contract';
import { Patient } from '../../types/Patient';
import dayjs from 'dayjs';
import { Company } from '../../types/Company';
import { Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

type PatientContractButtonProps = {
  isDisabled: boolean;
  patient: Patient;
  company: Company;
  handleReset: () => void;
};

export const PatientContractButton = ({
  isDisabled,
  patient,
  company,
  handleReset,
}: PatientContractButtonProps) => {
  const { t } = useTranslation();
  const PrintBox = ({ isDisabled }: { isDisabled: boolean }) => {
    return (
      <Box
        borderRadius="md"
        bg={isDisabled ? 'lightslategrey' : 'darkolivegreen'}
        color={isDisabled ? 'darkolivegreen' : 'white'}
        h={10}
        w={24}
        p={2}
        textAlign="center"
        cursor={isDisabled ? 'not-allowed' : 'pointer'}
      >
        {t('label.printContract')}
      </Box>
    );
  };
  const contractFileName = `vertrag_${(
    patient.lastName +
    '_' +
    patient.firstName
  ).replace(' ', '')}_${dayjs().format('YYYYMMDD')}.pdf`;

  return (
    <PDFDownloadLink
      fileName={contractFileName}
      document={<Contract p={patient} c={company} />}
      onClick={handleReset}
    >
      <PrintBox isDisabled={isDisabled} />
    </PDFDownloadLink>
  );
};
