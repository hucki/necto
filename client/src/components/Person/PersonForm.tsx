import { Checkbox, Divider, GridItem, Icon, SimpleGrid } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RiCheckboxBlankLine, RiCheckLine } from 'react-icons/ri';
import { getDisplayName } from '../../helpers/displayNames';
import { useAllDoctors } from '../../hooks/doctor';
import { useViewport } from '../../hooks/useViewport';
import { Doctor } from '../../types/Doctor';
import { Patient } from '../../types/Patient';
import { Person } from '../../types/Person';
import { Input, Label, ModalFormGroup, Select, TextDisplay } from '../Library';
import { AppointmentList } from '../List/Appointments';

interface PersonFormProps {
  person: Person
  type: 'create' | 'update' | 'view'
  personType: 'doctor' | 'patient'
  onChange: (person: Person) => void
};



export const PersonForm = ({person, type = 'view', personType = 'patient', onChange}: PersonFormProps) => {
  const { isMobile } = useViewport();
  const { t } = useTranslation();
  const { isLoading, error, doctors } = useAllDoctors();
  const [currentPerson, setCurrentPerson] = useState<Doctor | Patient>(() => ({...person}));
  const currentPatient = personType !== 'doctor' ? currentPerson as Patient : undefined;

  const isWaitingPatient = (person: Person): person is Patient => {
    if ('firstContactedAt' in person) return true;
    return false;
  };

  type PersonKey = keyof Patient;

  const sharedAutoFields: PersonKey[] = [
    'firstName',
    'lastName',
    'street',
    'zip',
    'city',
  ];

  const patientAutoFields: PersonKey[] = [
    'gender',
    'notices',
    'careFacility',
    'isAddpayFreed',
    'careFacility',
    'medicalReport',
  ];

  const autoFormFieldKeys = personType !== 'doctor' ? sharedAutoFields.concat(patientAutoFields) : sharedAutoFields;

  interface OnInputChangeProps {
    event: React.FormEvent<HTMLInputElement>
    key: PersonKey
  }

  function onInputChange({event, key}: OnInputChangeProps) {
    event.preventDefault();
    setCurrentPerson(person => ({...person, [`${key}`]: event.currentTarget.value}));
  }
  function onCheckboxChange({event, key}: OnInputChangeProps) {
    event.preventDefault();
    setCurrentPerson(person => ({...person, [`${key}`]: event.currentTarget.checked}));
  }

  interface OnSelectChangeProps {
    event: React.FormEvent<HTMLSelectElement>
    key: PersonKey
  }

  function onSelectChange({event, key}: OnSelectChangeProps) {
    event.preventDefault();
    const val = event.currentTarget.value === 'remove' ? null : event.currentTarget.value;
    setCurrentPerson(person => ({...person, [`${key}`]: val}));
  }

  useEffect(() => {
    onChange(currentPerson);
  }, [currentPerson]);

  const autoFormFields = () => {
    return Object.keys(currentPerson)
      .filter(
        (key) =>
          autoFormFieldKeys.findIndex((element) => element === key) !== -1
      )
      .map((key) =>
        typeof currentPerson[key as keyof Person] === 'string' ||
        typeof currentPerson[key as keyof Person] === 'boolean' ? (
            <ModalFormGroup key={key}>
              <Label htmlFor={key}>{t(`label.${key}`)}</Label>
              {typeof currentPerson[key as keyof Person] === 'boolean'
                ? type === 'view'
                  ? (<Icon
                    id={key}
                    as={
                      currentPerson[key as keyof Person]
                        ? RiCheckLine
                        : RiCheckboxBlankLine
                    }
                    w={5}
                    h={5}
                    color={currentPerson[key as keyof Person] ? 'indigo' : 'gray.400'}
                  />)
                  : (<Checkbox
                    id={key}
                    name={key}
                    size="lg"
                    my={2}
                    isChecked={currentPerson[key as keyof Person] ? true : false}
                    onChange={(e) => onCheckboxChange({event: e, key: key as keyof Person})}
                  />)
                : type === 'view'
                  ? (<TextDisplay id={key}>
                    {currentPerson[key as keyof Person]?.toString()}&nbsp;
                  </TextDisplay>)
                  : (<Input
                    onChange={(e) => onInputChange({event: e, key: key as keyof Person})}
                    id={key}
                    value={currentPerson[key as keyof Person]?.toString()}>
                  </Input>)}
            </ModalFormGroup>
          ) : null
      );
  };

  return (
    <>
      <SimpleGrid columns={[1, null, 2]} gap={6}>
        <GridItem>{autoFormFields()}</GridItem>
        <GridItem>
          {personType !== 'doctor' && currentPatient && (
            <>
              <ModalFormGroup>
                <Label htmlFor="doctorId">{t('label.doctor')}</Label>
                {type === 'view' ? (
                  <TextDisplay id="doctorId">
                    {currentPatient['doctor'] && getDisplayName(currentPatient['doctor'])}
                  </TextDisplay>
                ) : (
                  <>
                    <Select
                      name="employee"
                      value={currentPatient['doctorId']}
                      onChange={(e) => onSelectChange({event: e, key: 'doctorId'})}
                    >
                      <option value={'remove'}>No Doctor</option>
                      {doctors.map((t, i) => (
                        <option key={i} value={t.uuid}>
                          {t.firstName + ' ' + t.lastName}
                        </option>
                      ))}
                    </Select>
                  </>
                )}
              </ModalFormGroup>
              <Divider m="1" />
              {currentPatient.events?.length
                ? <>
                  <b style={{marginLeft: '0.5rem'}}>{t('label.appointments')}:</b>
                  <AppointmentList events={currentPatient.events}/>
                </>
                : <b style={{marginLeft: '0.5rem'}}>{t('label.no') + ' ' + t('label.appointments')}</b>
              }
            </>
          )}
        </GridItem>
      </SimpleGrid>
    </>
  );
};