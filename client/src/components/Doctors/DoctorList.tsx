import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Flex,
  useToast,
  InputGroup,
  InputLeftElement,
  Icon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody
} from '@chakra-ui/react';
// import { Patient, PatientInput, WaitingPatient } from '../../types/Patient';
import { Button, DatePicker, IconButton, Input } from '../Library';
import {
  RiCheckboxBlankLine,
  RiCheckLine,
  RiSearchLine,
  RiUserAddLine,
} from 'react-icons/ri';
import { useEffect, useState } from 'react';
import { useCreatePatient } from '../../hooks/patient';
import { Company } from '../../types/Company';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useFilter } from '../../hooks/useFilter';
import React from 'react';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import { useViewport } from '../../hooks/useViewport';
import FilterBar from '../FilterBar/FilterBar';
import * as colors from '../../styles/colors';
import { Doctor, DoctorInput } from '../../types/Doctor';
// import { PatientInfo } from './PatientInfo';

interface DoctorListProps {
  doctors: Doctor[]
}

function DoctorList({ doctors }: DoctorListProps) {
  const { isMobile } = useViewport();
  const toast = useToast();
  const { t } = useTranslation();
  const { currentCompany } = useFilter();

  // search function
  const [search, setSearch] = useState('');
  const filteredDoctors: Doctor[] = doctors.filter(
    (patient: Doctor) =>
      patient.firstName.toLowerCase().includes(search.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(search.toLowerCase()) ||
      patient.street?.toLowerCase().includes(search.toLowerCase()) ||
      patient.city?.toLowerCase().includes(search.toLowerCase()) ||
      patient.contactData
        ?.filter((contact) => contact.type === 'telephone')
        .findIndex(contact => contact.contact.toLowerCase()
          .includes(search.toLowerCase())) !== -1
  );
  const handleSearch = (event: React.FormEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value);
  };
  // pagination
  const rowsPerPage = isMobile ? 6 : 12;
  const numOfPages = Math.ceil(filteredDoctors.length / rowsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const { isOpen: isOpenInfo, onOpen: onOpenInfo, onClose: onCloseInfo } = useDisclosure();
  const { isOpen: isOpenCreate, onOpen: onOpenCreate, onClose: onCloseCreate } = useDisclosure();
  const [ currentPatient, setCurrentPatient] = useState<Doctor | undefined>(undefined);
  const [ newPatient, setNewPatient] = useState<Doctor | undefined>(undefined);
  function showPatientInfo(patient:Doctor) {
    setCurrentPatient(patient);
    onOpenInfo();
  }
  function showDoctorCreate() {
    onOpenCreate();
  }

  const DoctorRows = (): JSX.Element[] =>
    filteredDoctors
      .filter(
        (p: Doctor, i) =>
          i < currentPage * rowsPerPage && i >= (currentPage - 1) * rowsPerPage
      )
      .map((p: Doctor )=> (
        <Tr key={p.uuid} onClick={() => showPatientInfo(p)}>
          <Td>{p.title}</Td>
          <Td>{p.firstName}</Td>
          <Td>{p.lastName}</Td>
          <Td>{p.street}</Td>
          <Td>{p.zip}</Td>
          <Td>{p.city}</Td>
          <Td>
            {p.contactData
              ?.filter((c) => c.type === 'telephone')
              .map((tel) => (
                <div key={tel.uuid}>{tel.contact}</div>
              ))}
          </Td>
          <Td>
            {p.contactData
              ?.filter((c) => c.type === 'email')
              .map((tel) => (
                <div key={tel.uuid}>{tel.contact}</div>
              ))}
          </Td>
        </Tr>
      ));

  return (
    <>
      <Flex flexDirection={isMobile ? 'column' : 'row'} p="0.5rem">
        <InputGroup>
          <InputLeftElement pointerEvents="none" >
            <RiSearchLine color={colors.indigoLighten80} />
          </InputLeftElement>
          <Input
            id="search"
            name="search"
            type="text"
            onChange={handleSearch}
            pl="2rem"
          />
        </InputGroup>
        <FilterBar hasCompanyFilter />
        <Button
          aria-label="addPatient"
          leftIcon={<RiUserAddLine />}
          onClick={() => showDoctorCreate()}
          colorScheme={'green'}
          w='15rem'
          mx='0.5rem'
        >
          {'add Doctor'}
        </Button>
      </Flex>
      <div className="tableContainer" style={{ height: '100%', minWidth: '100%' }}>
        <Table variant="striped" size="sm" colorScheme="blue">
          <Thead>
            <Tr>
              <Th>{t('label.title')}</Th>
              <Th>{t('label.firstName')}</Th>
              <Th>{t('label.lastName')}</Th>
              <Th>{t('label.street')}</Th>
              <Th>{t('label.zip')}</Th>
              <Th>{t('label.city')}</Th>
              <Th>{t('label.telephoneNumber')} </Th>
              <Th>{t('label.mailAddress')} </Th>
            </Tr>
          </Thead>
          <Tbody>
            {DoctorRows()}
          </Tbody>
        </Table>
      </div>
      {/* pagination controls */}

      <Flex m={2} alignSelf="flex-end">
        <IconButton
          aria-label="previous day"
          leftIcon={<FaCaretLeft />}
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
          aria-label="next day"
          icon={<FaCaretRight />}
          disabled={currentPage === numOfPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        />
      </Flex>
      <Modal isOpen={isOpenInfo} onClose={onCloseInfo}>
        <ModalOverlay
          css={{
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
          <ModalContent minW="80vw">
            <ModalBody>
              🚧 Work in Progress
              {/* {currentPatient ? <PatientInfo onClose={onCloseInfo} patient={currentPatient} /> : null } */}
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
      <Modal isOpen={isOpenCreate} onClose={onCloseCreate}>
        <ModalOverlay
          css={{
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
          <ModalContent minW="80vw">
            <ModalBody>
              🚧 Work in Progress
              {/* {newPatient ? <PatientInfo onClose={onCloseCreate} patient={newPatient} type="create"/> : null } */}
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
}

export default DoctorList;
