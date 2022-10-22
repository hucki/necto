import {
  Button,
  Icon,
  ModalFooter,
  ModalHeader,
  useToast,
  UseToastOptions,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CgSmile } from 'react-icons/cg';
import { FaArchive, FaEdit, FaTimes } from 'react-icons/fa';
import { useUpdateContact } from '../../hooks/contact';
import { useCreateDoctor, useUpdateDoctor } from '../../hooks/doctor';
import { useCreatePatient, useUpdatePatient } from '../../hooks/patient';
import { ContactData } from '../../types/ContactData';
import { Person } from '../../types/Person';
import { IconButton } from '../atoms/Buttons';
import { ControlWrapper } from '../atoms/ControlWrapper';
import { PersonForm } from './PersonForm';

interface PersonModalProps {
  person: Person;
  type?: 'create' | 'edit';
  personType?: 'doctor' | 'patient';
  onClose: () => void;
}

export const PersonModal = ({
  person,
  onClose,
  type = 'edit',
  personType = 'patient',
}: PersonModalProps) => {
  const toast = useToast();
  const { t } = useTranslation();

  const [updatePatient] = useUpdatePatient();
  const [createPatient] = useCreatePatient();

  const [updateDoctor] = useUpdateDoctor();
  const [createDoctor] = useCreateDoctor();

  const [updateContact] = useUpdateContact();

  const [isReadOnly, setIsReadOnly] = useState<boolean>(() => type === 'edit');
  const [currentPerson, setCurrentPerson] = useState<Person>(() => ({
    ...person,
  }));

  type ToastOptionsProps = {
    type: 'created' | 'updated';
    result: 'error' | 'success' | 'info' | 'warning' | undefined;
  };
  const toastOptions = ({
    type,
    result,
  }: ToastOptionsProps): UseToastOptions => {
    return {
      title: `${personType} ${type}.`,
      description: `${personType} ${currentPerson.lastName}, ${currentPerson.firstName} has been ${type}`,
      status: result,
      duration: 5000,
      isClosable: true,
    };
  };

  const handleCurrentPersonChange = (
    person: Person,
    contactDataCollection: ContactData[]
  ) => {
    setCurrentPerson((cur) => ({
      ...cur,
      ...person,
      contactData: contactDataCollection,
    }));
    if (
      !currentPerson.uuid &&
      currentPerson?.firstName &&
      currentPerson?.lastName
    ) {
      onSaveChanges();
    }
  };

  const onSaveChanges = () => {
    if (currentPerson?.firstName && currentPerson?.lastName) {
      if (currentPerson.uuid) {
        // update
        personType === 'patient'
          ? updatePatient({ patient: currentPerson }).then((res) => {
              if (res?.uuid) {
                setCurrentPerson(res);
                toast(toastOptions({ type: 'updated', result: 'success' }));
              }
            })
          : updateDoctor({ doctor: currentPerson }).then((res) => {
              if (res?.uuid) {
                setCurrentPerson(res);
                toast(toastOptions({ type: 'updated', result: 'success' }));
              }
            });
        if (currentPerson.contactData?.length) {
          for (let i = 0; i < currentPerson.contactData.length; i++) {
            if (currentPerson.contactData[i].uuid) {
              updateContact({ contactData: currentPerson.contactData[i] });
            }
          }
        }
      } else {
        // create
        personType === 'patient'
          ? createPatient({ patient: currentPerson }).then((res) => {
              if (res?.uuid) {
                setCurrentPerson(res);
                toast(toastOptions({ type: 'created', result: 'success' }));
              }
            })
          : createDoctor({ doctor: currentPerson }).then((res) => {
              if (res?.uuid) {
                setCurrentPerson(res);
                toast(toastOptions({ type: 'created', result: 'success' }));
              }
            });
      }
    } else {
      toast({
        title: 'Missing Data!',
        description: `Be sure to provide at least the full first and last name of the ${personType}`,
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const onSaveChangesAndClose = () => {
    onSaveChanges();
    onClose();
  };

  return (
    <>
      <ModalHeader
        alignItems="center"
        display="flex"
        justifyContent="space-between"
        fontSize="clamp(0.2rem, 0.5rem + 2vw, 24px)"
      >
        <Icon as={CgSmile} w={10} h={10} mr={2} />
        <div className="person-info">
          {currentPerson.lastName + ', ' + currentPerson.firstName}
        </div>
        <IconButton
          aria-label="close modal"
          icon={<FaTimes />}
          onClick={onClose}
        />
      </ModalHeader>
      <PersonForm
        isReadOnly={isReadOnly}
        person={currentPerson}
        onChange={handleCurrentPersonChange}
        personType={personType}
      />
      <ModalFooter
        css={{
          padding: '0.5rem',
          display: 'flex',
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
              colorScheme="red"
              size="sm"
              type="button"
              onClick={() => console.log(`archive ${personType}`)}
            >
              {t('button.archive')}
            </Button>
          </ControlWrapper>
          <ControlWrapper>
            {isReadOnly ? (
              <Button
                leftIcon={<FaEdit />}
                aria-label={`edit ${personType}`}
                type="button"
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
                <Button
                  aria-label="save changes"
                  type="button"
                  disabled={isReadOnly}
                  onClick={onSaveChangesAndClose}
                  size="sm"
                  colorScheme="blue"
                >
                  {t('button.save')}
                </Button>
              </>
            )}
          </ControlWrapper>
        </div>
      </ModalFooter>
    </>
  );
};
