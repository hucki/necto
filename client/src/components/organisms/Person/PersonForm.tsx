import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  GridItem,
  SimpleGrid,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CgAdd, CgMail, CgPhone } from 'react-icons/cg';
import { contract } from '../../../helpers/docs';
import {
  useCreateDoctorContact,
  useCreatePatientContact,
} from '../../../hooks/contact';
import { useAllDoctors } from '../../../hooks/doctor';
import { useAllInstitutions } from '../../../hooks/institution';
import { useFilter } from '../../../hooks/useFilter';
import { ContactData } from '../../../types/ContactData';
import { Doctor } from '../../../types/Doctor';
import { Patient } from '../../../types/Patient';
import { Person } from '../../../types/Person';
import { IconButton } from '../../atoms/Buttons';
import {
  Input,
  FormLabel,
  ModalFormGroup,
  Select,
  DatePicker,
} from '../../Library';
import { EventList } from '../List/Events';

interface PersonFormProps {
  person: Person;
  isReadOnly: boolean;
  personType: 'doctor' | 'patient';
  // eslint-disable-next-line no-unused-vars
  onChange: (person: Person, contactDataCollection: ContactData[]) => void;
}

export const PersonForm = ({
  person,
  isReadOnly = true,
  personType = 'patient',
  onChange,
}: PersonFormProps) => {
  const { t } = useTranslation();
  const { currentCompany } = useFilter();
  const { doctors } = useAllDoctors();
  const { mutateAsync: createPatientContact } = useCreatePatientContact();
  const { mutateAsync: createDoctorContact } = useCreateDoctorContact();
  const { institutions } = useAllInstitutions();
  const [currentPerson, setCurrentPerson] = useState<Doctor | Patient>(() => ({
    ...person,
  }));
  const [currentContactDataCollection, setCurrentContactDataCollection] =
    useState<ContactData[]>(() => {
      return (person.contactData as ContactData[]) || [];
    });
  const currentPatient =
    personType !== 'doctor' ? (currentPerson as Patient) : undefined;
  const currentDoctor =
    personType === 'doctor' ? (currentPerson as Doctor) : undefined;

  type PersonKey = keyof Patient;

  const sharedAutoFields: PersonKey[] = [
    'title',
    'firstName',
    'lastName',
    'street',
    'zip',
    'city',
  ];

  const patientAutoFields: PersonKey[] = ['gender', 'notices', 'medicalReport'];

  const autoFormFieldKeys =
    personType !== 'doctor'
      ? sharedAutoFields.concat(patientAutoFields)
      : sharedAutoFields;

  interface OnInputChangeProps {
    event: React.FormEvent<HTMLInputElement>;
    key: PersonKey;
  }

  interface OnContactChangeProps {
    event: React.FormEvent<HTMLInputElement>;
    id: string;
  }

  interface OnDateSelectProps {
    date: ReactDatePickerReturnType;
    key: PersonKey;
  }

  function onInputChange({ event, key }: OnInputChangeProps) {
    event.preventDefault();
    const currentValue = event.currentTarget.value;
    setCurrentPerson((person) => ({ ...person, [`${key}`]: currentValue }));
  }

  function onContactChange({ event, id }: OnContactChangeProps) {
    event.preventDefault();
    const newContact = event.currentTarget.value;
    setCurrentContactDataCollection((contactData) =>
      contactData.map((c) =>
        c.uuid === id ? { ...c, contact: newContact } : c
      )
    );
  }

  function onDateSelect({ date, key }: OnDateSelectProps) {
    setCurrentPerson((person) => ({ ...person, [`${key}`]: date }));
  }
  function onCheckboxChange({ event, key }: OnInputChangeProps) {
    event.preventDefault();
    const { checked } = event.currentTarget;
    setCurrentPerson((person) => ({ ...person, [`${key}`]: checked }));
  }

  interface OnSelectChangeProps {
    event: React.FormEvent<HTMLSelectElement>;
    key: PersonKey;
  }

  function onSelectChange({ event, key }: OnSelectChangeProps) {
    event.preventDefault();
    const val =
      !event.currentTarget.value || event.currentTarget.value === 'remove'
        ? undefined
        : event.currentTarget.value;
    setCurrentPerson((person) => ({ ...person, [`${key}`]: val }));
  }

  useEffect(() => {
    onChange(currentPerson, currentContactDataCollection);
  }, [currentPerson, currentContactDataCollection]);

  useEffect(() => {
    if (person.uuid !== currentPerson.uuid) {
      setCurrentPerson((cur) => ({ ...cur, uuid: person.uuid }));
    }
  }, [person.uuid]);

  const createContact = (type: 'telephone' | 'email') => {
    if (currentPatient) {
      createPatientContact({
        contactData: { patientId: currentPatient.uuid, type, contact: '' },
      }).then((contact) =>
        setCurrentContactDataCollection((cur) =>
          contact ? [...cur, contact] : cur
        )
      );
    }
    if (currentDoctor) {
      createDoctorContact({
        contactData: { doctorId: currentDoctor.uuid, type, contact: '' },
      }).then((contact) =>
        setCurrentContactDataCollection((cur) =>
          contact ? [...cur, contact] : cur
        )
      );
    }
  };

  const patientContract = (person as Patient).hasContract
    ? undefined
    : contract(person, currentCompany);
  // const contractOutput = personContract.output('datauristring');

  const contractFileName = `contract_${(
    person.lastName +
    '_' +
    person.firstName
  ).replace(' ', '')}.pdf`;
  const patientCheckboxes = () => {
    return (
      <ModalFormGroup
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <FormControl id="isAddpayFreed" maxWidth="30%" isRequired>
          <Checkbox
            name="isAddpayFreed"
            isDisabled={isReadOnly}
            size="lg"
            my={2}
            isChecked={(currentPerson as Patient).isAddpayFreed ? true : false}
            onChange={(e) =>
              onCheckboxChange({ event: e, key: 'isAddpayFreed' })
            }
          />
          <FormLabel>{t('label.isAddpayFreed')}</FormLabel>
        </FormControl>
        <FormControl id="hasContract" maxWidth="30%" isRequired>
          <Checkbox
            isInvalid={
              (currentPerson as Patient).hasContract ? undefined : true
            }
            name="hasContract"
            isDisabled={isReadOnly}
            size="lg"
            my={2}
            isChecked={(currentPerson as Patient).hasContract ? true : false}
            onChange={(e) => onCheckboxChange({ event: e, key: 'hasContract' })}
          />
          <FormLabel>{t('label.hasContract')}</FormLabel>
        </FormControl>
        {patientContract && (
          <Button
            onClick={() => {
              patientContract.save(contractFileName);
            }}
          >
            PDF
          </Button>
        )}
      </ModalFormGroup>
    );
  };
  const NewTelephoneInput = () => {
    return (
      <ModalFormGroup>
        <FormControl id="addPhone">
          <IconButton
            disabled={!currentPerson.uuid}
            aria-label="add-phone"
            icon={<CgAdd />}
            onClick={() => createContact('telephone')}
          />
          <FormLabel>
            <CgPhone />
          </FormLabel>
        </FormControl>
      </ModalFormGroup>
    );
  };
  interface ContactDataInputProps {
    contactData: ContactData[];
  }

  const ContactDataInput = ({ contactData }: ContactDataInputProps) => {
    const currentContacts = contactData.map(
      (contactItem: ContactData, index) => (
        <ModalFormGroup key={index}>
          <FormControl id={contactItem.type + '_' + index}>
            <Input
              isDisabled={isReadOnly}
              onChange={(e) =>
                onContactChange({ event: e, id: contactItem.uuid || '' })
              }
              id={contactItem.uuid}
              value={contactItem.contact}
            ></Input>
            <FormLabel>
              {contactItem.type === 'telephone' ? <CgPhone /> : <CgMail />}
            </FormLabel>
          </FormControl>
        </ModalFormGroup>
      )
    );
    return <>{currentContacts}</>;
  };

  const PhoneFromContact = () => {
    const currentPhones = currentContactDataCollection.filter(
      (c) => c.type === 'telephone'
    );
    return (
      <>
        {currentPhones.length && (
          <ContactDataInput contactData={currentPhones} />
        )}
        {!currentPhones.length && !isReadOnly ? <NewTelephoneInput /> : null}
      </>
    );
  };

  const EmailFromContact = () => {
    const currentEmails = currentContactDataCollection.filter(
      (c) => c.type === 'email'
    );

    return (
      <>
        {currentEmails.length && (
          <ContactDataInput contactData={currentEmails} />
        )}
        {!currentEmails.length && !isReadOnly ? (
          <ModalFormGroup>
            <FormControl id="addEmail">
              <IconButton
                id="addEmailButton"
                disabled={!currentPerson.uuid}
                aria-label="add-email"
                icon={<CgAdd />}
                onClick={() => createContact('email')}
              />
              <FormLabel>
                <CgMail />
              </FormLabel>
            </FormControl>
          </ModalFormGroup>
        ) : null}
      </>
    );
  };

  const BirthdayInput = () => {
    if (!currentPatient) return null;
    return (
      <ModalFormGroup>
        <FormControl id="birthday">
          <DatePicker
            disabled={isReadOnly}
            name="birthday"
            locale="de"
            dateFormat="P"
            selected={
              currentPatient.birthday && dayjs(currentPatient.birthday).toDate()
            }
            onChange={(date: ReactDatePickerReturnType) => {
              if (date) onDateSelect({ date, key: 'birthday' });
            }}
          />
          <FormLabel>{t('label.birthday')}</FormLabel>
        </FormControl>
      </ModalFormGroup>
    );
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
              {typeof currentPerson[key as keyof Person] === 'boolean' ? (
                <Checkbox
                  name={key}
                  isDisabled={isReadOnly}
                  size="lg"
                  my={2}
                  isChecked={currentPerson[key as keyof Person] ? true : false}
                  onChange={(e) =>
                    onCheckboxChange({ event: e, key: key as keyof Person })
                  }
                />
              ) : (
                <Input
                  isDisabled={isReadOnly}
                  onChange={(e) =>
                    onInputChange({ event: e, key: key as keyof Person })
                  }
                  id={key}
                  value={currentPerson[key as keyof Person]?.toString()}
                ></Input>
              )}
              <FormLabel>{t(`label.${key}`)}</FormLabel>
            </FormControl>
          </ModalFormGroup>
        ) : null
      );
  };

  return (
    <>
      <SimpleGrid
        columns={[1, null, 2]}
        gap={6}
        py={2}
        height="100%"
        overflowY="scroll"
        overflowX="hidden"
      >
        <GridItem>
          {personType !== 'doctor' && patientCheckboxes()}
          {autoFormFields()}
          {personType !== 'doctor' && <BirthdayInput />}
          <PhoneFromContact />
          <EmailFromContact />
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
                    onChange={(e) =>
                      onSelectChange({ event: e, key: 'doctorId' })
                    }
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
                    onChange={(e) =>
                      onSelectChange({ event: e, key: 'institutionId' })
                    }
                  >
                    <option value={'remove'}>No Institution</option>
                    {institutions.map((t, i) => (
                      <option key={i} value={t.uuid}>
                        {t.name +
                          ' ' +
                          (t.description ? `(${t.description})` : undefined)}
                      </option>
                    ))}
                  </Select>
                  <FormLabel>{t('label.institution')}</FormLabel>
                </FormControl>
              </ModalFormGroup>
              <Divider m="1" />
              {/* <iframe src={contractOutput} style={{width:'100%', height:'100%'}}/> */}
              {currentPatient.events?.length ? (
                <>
                  <b style={{ marginLeft: '0.5rem' }}>
                    {t('label.appointments')}:
                  </b>
                  <EventList events={currentPatient.events} />
                </>
              ) : (
                <b style={{ marginLeft: '0.5rem' }}>
                  {t('label.no') + ' ' + t('label.appointments')}
                </b>
              )}
            </>
          )}
        </GridItem>
      </SimpleGrid>
    </>
  );
};
