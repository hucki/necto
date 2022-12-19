import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  GridItem,
  SimpleGrid,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CgAdd, CgMail } from 'react-icons/cg';
import { contract } from '../../../helpers/docs';
import {
  useCreateDoctorContact,
  useCreatePatientContact,
} from '../../../hooks/contact';
import { useAllDoctors } from '../../../hooks/doctor';
import { useAllInstitutions } from '../../../hooks/institution';
import { useFilter } from '../../../hooks/useFilter';
import { ContactData, ContactType } from '../../../types/ContactData';
import { Doctor } from '../../../types/Doctor';
import { Patient } from '../../../types/Patient';
import { Person } from '../../../types/Person';
import { IconButton } from '../../atoms/Buttons';
import { ContactInput } from '../../atoms/ContactData/ContactInput';
import CreateContactButton from '../../atoms/ContactData/CreateContactButton';
import { Input, FormLabel, ModalFormGroup, Select } from '../../Library';
import { EventList } from '../List/Events';
dayjs.extend(LocalizedFormat);
dayjs.extend(utc);
dayjs.locale('de');

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

  const [defaultValueBirthday, setDefaultValueBirthday] = useState(
    () =>
      currentPatient &&
      dayjs(currentPatient.birthday).local().format('YYYY-MM-DD')
  );
  const [defaultValueIsWaitingSince, setDefaultValueIsWaitingSince] = useState(
    () =>
      currentPatient &&
      dayjs(currentPatient.isWaitingSince).local().format('YYYY-MM-DD')
  );

  useEffect(() => {
    if (currentPatient) {
      const currentBirthday = dayjs(currentPatient.birthday)
        .local()
        .format('YYYY-MM-DD');
      if (currentBirthday !== defaultValueBirthday) {
        setDefaultValueBirthday(currentBirthday);
      }
      const currentIsWaitingSince = dayjs(currentPatient.isWaitingSince)
        .local()
        .format('YYYY-MM-DD');
      if (currentIsWaitingSince !== defaultValueIsWaitingSince) {
        setDefaultValueIsWaitingSince(currentIsWaitingSince);
      }
    }
  }, [currentPatient]);
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

  function onInputChange({ event, key }: OnInputChangeProps) {
    event.preventDefault();
    const { type } = event.currentTarget;
    const currentValue =
      type === 'date'
        ? dayjs(event.currentTarget.value).toDate()
        : event.currentTarget.value;
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

  const createContact = (type: ContactType) => {
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

  const phoneFromContact = () => {
    const currentPhones = currentContactDataCollection
      .filter((c) => c.type === 'telephone')
      .map((contact, index) => (
        <ContactInput
          key={index}
          isDisabled={isReadOnly}
          contact={contact}
          onChange={onContactChange}
        />
      ));

    return (
      <>
        {(currentPhones.length && currentPhones) || null}
        {!currentPhones.length && !isReadOnly ? (
          <CreateContactButton
            isDisabled={!currentPerson.uuid}
            type="telephone"
            onCreate={createContact}
          />
        ) : null}
      </>
    );
  };

  const faxFromContact = () => {
    const currentFaxes = currentContactDataCollection
      .filter((c) => c.type === 'fax')
      .map((contact, index) => (
        <ContactInput
          key={index}
          isDisabled={isReadOnly}
          contact={contact}
          onChange={onContactChange}
        />
      ));

    return (
      <>
        {(currentFaxes.length && currentFaxes) || null}
        {!currentFaxes.length && !isReadOnly ? (
          <CreateContactButton
            isDisabled={!currentPerson.uuid}
            type="fax"
            onCreate={createContact}
          />
        ) : null}
      </>
    );
  };
  const emailFromContact = () => {
    const currentEmails = currentContactDataCollection
      .filter((c) => c.type === 'email')
      .map((contact, index) => (
        <ModalFormGroup key={index}>
          <FormControl id={contact.type + '_' + contact.uuid}>
            <Input
              isDisabled={isReadOnly}
              onChange={(e) =>
                onContactChange({ event: e, id: contact.uuid || '' })
              }
              id={contact.uuid}
              value={contact.contact}
            />
            <FormLabel>
              <CgMail />
            </FormLabel>
          </FormControl>
        </ModalFormGroup>
      ));

    return (
      <>
        {(currentEmails.length && currentEmails) || null}
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
          <Input
            type="date"
            disabled={isReadOnly}
            name="birthday"
            defaultValue={defaultValueBirthday}
            onBlur={(e) =>
              onInputChange({ event: e, key: 'birthday' as keyof Person })
            }
          />
          <FormLabel>{t('label.birthday')}</FormLabel>
        </FormControl>
      </ModalFormGroup>
    );
  };
  const IsWaitingSinceInput = () => {
    if (!currentPatient) return null;
    return (
      <ModalFormGroup>
        <FormControl id="isWaitingSince">
          <Input
            type="date"
            disabled={isReadOnly}
            name="isWaitingSince"
            defaultValue={defaultValueIsWaitingSince}
            onBlur={(e) =>
              onInputChange({ event: e, key: 'isWaitingSince' as keyof Person })
            }
          />
          <FormLabel>{t('label.isWaitingSince')}</FormLabel>
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
          {personType !== 'doctor' && <IsWaitingSinceInput />}
          {phoneFromContact()}
          {personType === 'doctor' && faxFromContact()}
          {emailFromContact()}
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
