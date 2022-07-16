import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
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
import { Patient, PatientInput, WaitingPatient } from '../../types/Patient';
import { Button, IconButton, Input } from '../Library';
import {
  RiCheckboxBlankLine,
  RiCheckLine,
  RiSearchLine,
  RiUserAddLine,
} from 'react-icons/ri';
import { useState } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useFilter } from '../../hooks/useFilter';
import React from 'react';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import { useViewport } from '../../hooks/useViewport';
import FilterBar from '../FilterBar/FilterBar';
import * as colors from '../../styles/colors';
import { PatientInfo } from './PatientInfo';
import { getDisplayName } from '../../helpers/displayNames';

interface PatientsListProps {
  patients: Patient[] | WaitingPatient[];
  type?: 'patients' | 'waitingPatients'
}

function PatientsList({ patients, type = 'patients' }: PatientsListProps) {
  const { isMobile } = useViewport();
  const toast = useToast();
  const { t } = useTranslation();
  const { currentCompany } = useFilter();

  const isWaitingPatient = (patient: Patient | WaitingPatient): patient is WaitingPatient => {
    if ('numberInLine' in patient) return true;
    return false;
  };

  // search function
  const [search, setSearch] = useState('');
  const filteredPatients: WaitingPatient[] | Patient[] = patients.filter(
    (patient: Patient | WaitingPatient) =>
      patient.firstName.toLowerCase().includes(search.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(search.toLowerCase()) ||
      patient.street?.toLowerCase().includes(search.toLowerCase()) ||
      patient.city?.toLowerCase().includes(search.toLowerCase()) ||
      patient.careFacility?.toLowerCase().includes(search.toLowerCase()) ||
      patient.notices?.toLowerCase().includes(search.toLowerCase()) ||
      patient.contactData
        ?.filter((contact) => contact.type === 'telephone')
        .findIndex(contact => contact.contact.toLowerCase()
          .includes(search.toLowerCase())) !== -1
  );
  const handleSearch = (event: React.FormEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value);
  };

  // pagination controls
  const rowsPerPage = isMobile ? 6 : 12;
  const numOfPages = Math.ceil(filteredPatients.length / rowsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const { isOpen: isOpenInfo, onOpen: onOpenInfo, onClose: onCloseInfo } = useDisclosure();
  const { isOpen: isOpenCreate, onOpen: onOpenCreate, onClose: onCloseCreate } = useDisclosure();
  const [ currentPatient, setCurrentPatient] = useState<Patient | WaitingPatient | undefined>(undefined);
  const [ newPatient, setNewPatient] = useState<PatientInput | undefined>(undefined);
  function showPatientInfo(patient:Patient) {
    setCurrentPatient(patient);
    onOpenInfo();
  }

  const initNewPatient = () => {
    setNewPatient({
      firstName: '',
      lastName: '',
      title: '',
      gender: '',
      zip: '',
      street: '',
      city: '',
      isAddpayFreed: false,
      careFacility: '',
      notices: '',
      firstContactAt: dayjs().toDate(),
      isWaitingSince: dayjs().toDate(),
      companyId: currentCompany?.uuid,
      telephoneNumber: '',
      mailAddress: '',
    });
  };

  function showPatientCreate() {
    initNewPatient();
    onOpenCreate();
  }

  const PatientRows = (): JSX.Element[] =>
    filteredPatients
      // pagination filter
      .filter(
        (p: Patient | WaitingPatient, i) =>
          i < currentPage * rowsPerPage && i >= (currentPage - 1) * rowsPerPage
      )
      .map((p: Patient | WaitingPatient)=> (
        <Tr key={p.uuid} onClick={() => showPatientInfo(p)}>
          { type === 'waitingPatients' && isWaitingPatient(p) && <Td><b>{p.numberInLine}</b></Td>}
          <Td>{p.firstName}</Td>
          <Td>{p.lastName}</Td>
          <Td>{p.gender}</Td>
          <Td>{p.notices}</Td>
          <Td>{p.doctor && getDisplayName(p.doctor)}</Td>
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
          <Td>{p.careFacility}</Td>
          <Td>
            <Icon
              as={p.isAddpayFreed ? RiCheckLine : RiCheckboxBlankLine}
              w={5}
              h={5}
              color={p.isAddpayFreed ? 'indigo' : 'gray.400'}
            />
          </Td>
          {type === 'waitingPatients'
            ? <Td>{dayjs(p.isWaitingSince).format('ll')}</Td>
            : <Td>{dayjs(p.firstContactAt).format('ll')}</Td>
          }
          {type === 'waitingPatients' && p.events?.length ? (
            <Td>
              <b>
                {
                  p.events.filter((event) => !event.isCancelled)[0].employee
                    ?.firstName
                }
              </b>
              :<br />
              {dayjs(
                p.events.filter((event) => !event.isCancelled)[0].startTime
              ).format('llll')}
            </Td>
          ) : null}
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
        { type === 'patients' && (
          <Button
            aria-label="addPatient"
            leftIcon={<RiUserAddLine />}
            onClick={() => showPatientCreate()}
            colorScheme={'green'}
            w='15rem'
            mx='0.5rem'
          >
            {'add Patient'}
          </Button>
        )}
      </Flex>
      <div className="tableContainer" style={{ height: '100%', minWidth: '100%' }}>
        <Table variant="striped" size="sm" colorScheme="blue">
          <Thead>
            <Tr>
              { type === 'waitingPatients' && <Th width={5}>Nr </Th>}
              <Th>{t('label.firstName')}</Th>
              <Th>{t('label.lastName')}</Th>
              <Th width={2}>{t('label.gender')} </Th>
              <Th>{t('label.notices')} </Th>
              <Th>{t('label.doctor')} </Th>
              <Th>{t('label.telephoneNumber')} </Th>
              <Th>{t('label.mailAddress')} </Th>
              <Th>{t('label.careFacility')} </Th>
              <Th width={5}>{t('label.isAddpayFreed')}</Th>
              {type === 'waitingPatients'
                ? <Th width={7}>{t('label.isWaitingSince')}</Th>
                : <Th width={7}>{t('label.firstContactAt')}</Th>
              }
              {/* {<Th width={5}>{t('label.actions')}</Th>} */}
              {type === 'waitingPatients' && <Th width={5}>{t('label.diagnostic')}</Th>}
            </Tr>
          </Thead>
          <Tbody>
            {PatientRows()}
            {/* {PatientAddRow(currentCompany)} */}
          </Tbody>
        </Table>
      </div>
      {/* pagination controls START */}
      <Flex m={2} alignSelf="flex-end">
        <IconButton
          aria-label="previous page"
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
          aria-label="next page"
          icon={<FaCaretRight />}
          disabled={currentPage === numOfPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        />
      </Flex>
      {/* pagination controls END */}
      <Modal isOpen={isOpenInfo} onClose={onCloseInfo} scrollBehavior="inside" size={isMobile ? 'full' : undefined}>
        <ModalOverlay
          css={{
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
          <ModalContent minW="80vw">
            <ModalBody>
              {currentPatient ? <PatientInfo onClose={onCloseInfo} patient={currentPatient} /> : null }
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
      <Modal isOpen={isOpenCreate} onClose={onCloseCreate} scrollBehavior="inside" size={isMobile ? 'full' : undefined}>
        <ModalOverlay
          css={{
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
          <ModalContent minW="80vw">
            <ModalBody>
              {newPatient ? <PatientInfo onClose={onCloseCreate} patient={newPatient} type="create"/> : null }
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
}

export default PatientsList;
