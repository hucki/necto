import { Checkbox, Divider, GridItem, Icon, SimpleGrid } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CgAdd, CgMail, CgPhone } from 'react-icons/cg';
import { RiCheckboxBlankLine, RiCheckLine } from 'react-icons/ri';
import { getDisplayName } from '../../helpers/displayNames';
import { useCreatePatientContact } from '../../hooks/contact';
import { useAllDoctors } from '../../hooks/doctor';
import { useAllInstitutions } from '../../hooks/institution';
import { useViewport } from '../../hooks/useViewport';
import { ContactData } from '../../types/ContactData';
import { Doctor } from '../../types/Doctor';
import { Patient } from '../../types/Patient';
import { Person } from '../../types/Person';
import { IconButton, Input, Label, ModalFormGroup, Select, TextDisplay } from '../Library';
import { AppointmentList } from '../List/Appointments';

interface PersonFormProps {
  person: Person
  isReadOnly: boolean
  personType: 'doctor' | 'patient'
  onChange: (person: Person, contactDataCollection: ContactData[]) => void
};



export const PersonForm = ({person, isReadOnly = true, personType = 'patient', onChange}: PersonFormProps) => {
  const { isMobile } = useViewport();
  const { t } = useTranslation();
  const { isLoading, error, doctors } = useAllDoctors();
  const [ createPatientContact ] = useCreatePatientContact();
  const { isLoading: isLoadingInstitutions, error: errorInstitutions, institutions } = useAllInstitutions();
  const [ currentPerson, setCurrentPerson ] = useState<Doctor | Patient>(() => ({...person}));
  const [ currentContactDataCollection, setCurrentContactDataCollection ] = useState<ContactData[]>(() => {
    return person.contactData as ContactData[] || [];
  });
  const currentPatient = personType !== 'doctor' ? currentPerson as Patient : undefined;

  const editType = currentPerson.uuid ? 'edit' : 'create';

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
    'isAddpayFreed',
    'careFacility',
    'medicalReport',
  ];

  const autoFormFieldKeys = personType !== 'doctor' ? sharedAutoFields.concat(patientAutoFields) : sharedAutoFields;

  interface OnInputChangeProps {
    event: React.FormEvent<HTMLInputElement>
    key: PersonKey
  }

  interface OnContactChangeProps {
    event: React.FormEvent<HTMLInputElement>
    id: string
  }

  function onInputChange({event, key}: OnInputChangeProps) {
    event.preventDefault();
    const currentValue = event.currentTarget.value;
    setCurrentPerson(person => ({...person, [`${key}`]: currentValue}));
  }

  function onContactChange({event, id}: OnContactChangeProps) {
    event.preventDefault();
    const newContact = event.currentTarget.value;
    setCurrentContactDataCollection(
      contactData => contactData.map(
        c => c.uuid === id ? {...c, contact: newContact} : c
      )
    );
  }
  function onCheckboxChange({event, key}: OnInputChangeProps) {
    event.preventDefault();
    const {checked} = event.currentTarget;
    setCurrentPerson(person => ({...person, [`${key}`]: checked}));
  }

  interface OnSelectChangeProps {
    event: React.FormEvent<HTMLSelectElement>
    key: PersonKey
  }

  function onSelectChange({event, key}: OnSelectChangeProps) {
    event.preventDefault();
    const val = event.currentTarget.value === 'remove' ? undefined : event.currentTarget.value;
    setCurrentPerson(person => ({...person, [`${key}`]: val}));
  }

  useEffect(() => {
    onChange(currentPerson, currentContactDataCollection);
  }, [currentPerson, currentContactDataCollection]);

  useEffect(() => {
    if (person.uuid !== currentPerson.uuid) {
      setCurrentPerson(cur => ({...cur, uuid: person.uuid}));
    }
  }, [person.uuid]);

  const createContact = (type: 'telephone' | 'email') => {
    if (currentPatient) {
      createPatientContact({contactData: {patientId: currentPatient.uuid, type, contact: ''}})
        .then(contact => setCurrentContactDataCollection(cur => contact ? [...cur, contact] : cur));
    }
  };

  const telephone = () => {
    const currentPhones = currentContactDataCollection
      .filter(c => c.type === 'telephone')
      .map((phone: ContactData, index) =>
        <ModalFormGroup key={index}>
          <Label htmlFor={'telephone'+index}><CgPhone /></Label>
          {isReadOnly
            ? <TextDisplay id={'telephone'+index}>{phone.contact}</TextDisplay>
            : <Input
              isDisabled={isReadOnly}
              onChange={(e) => onContactChange({event: e, id: phone.uuid || ''})}
              id={phone.uuid}
              value={phone.contact}>
            </Input>
          }
        </ModalFormGroup>
      );
    return <>
      {currentPhones}
      {!currentPhones.length && !isReadOnly
        ? <ModalFormGroup>
          <Label htmlFor="addPhone"><CgPhone /></Label>
          <IconButton
            id="addPhone"
            disabled={!currentPerson.uuid}
            aria-label="add-phone"
            icon={<CgAdd />}
            onClick={() => createContact('telephone')}
          />
        </ModalFormGroup>
        : null
      }
    </>;
  };

  const email = () => {
    const currentEmails = currentContactDataCollection
      .filter(c => c.type === 'email')
      .map((email: ContactData, index) =>
        <ModalFormGroup key={index}>
          <Label htmlFor={'email'+index}><CgMail /></Label>
          {isReadOnly
            ? <TextDisplay id={'email'+index}>{email.contact}</TextDisplay>
            : <Input
              onChange={(e) => onContactChange({event: e, id: email.uuid || ''})}
              id={email.uuid}
              value={email.contact}>
            </Input>
          }
        </ModalFormGroup>
      );
    return <>
      {currentEmails}
      {!currentEmails.length && !isReadOnly
        ? <ModalFormGroup>
          <Label htmlFor="addEmail"><CgMail /></Label>
          <IconButton
            id="addEmail"
            disabled={!currentPerson.uuid}
            aria-label="add-email"
            icon={<CgAdd />}
            onClick={() => createContact('email')}
          />
        </ModalFormGroup>
        : null }
    </>;
  };
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
                ? isReadOnly
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
                : isReadOnly
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
        <GridItem>
          {autoFormFields()}
          {telephone()}
          {email()}
        </GridItem>
        <GridItem>
          {personType !== 'doctor' && currentPatient && (
            <>
              <ModalFormGroup>
                <Label htmlFor="doctorId">{t('label.doctor')}</Label>
                {isReadOnly ? (
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
              <ModalFormGroup>
                <Label htmlFor="institutionId">{t('label.institution')}</Label>
                {isReadOnly? (
                  <TextDisplay id="institutionId">
                    {currentPatient.institution && currentPatient.institution.name + ' ' + (currentPatient.institution.description ? `(${currentPatient.institution.description})` : null)}
                  </TextDisplay>
                ) : (
                  <>
                    <Select
                      name="employee"
                      value={currentPatient['institutionId']}
                      onChange={(e) => onSelectChange({event: e, key: 'institutionId'})}
                    >
                      <option value={'remove'}>No Institution</option>
                      {institutions.map((t, i) => (
                        <option key={i} value={t.uuid}>
                          {t.name + ' ' + (t.description ? `(${t.description})` : null)}
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