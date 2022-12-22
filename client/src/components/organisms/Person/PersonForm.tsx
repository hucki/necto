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
import {
  Input,
  FormLabel,
  ModalFormGroup,
  Select,
  FormGroup,
} from '../../Library';
import { PersonMetaData } from '../../molecules/DataDisplay/PersonMetaData';
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
  onCreate: () => void;
}

const isWaitingPatient = (patient: Patient): boolean => {
  if (patient.isWaitingAgain) return true;
  if (patient.archived) return false;
  if (!patient.events) return true;
  if (!patient.events.length) return true;
  if (
    patient.events.filter((event) => !event.isCancelled && !event.isDiagnostic)
      .length
  )
    return false;
  return false;
};

export const PersonForm = ({
  person,
  isReadOnly = true,
  personType = 'patient',
  onChange,
  onCreate,
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
  const personNotCreated = !currentPerson.uuid;
  const [currentContactDataCollection, setCurrentContactDataCollection] =
    useState<ContactData[]>(() => {
      return (person.contactData as ContactData[]) || [];
    });
  const currentPatient =
    personType !== 'doctor' ? (currentPerson as Patient) : undefined;
  const currentDoctor =
    personType === 'doctor' ? (currentPerson as Doctor) : undefined;

  const [defaultValueBirthday, setDefaultValueBirthday] = useState(() =>
    currentPatient && currentPatient.birthday
      ? dayjs(currentPatient.birthday).local().format('YYYY-MM-DD')
      : undefined
  );
  const [defaultValueIsWaitingSince, setDefaultValueIsWaitingSince] = useState(
    () =>
      currentPatient && currentPatient.isWaitingSince
        ? dayjs(currentPatient.isWaitingSince).local().format('YYYY-MM-DD')
        : undefined
  );
  useEffect(() => {
    if (currentPatient) {
      const currentBirthday = currentPatient.birthday
        ? dayjs(currentPatient.birthday).local().format('YYYY-MM-DD')
        : undefined;
      if (currentBirthday && currentBirthday !== defaultValueBirthday) {
        setDefaultValueBirthday(currentBirthday);
      }
      const currentIsWaitingSince = currentPatient.isWaitingSince
        ? dayjs(currentPatient.isWaitingSince).local().format('YYYY-MM-DD')
        : undefined;
      if (currentIsWaitingSince !== defaultValueIsWaitingSince) {
        setDefaultValueIsWaitingSince(currentIsWaitingSince);
      }
    }
  }, [currentPatient]);
  type PersonKey = keyof Patient;

  const sharedAutoFields: PersonKey[] = ['title', 'street', 'zip', 'city'];

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
          isDisabled={isReadOnly || personNotCreated}
          contact={contact}
          onChange={onContactChange}
        />
      ));

    return (
      <>
        {(currentPhones.length && currentPhones) || null}
        {!currentPhones.length && !isReadOnly && !personNotCreated ? (
          <CreateContactButton
            isDisabled={personNotCreated}
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
          isDisabled={isReadOnly || personNotCreated}
          contact={contact}
          onChange={onContactChange}
        />
      ));

    return (
      <>
        {(currentFaxes.length && currentFaxes) || null}
        {!currentFaxes.length && !isReadOnly && !personNotCreated ? (
          <CreateContactButton
            isDisabled={personNotCreated}
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
              isDisabled={isReadOnly || personNotCreated}
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
        {!currentEmails.length && !isReadOnly && !personNotCreated ? (
          <ModalFormGroup>
            <FormControl id="addEmail">
              <IconButton
                id="addEmailButton"
                disabled={personNotCreated}
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
            disabled={isReadOnly || personNotCreated}
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
      <FormGroup>
        <FormControl id="isWaitingSince">
          <Input
            type="date"
            disabled={
              isReadOnly ||
              personNotCreated ||
              !isWaitingPatient(currentPatient)
            }
            name="isWaitingSince"
            defaultValue={defaultValueIsWaitingSince}
            onBlur={(e) =>
              onInputChange({ event: e, key: 'isWaitingSince' as keyof Person })
            }
          />
          <FormLabel>{t('label.isWaitingSince')}</FormLabel>
        </FormControl>
        <FormControl id="isWaitingAgain">
          <Checkbox
            name="isWaitingAgain"
            isDisabled={
              isReadOnly || personNotCreated || isWaitingPatient(currentPatient)
            }
            size="lg"
            my={2}
            isChecked={(currentPerson as Patient).isWaitingAgain ? true : false}
            onChange={(e) =>
              onCheckboxChange({ event: e, key: 'isWaitingAgain' })
            }
          />
          <FormLabel>{t('label.isWaitingAgain')}</FormLabel>
        </FormControl>
      </FormGroup>
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
                  isDisabled={isReadOnly || personNotCreated}
                  size="lg"
                  my={2}
                  isChecked={currentPerson[key as keyof Person] ? true : false}
                  onChange={(e) =>
                    onCheckboxChange({ event: e, key: key as keyof Person })
                  }
                />
              ) : (
                <Input
                  isDisabled={isReadOnly || personNotCreated}
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
          <ModalFormGroup>
            <FormControl id="firstName" isRequired={true}>
              <Input
                isDisabled={isReadOnly}
                onChange={(e) =>
                  onInputChange({ event: e, key: 'firstName' as keyof Person })
                }
                name="firstName"
                value={currentPerson['firstName' as keyof Person]?.toString()}
              ></Input>
              <FormLabel>{t('label.firstName')}</FormLabel>
            </FormControl>
          </ModalFormGroup>
          <FormGroup gridColsUnit="auto" gridCols={personNotCreated ? 2 : 1}>
            <FormControl id="lastName" isRequired={true}>
              <Input
                isDisabled={isReadOnly}
                onChange={(e) =>
                  onInputChange({ event: e, key: 'lastName' as keyof Person })
                }
                name="lastName"
                value={currentPerson['lastName' as keyof Person]?.toString()}
              ></Input>
              <FormLabel>{t('label.lastName')}</FormLabel>
            </FormControl>
            {personNotCreated && (
              <FormControl id="continue">
                <Button
                  disabled={
                    currentPerson.firstName === '' ||
                    currentPerson.lastName === ''
                  }
                  onClick={onCreate}
                  colorScheme="teal"
                >
                  {t('label.continue')}
                </Button>
              </FormControl>
            )}
          </FormGroup>
          {autoFormFields()}
          {personType !== 'doctor' && <BirthdayInput />}
          {personType !== 'doctor' && <IsWaitingSinceInput />}
          {currentPatient && (
            <PersonMetaData
              createdAt={currentPatient?.createdAt}
              updatedAt={currentPatient?.updatedAt}
            />
          )}
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
                    isDisabled={isReadOnly || personNotCreated}
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
                    isDisabled={isReadOnly || personNotCreated}
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
