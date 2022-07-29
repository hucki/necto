import React, { useState } from 'react';
import { Flex, FormControl, FormLabel, Modal, ModalBody, ModalContent, ModalOverlay, Spinner, Switch, useDisclosure } from '@chakra-ui/react';
import { useAllArchivedInstitutions, useAllInstitutions } from '../../hooks/institution';
import InstitutionList from '../../components/List/InstitutionList';
import { Button } from '../../components/Library';
import { CgAddR } from 'react-icons/cg';
import { InstitutionInput } from '../../types/Institution';
import { InstitutionModal } from '../../components/Institution/InstitutionModal';
import { useViewport } from '../../hooks/useViewport';

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
  const [ showArchived, setShowArchived ] = useState(false);
  const { isLoading, error, institutions } = useAllInstitutions();
  const { isLoading: isLoadingArchivedInstitutions, error: errorArchivedInstitutions, institutions: archivedInstitutions } = useAllArchivedInstitutions();
  const { isOpen: isOpenCreate, onOpen, onClose } = useDisclosure();
  const [ currentInstitution, setCurrentInstitution ] = useState<InstitutionInput>(() => defaultInstitution);

  function showInstitutionCreate() {
    setCurrentInstitution(defaultInstitution);
    onOpen();
  }

  const showInstitutionEdit = (event: React.MouseEvent<HTMLTableRowElement>) => {
    const { id } = event.currentTarget;
    const currentIntitutions = showArchived ? archivedInstitutions : institutions;
    const clickedInstitution = currentIntitutions.find(institution => institution.uuid === id);
    if (clickedInstitution) setCurrentInstitution(clickedInstitution);
    onOpen();
  };

  return (isLoading || isLoadingArchivedInstitutions) ? (
    <Spinner />
  ) : (
    <div>
      <Flex flexDirection={'row'} p="0.5rem" alignItems="center">
        <Button
          aria-label="addInstitution"
          leftIcon={<CgAddR />}
          onClick={() => showInstitutionCreate()}
          colorScheme={'green'}
          w='15rem'
          mx='0.5rem'
        >
          add Institution
        </Button>
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="show-archived">show archived institutions</FormLabel>
          <Switch id="show-archived" colorScheme="red" isChecked={showArchived} onChange={() => setShowArchived(cur => !cur)}/>
        </FormControl>
      </Flex>
      <InstitutionList
        onClickRow={showInstitutionEdit}
        institutions={showArchived ? archivedInstitutions : institutions}
        showArchived={showArchived}
      />
      <Modal isOpen={isOpenCreate} onClose={onClose} scrollBehavior="inside" size={isMobile ? 'full' : undefined}>
        <ModalOverlay
          css={{
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
          <ModalContent minW="80vw">
            <ModalBody>
              {currentInstitution ? <InstitutionModal onClose={onClose} institution={currentInstitution} /> : null}
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </div>
  );
}

export default Institutions;
