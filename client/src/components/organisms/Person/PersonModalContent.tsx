import {
  Button,
  ModalFooter,
  useToast,
  UseToastOptions,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaArchive, FaEdit, FaTimes } from 'react-icons/fa';
import { sanitizePatient } from '../../../helpers/dataConverter';
import { useUpdateContact } from '../../../hooks/contact';
import { useCreateDoctor, useUpdateDoctor } from '../../../hooks/doctor';
import { useCreatePatient, useUpdatePatient } from '../../../hooks/patient';
import { useViewport } from '../../../hooks/useViewport';
import { ContactData } from '../../../types/ContactData';
import { Doctor } from '../../../types/Doctor';
import { Patient } from '../../../types/Patient';
import { Person, NewPerson, isNewPerson } from '../../../types/Person';
import { IconButton } from '../../atoms/Buttons';
import { ControlWrapper } from '../../atoms/Wrapper';
import { ModalHeader } from '../../Library';
import { PersonCard } from '../../molecules/Cards/PersonCard';
import { PersonMetaData } from '../../molecules/DataDisplay/PersonMetaData';
import { PersonForm } from './PersonForm';

interface PersonModalContentProps {
  person: Person | NewPerson;
  type?: 'create' | 'edit';
  personType?: 'doctor' | 'patient';
  onClose: () => void;
}

