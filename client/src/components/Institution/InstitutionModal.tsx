import React, { useState } from 'react';
import {
  Icon,
  ModalFooter,
  ModalHeader,
  useToast,
  UseToastOptions,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { CgOrganisation } from 'react-icons/cg';
import { FaArchive, FaTimes } from 'react-icons/fa';
import {
  useCreateInstitution,
  useUpdateInstitution,
} from '../../hooks/institution';
import { Institution } from '../../types/Institution';
import { Button, ControlWrapper, IconButton } from '../Library';
import { InstitutionForm } from './InstitutionForm';

interface InstitutionModalProps {
  institution: Institution;
  onClose: () => void;
}

export const InstitutionModal = ({
  institution,
  onClose,
}: InstitutionModalProps) => {
  const toast = useToast();
  const { t } = useTranslation();

  const [updateInstitution, { error: updateInstitutionError }] =
    useUpdateInstitution();
  const [createInstitution, { error: createInstitutionError }] =
    useCreateInstitution();

  const [currentInstitution, setCurrentInstitution] = useState<Institution>(
    () => ({ ...institution })
  );

  const handleCurrentInstitutionChange = (institution: Institution) => {
    setCurrentInstitution((cur) => ({ ...cur, ...institution }));
  };

  type UpdateType = 'save' | 'archive' | 'activate';

  const onSaveChanges = (type: UpdateType) => {
    const institutionUpdate =
      type === 'archive' || type === 'activate'
        ? {
            ...currentInstitution,
            archived: type === 'activate' ? false : true,
          }
        : currentInstitution;
    if (institutionUpdate?.name) {
      if (institutionUpdate.uuid) {
        const updateSuccessToastOptions: UseToastOptions = {
          title: `Institution ${type}d.`,
          description: `Institution ${institutionUpdate.name} has been ${type}d`,
          status: type === 'archive' ? 'info' : 'success',
          duration: 5000,
          isClosable: true,
        };
        updateInstitution({ institution: institutionUpdate }).then((res) => {
          if (res?.uuid) {
            toast(updateSuccessToastOptions);
            onClose();
          }
        });
      } else {
        const createSuccesToastOptions: UseToastOptions = {
          title: 'Institution created.',
          description: `Institution ${institutionUpdate.name} has been created`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        };
        createInstitution({ institution: institutionUpdate }).then((res) => {
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
      <ModalHeader
        alignItems="center"
        display="flex"
        justifyContent="space-between"
      >
        <div
          className="institution-info"
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Icon as={CgOrganisation} w={10} h={10} mr={2} />
          {currentInstitution.name}{' '}
          {currentInstitution.description ? (
            <em style={{ fontSize: '1rem' }}>
              &nbsp;{`(${currentInstitution.description})`}
            </em>
          ) : null}
        </div>
        <IconButton
          aria-label="close modal"
          icon={<FaTimes />}
          onClick={onClose}
        />
      </ModalHeader>
      <InstitutionForm
        institution={currentInstitution}
        onChange={handleCurrentInstitutionChange}
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
              aria-label="archive Institution"
              colorScheme="red"
              disabled={!currentInstitution.uuid}
              size="sm"
              type="button"
              onClick={() =>
                onSaveChanges(
                  currentInstitution.archived ? 'activate' : 'archive'
                )
              }
            >
              {t(
                `button.${currentInstitution.archived ? 'activate' : 'archive'}`
              )}
            </Button>
          </ControlWrapper>
          <ControlWrapper>
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
              disabled={currentInstitution.archived}
              type="button"
              onClick={() => onSaveChanges('save')}
              size="sm"
              colorScheme="blue"
            >
              {t('button.save')}
            </Button>
          </ControlWrapper>
        </div>
      </ModalFooter>
    </>
  );
};
