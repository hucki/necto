import { Icon, ModalFooter, ModalHeader, useToast, UseToastOptions } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaArchive, FaEdit, FaTimes } from 'react-icons/fa';
import { RiUser5Line } from 'react-icons/ri';
import { useCreateInstitution, useUpdateInstitution } from '../../hooks/institution';
import { Institution } from '../../types/Institution';
import { Button, ControlWrapper, IconButton } from '../Library';
import { InstitutionForm } from './InstitutionForm';

interface InstitutionModalProps {
  institution: Institution;
  type?: 'create' | 'view';
  onClose: () => void;
}

export const InstitutionModal = ({institution, onClose, type = 'view'}: InstitutionModalProps) => {
  const toast = useToast();
  const { t } = useTranslation();

  const  [updateInstitution, { error: updateInstitutionError }] = useUpdateInstitution();
  const  [createInstitution, { error: createInstitutionError }] = useCreateInstitution();

  const [isReadOnly, setIsReadOnly] = useState<boolean>(() => type === 'view');
  const [currentInstitution, setCurrentInstitution] = useState<Institution>(() => ({...institution}));

  const handleCurrentInstitutionChange = (institution: Institution) => {
    setCurrentInstitution(cur => ({...cur, ...institution}));
  };

  const onSaveChanges = () => {
    if (currentInstitution?.name) {
      if (type === 'view') {
        setIsReadOnly(!isReadOnly);
        const updateSuccessToastOptions: UseToastOptions = {
          title: 'Institution updated.',
          description: `Institution ${currentInstitution.name} has been updated`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        };
        updateInstitution({institution: currentInstitution}).then((res) => {
          if (res?.uuid) {
            toast(updateSuccessToastOptions);
            onClose();
          }
        });
      } else {
        const createSuccesToastOptions: UseToastOptions =
          {
            title: 'Institution created.',
            description: `Institution ${institution.name} has been created`,
            status: 'success',
            duration: 5000,
            isClosable: true,
          };
        createInstitution({ institution: currentInstitution }).then((res) => {
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
          'Be sure to provide at least the full name of the Institution',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <ModalHeader alignItems="center" display="flex" justifyContent="space-between">
        <div className="institution-info">
          <Icon as={RiUser5Line} w={10} h={10} mr={2} />
          {currentInstitution.name}
        </div>
        <IconButton
          aria-label="close modal"
          icon={<FaTimes />}
          onClick={onClose}
        />
      </ModalHeader>
      <InstitutionForm type={isReadOnly ? 'view' : 'update'} institution={currentInstitution} onChange={handleCurrentInstitutionChange}/>
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
              aria-label="archive Institution"
              colorScheme="red"
              size="sm"
              type="button"
              onClick={() => console.log('archive Institution')}
            >
              {t('button.archive')}
            </Button>
          </ControlWrapper>
          <ControlWrapper>
            {isReadOnly ? (
              <Button
                leftIcon={<FaEdit />}
                aria-label="edit Institution"
                type="button"
                onClick={() => setIsReadOnly(!isReadOnly)}
                colorScheme="blue"
                size="sm"
              >
                {t('button.edit')}
              </Button>
            ) : (
              <>
                <Button aria-label="cancel changes" type="button" size="sm" onClick={onClose}>
                  {t('button.cancel')}
                </Button>
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
              </>
            )}
          </ControlWrapper>
        </div>
      </ModalFooter>
    </>
  );
};