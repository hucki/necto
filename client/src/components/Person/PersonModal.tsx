import { Icon, ModalFooter, ModalHeader, useToast, UseToastOptions } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaArchive, FaEdit } from 'react-icons/fa';
import { RiUser5Line } from 'react-icons/ri';
import { useCreateDoctor, useUpdateDoctor } from '../../hooks/doctor';
import { useCreatePatient, useUpdatePatient } from '../../hooks/patient';
import { Person } from '../../types/Person';
import { Button, ControlWrapper } from '../Library';
import { PersonForm } from './PersonForm';

interface PersonModalProps {
  person: Person;
  type?: 'create' | 'view';
  personType?: 'doctor' | 'patient';
  onClose: () => void;
}

export const PersonModal = ({person, onClose, type = 'view', personType = 'patient'}: PersonModalProps) => {
  const toast = useToast();
  const { t } = useTranslation();

  const  [updatePatient, { error: updatePatientError }] = useUpdatePatient();
  const  [createPatient, { error: createPatientError }] = useCreatePatient();

  const  [updateDoctor, { error: updateDoctorError }] = useUpdateDoctor();
  const  [createDoctor, { error: createDoctorError }] = useCreateDoctor();

  const [isReadOnly, setIsReadOnly] = useState<boolean>(() => type === 'view');
  const [currentPerson, setCurrentPerson] = useState<Person>(() => ({...person}));

  const handleCurrentPersonChange = (person: Person) => {
    setCurrentPerson(cur => ({...cur, ...person}));
  };

  const onSaveChanges = () => {
    if (currentPerson?.firstName && currentPerson?.lastName) {
      if (type === 'view') {
        setIsReadOnly(!isReadOnly);
        const updateSuccessToastOptions: UseToastOptions = {
          title: `${personType} updated.`,
          description: `${personType} ${currentPerson.lastName}, ${currentPerson.firstName} has been updated`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        };
        personType === 'patient'
          ? updatePatient({patient: currentPerson}).then((res) => {
            if (res?.uuid) {
              toast(updateSuccessToastOptions);
              onClose();
            }
          })
          : updateDoctor({doctor: currentPerson}).then((res) => {
            if (res?.uuid) {
              toast(updateSuccessToastOptions);
              onClose();
            }
          });

      } else {
        const createSuccesToastOptions: UseToastOptions =
          {
            title: `${personType} created.`,
            description: `${personType} ${currentPerson.lastName}, ${currentPerson.firstName} has been created`,
            status: 'success',
            duration: 5000,
            isClosable: true,
          };
        personType === 'patient'
          ? createPatient({ patient: currentPerson }).then((res) => {
            if (res?.uuid) {
              toast(createSuccesToastOptions);
              onClose();
            }
          })
          : createDoctor({ doctor: currentPerson }).then((res) => {
            if (res?.uuid) {
              toast(createSuccesToastOptions);
              onClose();
            }
          });
      }
    } else {
      toast({
        title: 'Missing Data!',
        description:
          `Be sure to provide at least the full first and last name of the ${personType}`,
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <ModalHeader alignItems="center" display="flex">
        <Icon as={RiUser5Line} w={10} h={10} mr={2} />
        {currentPerson.lastName + ', ' + currentPerson.firstName}
      </ModalHeader>
      <PersonForm type={isReadOnly ? 'view' : 'update'} person={currentPerson} onChange={handleCurrentPersonChange} personType={personType}/>
      {/* <PatientForm type={isReadOnly ? 'view' : 'update'} patient={currentPerson} onChange={handleCurrentPatientChange}/> */}
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
              <Button
                aria-label="save changes"
                type="button"
                disabled={isReadOnly}
                onClick={onSaveChanges}
                size="sm"
                colorScheme="blue"
              >
                {t('button.save')}
              </Button>
            )}
          </ControlWrapper>
        </div>
      </ModalFooter>
    </>
  );
};