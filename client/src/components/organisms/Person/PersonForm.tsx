import {
  Button,
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
import {
  useCreateDoctorContact,
  useCreatePatientContact,
} from '../../../hooks/contact';
import { useAllDoctors } from '../../../hooks/doctor';
import { useAllInstitutions } from '../../../hooks/institution';
import { useFilter } from '../../../hooks/useFilter';
import { useViewport } from '../../../hooks/useViewport';
import { ContactData, ContactType } from '../../../types/ContactData';
import { Doctor } from '../../../types/Doctor';
import { Patient } from '../../../types/Patient';
import { Person } from '../../../types/Person';
import { IconButton } from '../../atoms/Buttons';
import { ContactInput } from '../../atoms/ContactData/ContactInput';
import CreateContactButton from '../../atoms/ContactData/CreateContactButton';
import { FullPageSpinner } from '../../atoms/LoadingSpinner';
import {
  Input,
  FormLabel,
  ModalFormGroup,
  Select,
  FormGroup,
  Checkbox,
  Label,
} from '../../Library';
import { EventList } from '../List/Events';
import { AddpayForm } from '../Patients/AddpayForm';
import { WaitingPreferenceForm } from '../Patients/WaitingPreferenceForm';
import { getDisplayName } from '../../../helpers/displayNames';
import { PatientContractButton } from '../../atoms/PatientContractButton';
import { WaitingSinceInput } from '../Patients/WaitingSinceInput';
dayjs.extend(LocalizedFormat);
dayjs.extend(utc);
dayjs.locale('de');

type PersonKey = keyof Patient;

export interface OnInputChangeProps {
  event: React.FormEvent<HTMLInputElement>;
  key: PersonKey;
}

export interface OnContactChangeProps {
  event: React.FormEvent<HTMLInputElement>;
  id: string;
}
interface PersonFormProps {
  person: Person;
  isReadOnly: boolean;
  isPending: boolean;
  personType: 'doctor' | 'patient';
  // eslint-disable-next-line no-unused-vars
  onChange: (person: Person, contactDataCollection: ContactData[]) => void;
  onCreate: () => void;
}

export const PersonForm = ({
  person,
  isReadOnly: isReadOnlyIncoming = true,
  isPending = false,
  personType = 'patient',
  onChange,
  onCreate,
}: PersonFormProps) => {
  const { t } = useTranslation();
  const { currentCompany } = useFilter();
  const { isMobile } = useViewport();
  const { doctors } = useAllDoctors();
  const [isCreatingContract, setIsCreatingContract] = useState(false);
  const isReadOnly = isCreatingContract || isReadOnlyIncoming;
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

  const sharedAutoFields: PersonKey[] = ['title', 'street', 'zip', 'city'];

  const patientAutoFields: PersonKey[] = ['gender', 'notices', 'medicalReport'];

  const autoFormFieldKeys =
    personType !== 'doctor'
      ? sharedAutoFields.concat(patientAutoFields)
      : sharedAutoFields;

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

  const patientCheckboxes = () => {
    return (
      <SimpleGrid columns={1} gap={2} py={2}>
        <GridItem>
          {currentPerson.uuid && (
            <div
              style={{
                display: 'flex',
                flexDirection: isMobile && !isReadOnly ? 'column' : 'row',
                gap: '0.5rem',
                justifyContent: isMobile ? 'space-evenly' : 'flex-start',
              }}
            >
              <div className="addpayFreedom">{t('label.addPayFreedUntil')}</div>
              <AddpayForm
                size={isReadOnly ? 'sm' : 'lg'}
                isReadOnly={isReadOnly}
                patientId={currentPerson.uuid}
              />
            </div>
          )}
        </GridItem>
        <GridItem>
          <ModalFormGroup
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.5rem',
            }}
          >
            {t('label.hasContract')}
            <FormControl id="hasContract" isRequired w="15%">
              <Checkbox
                isInvalid={
                  (currentPerson as Patient).hasContract ? undefined : true
                }
                name="hasContract"
                isDisabled={isReadOnly}
                size="lg"
                my={2}
                isChecked={
                  (currentPerson as Patient).hasContract ? true : false
                }
                onChange={(e) =>
                  onCheckboxChange({ event: e, key: 'hasContract' })
                }
              />
            </FormControl>
            {currentPatient &&
              !currentPatient.hasContract &&
              !isCreatingContract && (
                <Button
                  onClick={() => setIsCreatingContract(true)}
                  colorScheme="orange"
                >
                  {t('label.createContract')}
                </Button>
              )}
            {isCreatingContract &&
              currentPatient &&
              currentCompany &&
              !currentPatient.hasContract && (
                <PatientContractButton
                  patient={currentPatient}
                  company={currentCompany}
                  handleReset={() => setIsCreatingContract(false)}
                />
              )}
          </ModalFormGroup>
        </GridItem>
      </SimpleGrid>
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
              autoComplete="off"
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
            autoComplete="off"
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
                  autoComplete="off"
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
      {isPending ? (
        <FullPageSpinner />
      ) : (
        <SimpleGrid
          columns={[1, null, 2]}
          gap={6}
          py={2}
          maxHeight={isMobile ? '100%' : '70vh'}
          overflowY="scroll"
          overflowX="hidden"
        >
          <GridItem>
            {!personNotCreated &&
              personType !== 'doctor' &&
              patientCheckboxes()}
            <ModalFormGroup>
              <FormControl id="firstName" isRequired={true}>
                <Input
                  autoComplete="off"
                  isDisabled={isReadOnly}
                  onChange={(e) =>
                    onInputChange({
                      event: e,
                      key: 'firstName' as keyof Person,
                    })
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
                  autoComplete="off"
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
                <FormControl id="continue" style={{ textAlign: 'center' }}>
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
            {!personNotCreated && (
              <>
                {autoFormFields()}
                {personType !== 'doctor' && <BirthdayInput />}
                {phoneFromContact()}
                {personType === 'doctor' && faxFromContact()}
                {emailFromContact()}
              </>
            )}
          </GridItem>
          <GridItem>
            {!personNotCreated && personType !== 'doctor' && currentPatient && (
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
                      {doctors
                        .sort((a, b) => {
                          if (a.lastName < b.lastName) return -1;
                          return 1;
                        })
                        .map((t, i) => (
                          <option key={i} value={t.uuid}>
                            {getDisplayName({ person: t, type: 'full' })}
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
                <ModalFormGroup>
                  <Label>{t('label.waitingPreference')}</Label>
                  <WaitingPreferenceForm
                    patientId={currentPatient.uuid}
                    isReadOnly={isReadOnly}
                  />
                  {currentPatient ? (
                    <WaitingSinceInput
                      patient={currentPatient}
                      isDisabled={isReadOnly || personNotCreated}
                      onCheckboxChange={onCheckboxChange}
                      onInputChange={onInputChange}
                      defaultValueIsWaitingSince={defaultValueIsWaitingSince}
                    />
                  ) : null}
                  {/* <IsWaitingSinceInput /> */}
                </ModalFormGroup>
                <Divider m="1" />
                {currentPatient.uuid ? (
                  <>
                    <b style={{ marginLeft: '0.5rem' }}>
                      {t('label.appointments')}:
                    </b>
                    <EventList patientId={currentPatient.uuid} />
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
      )}
    </>
  );
};
