import { Icon } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RiCheckboxBlankLine, RiCheckLine } from 'react-icons/ri';
import { Patient } from '../../types/Patient';
import { Input, Label, ModalFormGroup, TextDisplay } from '../Library';

interface PatientFormProps {
  patient: Patient
  type: 'create' | 'update' | 'view'
  onChange: (patient: Patient) => void
}

type PatientKey = keyof Patient;

const PatientKeysToShow: PatientKey[] = [
  'lastName',
  'gender',
  'street',
  'zip',
  'city',
  'notices',
  'careFacility',
  'isAddpayFreed',
  'careFacility',
  'medicalReport',
];

export const PatientForm = ({ patient, type = 'view', onChange }: PatientFormProps) => {
  const { t } = useTranslation();
  const [currentPatient, setCurrentPatient] = useState<Patient>(() => ({...patient}));

  interface OnInputChangeProps {
    event: React.FormEvent<HTMLInputElement>
    key: PatientKey
  }

  function onInputChange({event, key}: OnInputChangeProps) {
    event.preventDefault();
    setCurrentPatient(patient => ({...patient, [`${key}`]: event.currentTarget.value}));
  }

  useEffect(() => {
    onChange(currentPatient);
  }, [currentPatient]);

  return (
    <>
      {Object.keys(currentPatient)
        .filter(
          (key) =>
            PatientKeysToShow.findIndex((element) => element === key) !== -1
        )
        .map((key) =>
          typeof currentPatient[key as keyof Patient] === 'string' ||
          typeof currentPatient[key as keyof Patient] === 'boolean' ? (
              <ModalFormGroup key={key}>
                <Label htmlFor={key}>{t(`patients.${key}`)}</Label>
                {typeof currentPatient[key as PatientKey] === 'boolean' ? (
                  <Icon
                    id={key}
                    as={
                      currentPatient[key as PatientKey]
                        ? RiCheckLine
                        : RiCheckboxBlankLine
                    }
                    w={5}
                    h={5}
                    color={currentPatient[key as PatientKey] ? 'indigo' : 'gray.400'}
                  />
                ) :
                  type === 'view' ? (
                    <TextDisplay id={key}>
                      {currentPatient[key as PatientKey]?.toString()}&nbsp;
                    </TextDisplay>
                  ) : (
                    <Input onChange={(e) => onInputChange({event: e, key: key as PatientKey})} id={key} value={currentPatient[key as PatientKey]?.toString()}></Input>
                  )}
              </ModalFormGroup>
            ) : null
        )}
      <b>Termine:</b>{currentPatient.events && currentPatient.events.map(event => <div key={event.uuid}>{event.startTime}</div>)}
    </>
  );
};