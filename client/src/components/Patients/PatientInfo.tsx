import { Icon, ModalFooter, ModalHeader, useToast } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaArchive, FaEdit } from 'react-icons/fa';
import { RiUser5Line } from 'react-icons/ri';
import { useCreatePatient, useUpdatePatient } from '../../hooks/patient';
import { Patient } from '../../types/Patient';
import { Button, ControlWrapper } from '../Library';
import { PatientForm } from './PatientForm';

interface PatientInfoProps {
  patient: Patient;
  type?: 'create' | 'view';
  onClose: () => void;
}

export const PatientInfo = ({ patient, onClose, type = 'view' }: PatientInfoProps) => {
  const toast = useToast();
  const  [updatePatient, { error: updatePatientError }] = useUpdatePatient();
  const  [createPatient, { error: createPatientError }] = useCreatePatient();
  const [isReadOnly, setIsReadOnly] = useState<boolean>(() => type === 'view');
  const [currentPatient, setCurrentPatient] = useState<Patient>(() => ({...patient}));

  const handleCurrentPatientChange = (patient: Patient) => {
    setCurrentPatient(cur => ({...cur, ...patient}));
  };

  const onSaveChanges = () => {
    if (currentPatient?.firstName && currentPatient?.lastName) {
      if (type === 'view') {
        setIsReadOnly(!isReadOnly);
        updatePatient({patient: currentPatient}).then((res) => {
          if (res?.uuid) {
            toast({
              title: 'Patient updated.',
              description: `Patient ${res.lastName}, ${res.firstName} has been updated`,
              status: 'success',
              duration: 5000,
              isClosable: true,
            });
            onClose();
          }
        });
      } else {
        createPatient({ patient: currentPatient }).then((res) => {
          if (res?.uuid) {
            toast({
              title: 'Patient created.',
              description: `Patient ${res.lastName}, ${res.firstName} has been created`,
              status: 'success',
              duration: 5000,
              isClosable: true,
            });
            onClose();
          }
        });
      }
    } else {
      toast({
        title: 'Missing Data!',
        description:
          'Be sure to provide at least the full first and last name of the patient',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const { t } = useTranslation();
  return (
    <>
      <ModalHeader alignItems="center" display="flex">
        <Icon as={RiUser5Line} w={10} h={10} mr={2} />
        {currentPatient.lastName + ', ' + currentPatient.firstName}
      </ModalHeader>
      <PatientForm type={isReadOnly ? 'view' : 'update'} patient={currentPatient} onChange={handleCurrentPatientChange}/>
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
              aria-label="delete event"
              colorScheme="red"
              size="sm"
              type="button"
              onClick={() => console.log('archive patient')}
            >
              {t('button.archive')}
            </Button>
          </ControlWrapper>
          <ControlWrapper>
            {isReadOnly ? (
              <Button
                leftIcon={<FaEdit />}
                aria-label="edit event"
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
