import {
  Button,
  Flex,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Modal,
  Switch,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import * as colors from '../../../styles/colors';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { CgAddR, CgChevronLeft, CgChevronRight } from 'react-icons/cg';
import { RiCloseLine, RiSearchLine } from 'react-icons/ri';
import { Institution, InstitutionInput } from '../../../types/Institution';
import { IconButton } from '../../atoms/Buttons';
import {
  FormControl,
  Input,
  Label,
  ModalBody,
  ModalContent,
  ModalOverlay,
} from '../../Library';
import { InstitutionModal } from './InstitutionModal';
import { useViewport } from '../../../hooks/useViewport';
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

interface InstitutionListProps {
  institutions: Institution[];
  showArchived: boolean;
  setShowArchived: Dispatch<SetStateAction<boolean>>;
}
const InstitutionList = ({
  institutions,
  showArchived,
  setShowArchived,
}: InstitutionListProps) => {
  const { isMobile } = useViewport();
  const { t } = useTranslation();
  const { isOpen: isOpenCreate, onOpen, onClose } = useDisclosure();
  const [currentInstitution, setCurrentInstitution] =
    useState<InstitutionInput>(() => defaultInstitution);

  const showInstitutionEdit = (
    event: React.MouseEvent<HTMLTableRowElement>
  ) => {
    const { id } = event.currentTarget;

    const clickedInstitution = institutions.find(
      (institution) => institution.uuid === id
    );
    if (clickedInstitution) setCurrentInstitution(clickedInstitution);
    onOpen();
  };
  function showInstitutionCreate() {
    setCurrentInstitution(defaultInstitution);
    onOpen();
  }
  const [search, setSearch] = useState('');
  useEffect(() => {
    if (search) {
      setCurrentPage(1);
    }
  }, [search]);
  const filteredInstitutions: Institution[] = institutions.filter(
    (institution: Institution) =>
      institution.name.toLowerCase().includes(search.toLowerCase()) ||
      institution.description.toLowerCase().includes(search.toLowerCase()) ||
      institution.street?.toLowerCase().includes(search.toLowerCase()) ||
      institution.city?.toLowerCase().includes(search.toLowerCase()) ||
      institution.contactData
        ?.filter((contact) => contact.type === 'telephone')
        .findIndex((contact) =>
          contact.contact.toLowerCase().includes(search.toLowerCase())
        ) !== -1
  ) as Institution[];
  const handleSearch = (event: React.FormEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value);
  };

  const rowsPerPage = 6;
  const numOfPages = Math.ceil(institutions.length / rowsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const tableColumns: (keyof Institution)[] = [
    'name',
    'description',
    'street',
    'zip',
    'city',
  ];
  const tableHead = (
    <Tr>
      {tableColumns.map((column, index) => (
        <Th key={index}>{column}</Th>
      ))}
    </Tr>
  );
  const tableBody = filteredInstitutions.map((institution, index) => (
    <Tr key={index} id={institution.uuid} onClick={showInstitutionEdit}>
      {tableColumns.map((key, index) => (
        <Td key={index}>{institution[key] as string}</Td>
      ))}
    </Tr>
  ));

  return (
    <>
      <Flex flexDirection={'row'} p="0.5rem">
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <RiSearchLine color={colors.indigoLighten80} />
          </InputLeftElement>
          <Input
            id="search"
            name="search"
            type="text"
            value={search}
            onChange={handleSearch}
            onKeyDown={(e) => e.code === 'Escape' && setSearch('')}
            pl="2rem"
          />
          <InputRightElement cursor="pointer" onClick={() => setSearch('')}>
            <RiCloseLine
              color={search ? colors.indigo : colors.indigoLighten80}
            />
          </InputRightElement>
        </InputGroup>
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
        <FormControl>
          <Label htmlFor="show-archived">{t('label.showArchivedData')}</Label>
          <Switch
            id="show-archived"
            colorScheme="red"
            isChecked={showArchived}
            onChange={() => setShowArchived((cur) => !cur)}
          />
        </FormControl>
      </Flex>
      <Table
        size="sm"
        colorScheme={showArchived ? 'orange' : 'green'}
        variant="striped"
      >
        <Thead>{tableHead}</Thead>
        <Tbody textDecoration={showArchived ? 'line-through' : undefined}>
          {tableBody}
        </Tbody>
      </Table>
      {/* pagination controls START */}
      <Flex m={2} alignSelf="flex-end">
        <IconButton
          aria-label="previous page"
          leftIcon={<CgChevronLeft />}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        />
        {new Array(numOfPages).fill(numOfPages).map((_, index) => (
          <Button
            disabled={index + 1 === currentPage}
            key={index}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </Button>
        ))}
        <IconButton
          aria-label="next page"
          icon={<CgChevronRight />}
          disabled={currentPage === numOfPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        />
      </Flex>
      {/* pagination controls END */}
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
    </>
  );
};

export default InstitutionList;
