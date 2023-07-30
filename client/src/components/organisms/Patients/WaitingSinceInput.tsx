import React from 'react';
import { Patient } from '../../../types/Patient';
import {
  Checkbox,
  FormControl,
  FormGroup,
  FormLabel,
  Input,
} from '../../Library';
import { usePatientEvents } from '../../../hooks/events';
import { OnInputChangeProps } from '../Person/PersonForm';
import { useTranslation } from 'react-i18next';

interface WaitingSinceInputProps {
  patient: Patient;
  // eslint-disable-next-line no-unused-vars
  onInputChange: ({ event, key }: OnInputChangeProps) => void;
  // eslint-disable-next-line no-unused-vars
  onCheckboxChange: ({ event, key }: OnInputChangeProps) => void;
  isDisabled: boolean;
  defaultValueIsWaitingSince?: string;
}

export const WaitingSinceInput = ({
  patient,
  onInputChange,
  onCheckboxChange,
  isDisabled,
  defaultValueIsWaitingSince,
}: WaitingSinceInputProps) => {
  const { t } = useTranslation();

  const { patientEvents } = usePatientEvents(patient.uuid);

  const isWaitingPatient = (): boolean => {
    if (patient.isWaitingAgain) return true;
    if (patient.archived) return false;
    if (!patientEvents?.length) return true;
    if (
      patientEvents.filter((event) => !event.isCancelled && !event.isDiagnostic)
        .length
    )
      return false;
    return false;
  };

  return (
    <FormGroup>
      <FormControl id="isWaitingSince">
        <Input
          autoComplete="off"
          type="date"
          disabled={isDisabled || !isWaitingPatient()}
          name="isWaitingSince"
          defaultValue={defaultValueIsWaitingSince}
          onBlur={(e) => onInputChange({ event: e, key: 'isWaitingSince' })}
        />
        <FormLabel>{t('label.isWaitingSince')}</FormLabel>
      </FormControl>
      <FormControl id="isWaitingAgain" style={{ textAlign: 'center' }}>
        <Checkbox
          name="isWaitingAgain"
          isDisabled={
            isDisabled || (!patient.isWaitingAgain && isWaitingPatient())
          }
          size="lg"
          my={2}
          isChecked={patient.isWaitingAgain ? true : false}
          onChange={(e) =>
            onCheckboxChange({ event: e, key: 'isWaitingAgain' })
          }
        />
        <FormLabel>{t('label.isWaitingAgain')}</FormLabel>
      </FormControl>
    </FormGroup>
  );
};
