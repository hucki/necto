import React, { useState } from 'react';
import { Modal, ModalBody, ModalContent, ModalOverlay, Spinner, useDisclosure } from '@chakra-ui/react';
import { useAllInstitutions } from '../../hooks/institution';
import InstitutionList from '../../components/List/InstitutionList';
import { Button } from '../../components/Library';
import { CgAddR } from 'react-icons/cg';
import { Institution, InstitutionInput } from '../../types/Institution';
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
};

function Institutions(): JSX.Element {
  const { isMobile } = useViewport();
  const { isLoading, error, institutions } = useAllInstitutions();
  const { isOpen: isOpenCreate, onOpen: onOpenCreate, onClose: onCloseCreate } = useDisclosure();
  const [currentInstitution, setCurrentInstitution] = useState<InstitutionInput>(() => defaultInstitution);


  function showInstitutionCreate() {
    setCurrentInstitution(defaultInstitution);
    onOpenCreate();
  }

  return isLoading ? (
    <Spinner />
  ) : (
    <div>
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
      <InstitutionList institutions={institutions}/>
      <Modal isOpen={isOpenCreate} onClose={onCloseCreate} scrollBehavior="inside" size={isMobile ? 'full' : undefined}>
        <ModalOverlay
          css={{
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
          <ModalContent minW="80vw">
            <ModalBody>
              {currentInstitution ? <InstitutionModal onClose={onCloseCreate} institution={currentInstitution} type="create" /> : null}
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </div>
  );
}

export default Institutions;
