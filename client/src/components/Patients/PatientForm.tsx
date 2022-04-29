import { GridItem, Icon, SimpleGrid } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RiCheckboxBlankLine, RiCheckLine } from 'react-icons/ri';
import { useViewport } from '../../hooks/useViewport';
import { Patient } from '../../types/Patient';
import { Input, Label, ModalFormGroup, TextDisplay } from '../Library';

interface PatientFormProps {
  patient: Patient
  type: 'create' | 'update' | 'view'
  onChange: (patient: Patient) => void
}

type PatientKey = keyof Patient;

const autoFormFieldKeys: PatientKey[] = [
  'firstName',
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
  const { isMobile } = useViewport();
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

  const autoFormFields = () => {
    return Object.keys(currentPatient)
      .filter(
        (key) =>
          autoFormFieldKeys.findIndex((element) => element === key) !== -1
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
      );
  };
  return (
    <>
      <SimpleGrid columns={[1, null, 2]} gap={6}>
        <GridItem>{autoFormFields()}</GridItem>
        <GridItem>
          <ModalFormGroup>
            <Label htmlFor="doctorId">{t('label.doctor')}</Label>
            {type === 'view' ? (
              <TextDisplay id="doctorId">
                {currentPatient['doctorId']}
              </TextDisplay>
            ) : (
              <Input id="doctorId" onChange={(e) => onInputChange({event: e, key: 'doctorId'})} value={currentPatient['doctorId']}></Input>
            )}
          </ModalFormGroup>
        </GridItem>
      </SimpleGrid>
      <b>Termine:</b>{currentPatient.events && currentPatient.events.map(event => <div key={event.uuid}>{event.startTime}</div>)}
    </>
  );
};