export const PersonModalContent = ({
  person,
  onClose,
  type = 'edit',
  personType = 'patient',
}: PersonModalContentProps) => {
  const toast = useToast();
  const { t } = useTranslation();
  const { isMobile } = useViewport();

  const { mutateAsync: updatePatient, status: updatePatientStatus } =
    useUpdatePatient();
  const { mutateAsync: createPatient, status: createPatientStatus } =
    useCreatePatient();

  const { mutateAsync: updateDoctor, status: updateDoctorStatus } =
    useUpdateDoctor();
  const { mutateAsync: createDoctor, status: createDoctorStatus } =
    useCreateDoctor();

  const { mutateAsync: updateContact, status: updateContactStatus } =
    useUpdateContact();

  const [isReadOnly, setIsReadOnly] = useState<boolean>(() => type === 'edit');
  const [currentPerson, setCurrentPerson] = useState<Person | NewPerson>(
    () => ({
      ...person,
    })
  );

  const isIdleCreate =
    (createPatientStatus === 'idle' || createPatientStatus === 'success') &&
    (createDoctorStatus === 'idle' || createDoctorStatus === 'success');
  const isIdleUpdate =
    (updatePatientStatus === 'idle' || updatePatientStatus === 'success') &&
    (updateDoctorStatus === 'idle' || updateDoctorStatus === 'success') &&
    (updateContactStatus === 'idle' || updateContactStatus === 'success');

  const isIdle = isIdleCreate && isIdleUpdate;
  type ToastOptionsProps = {
    result: 'error' | 'success' | 'info' | 'warning' | undefined;
    title: string;
    description: string;
  };
  const toastOptions = ({
    title,
    description,
    result,
  }: ToastOptionsProps): UseToastOptions => {
    return {
      title,
      description,
      status: result,
      duration: 5000,
      isClosable: true,
    };
  };

  const handleCurrentPersonChange = (
    person: Person | NewPerson,
    contactDataCollection: ContactData[]
  ) => {
    setCurrentPerson((cur) => ({
      ...cur,
      ...person,
      contactData: contactDataCollection,
    }));
  };

  const handleArchivePerson = () => {
    if (!isNewPerson(currentPerson)) {
      updatePerson({ ...currentPerson, archived: !currentPerson.archived });
      onClose();
    }
  };

  const createPerson = () => {
    if (!isIdleCreate) return;
    if (!currentPerson?.firstName || !currentPerson?.lastName) {
      toast({
        title: 'Missing Data!',
        description: `Be sure to provide at least the full first and last name of the ${personType}`,
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    const toastType = 'created';
    if (personType === 'patient') {
      createPatient({ patient: currentPerson as Patient }).then(
        (res: Patient) => {
          if (res?.uuid) {
            setCurrentPerson(res);
            toast(
              toastOptions({
                title: `${t(`toast.${personType}`)} ${t(
                  `toast.${toastType}`
                )}.`,
                description: `${currentPerson.lastName}, ${
                  currentPerson.firstName
                } ${t('dict.hasBeen')} ${t(`toast.${toastType}`)}`,
                result: 'success',
              })
            );
          }
        }
      );
    } else {
      createDoctor({ doctor: currentPerson as Doctor }).then((res: Doctor) => {
        if (res?.uuid) {
          setCurrentPerson(res);
          toast(
            toastOptions({
              title: `${t(`toast.${personType}`)} ${t(`toast.${toastType}`)}.`,
              description: `${currentPerson.lastName}, ${
                currentPerson.firstName
              } ${t('dict.hasBeen')} ${t(`toast.${toastType}`)}`,
              result: 'success',
            })
          );
        }
      });
    }
  };

  const updatePerson = (updatePerson: Person) => {
    const toastType = 'updated';
    personType === 'patient'
      ? updatePatient({
          patient: sanitizePatient(updatePerson as Patient),
        }).then((res: Patient) => {
          if (res?.uuid) {
            setCurrentPerson(res);
            toast(
              toastOptions({
                title: `${t(`toast.${personType}`)} ${t(
                  `toast.${toastType}`
                )}.`,
                description: `${updatePerson.lastName}, ${
                  updatePerson.firstName
                } ${t('dict.hasBeen')} ${t(`toast.${toastType}`)}`,
                result: 'success',
              })
            );
          }
        })
      : updateDoctor({ doctor: updatePerson as Doctor }).then((res: Doctor) => {
          if (res?.uuid) {
            setCurrentPerson(res);
            toast(
              toastOptions({
                title: `${t(`toast.${personType}`)} ${t(
                  `toast.${toastType}`
                )}.`,
                description: `${updatePerson.lastName}, ${
                  updatePerson.firstName
                } ${t('dict.hasBeen')} ${t(`toast.${toastType}`)}`,
                result: 'success',
              })
            );
          }
        });
    if (updatePerson.contactData?.length) {
      for (let i = 0; i < updatePerson.contactData.length; i++) {
        if (updatePerson.contactData[i].uuid) {
          updateContact({ contactData: updatePerson.contactData[i] });
        }
      }
    }
  };

  const handleSaveChangesAndClose = () => {
    if (!isNewPerson(currentPerson)) {
      updatePerson(currentPerson);
      onClose();
    }
  };
  const personNotCreated = !currentPerson.uuid;
  return (
    <>
      <ModalHeader
        alignItems="center"
        display="flex"
        justifyContent="space-between"
        bgColor="white"
      >
        <PersonCard person={currentPerson} hasBorder isInteractive={true} />
        {!isMobile && personType === 'patient' && (
          <PersonMetaData
            createdAt={(currentPerson as Patient)?.createdAt}
            updatedAt={(currentPerson as Patient)?.updatedAt}
          />
        )}
        <IconButton
          aria-label="close modal"
          icon={<FaTimes />}
          onClick={onClose}
        />
      </ModalHeader>
      <PersonForm
        isReadOnly={isReadOnly}
        isPending={!isIdle}
        person={currentPerson}
        onChange={handleCurrentPersonChange}
        onCreate={createPerson}
        personType={personType}
      />
      <ModalFooter
        css={{
          padding: '0.5rem',
          display: 'flex',
          marginBottom: isMobile ? '1rem' : undefined,
          flexDirection: 'column',
        }}
      >
        <div
          className="row"
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <ControlWrapper>
            <Button
              leftIcon={<FaArchive />}
              aria-label={`archive ${personType}`}
              colorScheme={currentPerson.archived ? 'green' : 'red'}
              disabled={!isIdle || !currentPerson.uuid}
              size="sm"
              type="button"
              onClick={handleArchivePerson}
            >
              {t(`button.${currentPerson.archived ? 'activate' : 'archive'}`)}
            </Button>
          </ControlWrapper>
          <ControlWrapper>
            {isReadOnly ? (
              <Button
                leftIcon={<FaEdit />}
                aria-label={`edit ${personType}`}
                type="button"
                disabled={!isIdle}
                onClick={() => setIsReadOnly(!isReadOnly)}
                colorScheme="blue"
                size="sm"
              >
                {t('button.edit')}
              </Button>
            ) : (
              <>
                <Button
                  aria-label="cancel changes"
                  type="button"
                  size="sm"
                  onClick={onClose}
                >
                  {t('button.cancel')}
                </Button>
                {!personNotCreated && (
                  <Button
                    aria-label="save changes"
                    type="button"
                    disabled={!isIdle || isNewPerson(currentPerson)}
                    onClick={
                      !isNewPerson(currentPerson)
                        ? handleSaveChangesAndClose
                        : () => null
                    }
                    size="sm"
                    colorScheme="blue"
                  >
                    {t('button.save')}
                  </Button>
                )}
              </>
            )}
          </ControlWrapper>
        </div>
      </ModalFooter>
    </>
  );
};
