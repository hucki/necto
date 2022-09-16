import { Button, Checkbox, Divider, FormControl, GridItem, SimpleGrid } from '@chakra-ui/react';
import jsPDF from 'jspdf';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CgAdd, CgMail, CgPhone } from 'react-icons/cg';
import { contract } from '../../helpers/docs';
import { useCreateDoctorContact, useCreatePatientContact } from '../../hooks/contact';
import { useAllDoctors } from '../../hooks/doctor';
import { useAllInstitutions } from '../../hooks/institution';
import { ContactData } from '../../types/ContactData';
import { Doctor } from '../../types/Doctor';
import { Patient } from '../../types/Patient';
import { Person } from '../../types/Person';
import { IconButton, Input, FormLabel, ModalFormGroup, Select } from '../Library';
import { AppointmentList } from '../List/Appointments';

interface PersonFormProps {
  person: Person
  isReadOnly: boolean
  personType: 'doctor' | 'patient'
  onChange: (person: Person, contactDataCollection: ContactData[]) => void
};

export const PersonForm = ({person, isReadOnly = true, personType = 'patient', onChange}: PersonFormProps) => {
  const { t } = useTranslation();
  const { doctors } = useAllDoctors();
  const [ createPatientContact ] = useCreatePatientContact();
  const [ createDoctorContact ] = useCreateDoctorContact();
  const { institutions } = useAllInstitutions();
  const [ currentPerson, setCurrentPerson ] = useState<Doctor | Patient>(() => ({...person}));
  const [ currentContactDataCollection, setCurrentContactDataCollection ] = useState<ContactData[]>(() => {
    return person.contactData as ContactData[] || [];
  });
  const currentPatient = personType !== 'doctor' ? currentPerson as Patient : undefined;
  const currentDoctor = personType === 'doctor' ? currentPerson as Doctor : undefined;

  const editType = currentPerson.uuid ? 'edit' : 'create';

  type PersonKey = keyof Patient;

  const sharedAutoFields: PersonKey[] = [
    'title',
    'firstName',
    'lastName',
    'street',
    'zip',
    'city',
  ];

  const patientAutoFields: PersonKey[] = [
    'gender',
    'notices',
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
    const val = !event.currentTarget.value || event.currentTarget.value === 'remove' ? undefined : event.currentTarget.value;
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
    if (currentDoctor) {
      createDoctorContact({contactData: {doctorId: currentDoctor.uuid, type, contact: ''}})
        .then(contact => setCurrentContactDataCollection(cur => contact ? [...cur, contact] : cur));
    }
  };

  const personContract = contract(person);


  const contractFileName = `contract_${(person.lastName+'_'+person.firstName).replace(' ','')}.pdf`;
  const downloadContract = () => {
    personContract.save(contractFileName);
  };
  const patientCheckboxes = () => {
    return <ModalFormGroup style={{
      display: 'flex',
      justifyContent: 'space-between'
    }}>
      <FormControl id="isAddpayFreed" maxWidth="30%" isRequired>
        <Checkbox
          name="isAddpayFreed"
          isDisabled={isReadOnly}
          size="lg"
          my={2}
          isChecked={(currentPerson as Patient).isAddpayFreed ? true : false}
          onChange={(e) => onCheckboxChange({event: e, key: 'isAddpayFreed'})}
        />
        <FormLabel>{t('label.isAddpayFreed')}</FormLabel>
      </FormControl>
      <FormControl id="hasContract" maxWidth="30%" isRequired>
        <Checkbox
          isInvalid={(currentPerson as Patient).hasContract ? undefined : true}
          name="hasContract"
          isDisabled={isReadOnly}
          size="lg"
          my={2}
          isChecked={(currentPerson as Patient).hasContract ? true : false}
          onChange={(e) => onCheckboxChange({event: e, key: 'hasContract'})}
        />
        <FormLabel>{t('label.hasContract')}</FormLabel>
      </FormControl>
      <Button onClick={() => downloadContract()}>PDF</Button>
    </ModalFormGroup>;
  };
  const telephone = () => {
    const currentPhones = currentContactDataCollection
      .filter(c => c.type === 'telephone')
      .map((phone: ContactData, index) =>
        <ModalFormGroup key={index}>
          <FormControl id={'telephone'+index}>
            <Input
              isDisabled={isReadOnly}
              onChange={(e) => onContactChange({event: e, id: phone.uuid || ''})}
              id={phone.uuid}
              value={phone.contact}>
            </Input>
            <FormLabel><CgPhone /></FormLabel>
          </FormControl>
        </ModalFormGroup>
      );
    return <>
      {currentPhones}
      {!currentPhones.length && !isReadOnly
        ? <ModalFormGroup>
          <FormControl id="addPhone">
            <IconButton
              disabled={!currentPerson.uuid}
              aria-label="add-phone"
              icon={<CgAdd />}
              onClick={() => createContact('telephone')}
            />
            <FormLabel><CgPhone /></FormLabel>
          </FormControl>
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
          <FormControl id={'email'+index}>
            <Input
              isDisabled={isReadOnly}
              onChange={(e) => onContactChange({event: e, id: email.uuid || ''})}
              id={email.uuid}
              value={email.contact}>
            </Input>
            <FormLabel><CgMail /></FormLabel>
          </FormControl>
        </ModalFormGroup>
      );
    return <>
      {currentEmails}
      {!currentEmails.length && !isReadOnly
        ? <ModalFormGroup>
          <FormControl id="addEmail">
            <IconButton
              id="addEmailButton"
              disabled={!currentPerson.uuid}
              aria-label="add-email"
              icon={<CgAdd />}
              onClick={() => createContact('email')}
            />
            <FormLabel><CgMail /></FormLabel>
          </FormControl>
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
              <FormControl id={key}>
                {typeof currentPerson[key as keyof Person] === 'boolean'
                  ? (<Checkbox
                    name={key}
                    isDisabled={isReadOnly}
                    size="lg"
                    my={2}
                    isChecked={currentPerson[key as keyof Person] ? true : false}
                    onChange={(e) => onCheckboxChange({event: e, key: key as keyof Person})}
                  />)
                  : (<Input
                    isDisabled={isReadOnly}
                    onChange={(e) => onInputChange({event: e, key: key as keyof Person})}
                    id={key}
                    value={currentPerson[key as keyof Person]?.toString()}>
                  </Input>)}
                <FormLabel>{t(`label.${key}`)}</FormLabel>
              </FormControl>
            </ModalFormGroup>
          ) : null
      );
  };

  return (
    <>
      <SimpleGrid columns={[1, null, 2]} gap={6} py={2} height="100%" overflowY="scroll" overflowX="hidden">
        <GridItem>
          {personType !== 'doctor' && patientCheckboxes()}
          {autoFormFields()}
          {telephone()}
          {email()}
        </GridItem>
        <GridItem>
          {personType !== 'doctor' && currentPatient && (
            <>
              <ModalFormGroup>
                <FormControl id="doctorId">
                  <Select
                    isDisabled={isReadOnly}
                    name="employee"
                    value={currentPatient['doctorId'] || undefined}
                    onChange={(e) => onSelectChange({event: e, key: 'doctorId'})}
                  >
                    <option value={'remove'}>No Doctor</option>
                    {doctors.map((t, i) => (
                      <option key={i} value={t.uuid}>
                        {t.firstName + ' ' + t.lastName}
                      </option>
                    ))}
                  </Select>
                  <FormLabel>{t('label.doctor')}</FormLabel>
                </FormControl>
              </ModalFormGroup>
              <ModalFormGroup>
                <FormControl id="institutionId">
                  <Select
                    isDisabled={isReadOnly}
                    name="employee"
                    value={currentPatient['institutionId'] || undefined}
                    onChange={(e) => onSelectChange({event: e, key: 'institutionId'})}
                  >
                    <option value={'remove'}>No Institution</option>
                    {institutions.map((t, i) => (
                      <option key={i} value={t.uuid}>
                        {t.name + ' ' + (t.description ? `(${t.description})` : undefined)}
                      </option>
                    ))}
                  </Select>
                  <FormLabel>{t('label.institution')}</FormLabel>
                </FormControl>

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