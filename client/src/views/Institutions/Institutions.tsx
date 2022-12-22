import React, { useState } from 'react';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Switch,
  useDisclosure,
} from '@chakra-ui/react';
import {
  useAllArchivedInstitutions,
  useAllInstitutions,
} from '../../hooks/institution';
import InstitutionList from '../../components/organisms/Institution/InstitutionList';
import { CgAddR } from 'react-icons/cg';
import { InstitutionInput } from '../../types/Institution';
import { InstitutionModal } from '../../components/organisms/Institution/InstitutionModal';
import { useViewport } from '../../hooks/useViewport';
import { FullPageSpinner } from '../../components/atoms/LoadingSpinner';
import { useTranslation } from 'react-i18next';

const defaultInstitution: InstitutionInput = {
  name: '',
  description: '',
  street: '',
  zip: '',
  city: '',
  telephoneNumber: '',
  mailAddress: '',
  archived: false,
};

function Institutions(): JSX.Element {
  const { isMobile } = useViewport();
  const { t } = useTranslation();
  const [showArchived, setShowArchived] = useState(false);
  const { isLoading, institutions } = useAllInstitutions();
  const {
    isLoading: isLoadingArchivedInstitutions,
    institutions: archivedInstitutions,
  } = useAllArchivedInstitutions();
  const { isOpen: isOpenCreate, onOpen, onClose } = useDisclosure();
  const [currentInstitution, setCurrentInstitution] =
    useState<InstitutionInput>(() => defaultInstitution);

  function showInstitutionCreate() {
    setCurrentInstitution(defaultInstitution);
    onOpen();
  }

  const showInstitutionEdit = (
    event: React.MouseEvent<HTMLTableRowElement>
  ) => {
    const { id } = event.currentTarget;
    const currentIntitutions = showArchived
      ? archivedInstitutions
      : institutions;
    const clickedInstitution = currentIntitutions.find(
      (institution) => institution.uuid === id
    );
    if (clickedInstitution) setCurrentInstitution(clickedInstitution);
    onOpen();
  };

  return isLoading || isLoadingArchivedInstitutions ? (
    <FullPageSpinner />
  ) : (
    <div>
      <Flex flexDirection={'row'} p="0.5rem" alignItems="center">
        <Button
          aria-label="addInstitution"
          leftIcon={<CgAddR />}
          onClick={() => showInstitutionCreate()}
          colorScheme={'green'}
          w="15rem"
          mx="0.5rem"
        >
          {t('button.add')}
        </Button>
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="show-archived">
            {t('label.showArchivedData')}
          </FormLabel>
          <Switch
            id="show-archived"
            colorScheme="red"
            isChecked={showArchived}
            onChange={() => setShowArchived((cur) => !cur)}
          />
        </FormControl>
      </Flex>
      <InstitutionList
        onClickRow={showInstitutionEdit}
        institutions={showArchived ? archivedInstitutions : institutions}
        showArchived={showArchived}
      />
      <Modal
        isOpen={isOpenCreate}
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
            <ModalBody>
              {currentInstitution ? (
                <InstitutionModal
                  onClose={onClose}
                  institution={currentInstitution}
                />
              ) : null}
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </div>
  );
}

export default Institutions;
