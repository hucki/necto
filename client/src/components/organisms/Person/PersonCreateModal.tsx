import { Modal } from '@chakra-ui/react';
import React, { useState } from 'react';
import { ModalBody, ModalContent, ModalOverlay } from '../../Library';
import { useViewport } from '../../../hooks/useViewport';
import { PersonModalContent } from './PersonModalContent';
import { NewPerson, isDoctor } from '../../../types/Person';
import dayjs from 'dayjs';
import { useFilter } from '../../../hooks/useFilter';

type PersonCreateModalProps = {
  isOpen: boolean;
  personType: 'doctor' | 'patient';
  onClose: () => void;
};
export const PersonCreateModal = ({
  isOpen = false,
  onClose,
  personType,
}: PersonCreateModalProps) => {
  const { isMobile } = useViewport();
  const { currentCompany } = useFilter();
  const getNewPerson = () => {
    const sharedFields = {
      firstName: '',
      lastName: '',
      title: '',
      gender: '',
      zip: '',
      street: '',
      city: '',
    };
    const patientFields = {
      isAddpayFreed: false,
      careFacility: '',
      notices: '',
      medicalReport: '',
      firstContactAt: dayjs().toDate(),
      isWaitingSince: dayjs().toDate(),
      companyId: currentCompany?.uuid,
    };
    const newPerson = Object.assign(
      sharedFields,
      personType === 'doctor' ? null : patientFields
    );
    return newPerson;
  };
  const [newPerson] = useState<NewPerson | undefined>(() => getNewPerson());

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior="inside"
      size={isMobile ? 'full' : undefined}
    >
      <ModalOverlay
        css={{
          backgroundColor: 'rgba(0,0,0,0.3)',
        }}
      >
        <ModalContent minW="80vw">
          <ModalBody height="fit-content">
            {newPerson ? (
              <PersonModalContent
                onClose={onClose}
                person={newPerson}
                personType={isDoctor(newPerson) ? 'doctor' : 'patient'}
                type="create"
              />
            ) : null}
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
