import {
  Button,
  Flex,
  Icon,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  RiCheckboxBlankLine,
  RiCheckLine,
  RiSearchLine,
  RiUserAddLine,
} from 'react-icons/ri';
import { getDisplayName } from '../../../helpers/displayNames';
import { useFilter } from '../../../hooks/useFilter';
import { useViewport } from '../../../hooks/useViewport';
import { Doctor } from '../../../types/Doctor';
import { Patient, WaitingPatient } from '../../../types/Patient';
import * as colors from '../../../styles/colors';
import { Input } from '../../Library';
import { PersonModal } from './PersonModal';
import { Person } from '../../../types/Person';
import { CgChevronLeft, CgChevronRight } from 'react-icons/cg';
import { IconButton } from '../../atoms/Buttons';
import { PersonCard } from '../../molecules/Cards/PersonCard';

type ListType = 'doctors' | 'patients' | 'waitingPatients';

interface PersonListProps {
  persons: Doctor[] | Patient[] | WaitingPatient[];
}

function PersonList({ persons }: PersonListProps) {
  const { isMobile } = useViewport();
  const { t } = useTranslation();
  const { currentCompany } = useFilter();
  const [listType, setListType] = useState<ListType>('patients');

  const isWaitingPatientList = (
    persons: Person[]
  ): persons is WaitingPatient[] => {
    if (persons[0] && 'numberInLine' in persons[0]) return true;
    return false;
  };

  const isPatientList = (persons: Person[]): persons is Patient[] => {
    if (persons[0] && 'firstContactAt' in persons[0]) return true;
    return false;
  };

  const isDoctorList = (persons: Person[]): persons is Doctor[] => {
    if (listType !== 'waitingPatients' && listType !== 'patients') return true;
    return false;
  };

  useEffect(() => {
    const type: ListType = isWaitingPatientList(persons)
      ? 'waitingPatients'
      : isPatientList(persons)
      ? 'patients'
      : 'doctors';
    if (type !== listType) setListType(type);
  }, [persons]);

  const isWaitingPatient = (person: Person): person is WaitingPatient => {
    if ('numberInLine' in person) return true;
    return false;
  };

  const isPatient = (person: Person): person is Patient => {
    if ('firstContactAt' in person) return true;
    return false;
  };

  const isDoctor = (person: Person): person is Doctor => {
    if (!isWaitingPatient(person) && !isPatient(person)) return true;
    return false;
  };

  // search function
  const [search, setSearch] = useState('');
  useEffect(() => {
    if (search) {
      setCurrentPage(1);
    }
  }, [search]);
  const filteredPatients: Patient[] | WaitingPatient[] =
    isWaitingPatientList(persons) || isPatientList(persons)
      ? (persons.filter(
          (person: Patient | WaitingPatient) =>
            ((isPatient(person) || isWaitingPatient(person)) &&
              person.firstName.toLowerCase().includes(search.toLowerCase())) ||
            person.lastName.toLowerCase().includes(search.toLowerCase()) ||
            person.street?.toLowerCase().includes(search.toLowerCase()) ||
            person.city?.toLowerCase().includes(search.toLowerCase()) ||
            person.institution?.name
              ?.toLowerCase()
              .includes(search.toLowerCase()) ||
            person.notices?.toLowerCase().includes(search.toLowerCase()) ||
            person.contactData
              ?.filter((contact) => contact.type === 'telephone')
              .findIndex((contact) =>
                contact.contact.toLowerCase().includes(search.toLowerCase())
              ) !== -1
        ) as Patient[] | WaitingPatient[])
      : ([] as Patient[] | WaitingPatient[]);

  const allDoctors = isDoctorList(persons) ? persons : [];
  const filteredDoctors = allDoctors.filter(
    (person: Doctor) =>
      person.firstName.toLowerCase().includes(search.toLowerCase()) ||
      person.lastName.toLowerCase().includes(search.toLowerCase()) ||
      person.street?.toLowerCase().includes(search.toLowerCase()) ||
      person.city?.toLowerCase().includes(search.toLowerCase()) ||
      person.contactData
        ?.filter((contact) => contact.type === 'telephone')
        .findIndex((contact) =>
          contact.contact.toLowerCase().includes(search.toLowerCase())
        ) !== -1
  );

  const filteredPersons: Person[] =
    listType === 'doctors'
      ? filteredDoctors
      : isWaitingPatientList(filteredPatients)
      ? filteredPatients
      : filteredPatients;

  filteredPersons.sort((a: Person, b: Person) =>
    isWaitingPatient(a) && isWaitingPatient(b)
      ? a.numberInLine >= b.numberInLine
        ? 1
        : -1
      : a.lastName.toLowerCase() >= b.lastName.toLowerCase()
      ? 1
      : -1
  );

  const handleSearch = (event: React.FormEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value);
  };

  // pagination Config
  const rowsPerPage = isMobile ? 10 : 15;
  const numOfPages = Math.ceil(filteredPersons.length / rowsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  // modal control
  const {
    isOpen: isOpenInfo,
    onOpen: onOpenInfo,
    onClose: onCloseInfo,
  } = useDisclosure();
  const {
    isOpen: isOpenCreate,
    onOpen: onOpenCreate,
    onClose: onCloseCreate,
  } = useDisclosure();

  // handle selected / new Person
  const [currentPerson, setCurrentPerson] = useState<
    Person | WaitingPatient | undefined
  >(undefined);
  const [newPerson, setNewPerson] = useState<Patient | Doctor | undefined>(
    undefined
  );
  function showPersonInfo(person: Person) {
    setCurrentPerson({
      ...person,
      notices: isPatient(person) ? person.notices || '' : undefined,
      medicalReport: isPatient(person) ? person.medicalReport || '' : undefined,
    });
    onOpenInfo();
  }

  const initNewPerson = () => {
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
      listType === 'doctors' ? null : patientFields
    );
    setNewPerson({ ...newPerson });
  };

  function showPersonCreate() {
    initNewPerson();
    onOpenCreate();
  }

  const PersonRows = (): JSX.Element[] =>
    filteredPersons
      // pagination Filter
      .filter(
        (_p: Person, i: number) =>
          i < currentPage * rowsPerPage && i >= (currentPage - 1) * rowsPerPage
      )
      .map((p: Person) => (
        <Tr key={p.uuid} onClick={() => showPersonInfo(p)}>
          {isWaitingPatient(p) && (
            <Td>
              <b>{p.numberInLine}</b>
            </Td>
          )}
          <Td>
            <PersonCard person={p} />
          </Td>
          {!isDoctor(p) && (
            <>
              <Td textAlign="center">
                <Icon
                  as={p.isAddpayFreed ? RiCheckLine : RiCheckboxBlankLine}
                  w={5}
                  h={5}
                  color={p.isAddpayFreed ? 'indigo' : 'gray.400'}
                />
              </Td>
              <Td textAlign="center">
                <Icon
                  as={p.hasContract ? RiCheckLine : RiCheckboxBlankLine}
                  w={5}
                  h={5}
                  color={p.hasContract ? 'green' : 'red'}
                />
              </Td>
              <Td textAlign="center">{p.gender}</Td>
            </>
          )}
          <Td>
            {p.contactData
              ?.filter((c) => c.type === 'email')
              .map((tel) => (
                <div key={tel.uuid}>{tel.contact}</div>
              ))}
          </Td>
          {!isDoctor(p) && (
            <>
              <Td>{p.notices}</Td>
              <Td>
                {p.doctor &&
                  getDisplayName({ person: p.doctor, type: 'short' })}
              </Td>
            </>
          )}
          {isWaitingPatient(p) ? (
            <Td textAlign="center">{dayjs(p.isWaitingSince).format('ll')}</Td>
          ) : !isDoctor(p) ? (
            <Td textAlign="center">{dayjs(p.firstContactAt).format('ll')}</Td>
          ) : null}
          {isWaitingPatient(p) &&
          p.events?.length &&
          p.events.filter((event) => !event.isCancelled).length ? (
            <Td>
              <b>
                {
                  p.events.filter((event) => !event.isCancelled)[0].employee
                    ?.alias
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
      <Flex flexDirection={'row'} p="0.5rem">
        <InputGroup>
          <InputLeftElement pointerEvents="none">
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
        {/* <FilterBar hasCompanyFilter /> */}
        {listType !== 'waitingPatients' && (
          <Button
            aria-label={`add${listType === 'doctors' ? 'Doctor' : 'Patient'}`}
            leftIcon={<RiUserAddLine />}
            onClick={() => showPersonCreate()}
            colorScheme={'green'}
            w="15rem"
            mx="0.5rem"
          >
            {`add ${listType === 'doctors' ? 'Doctor' : 'Patient'}`}
          </Button>
        )}
      </Flex>
      <div
        className="table-container"
        style={{
          height: '100%',
          width: '100%',
        }}
      >
        {/** had to add default prop values from https://chakra-ui.com/docs/components/table/usage#table-container
         * to make horiz. scrolling working */}
        <Table
          variant="striped"
          size="xs"
          colorScheme="green"
          display="block"
          overflowX="auto"
          overflowY="hidden"
          maxWidth="100%"
          whiteSpace="nowrap"
        >
          <Thead>
            <Tr>
              {listType === 'waitingPatients' && <Th width={5}>Nr </Th>}
              <Th></Th>
              {listType !== 'doctors' && (
                <>
                  <Th width={5}>{t('label.isAddpayFreed')}</Th>
                  <Th width={5}>{t('label.hasContract')}</Th>
                  <Th width={2}>{t('label.gender')} </Th>
                </>
              )}
              <Th>{t('label.mailAddress')} </Th>
              {listType !== 'doctors' && (
                <>
                  <Th>{t('label.notices')} </Th>
                  <Th>{t('label.doctor')} </Th>
                </>
              )}
              {listType === 'waitingPatients' ? (
                <Th width={7}>{t('label.isWaitingSince')}</Th>
              ) : listType !== 'doctors' ? (
                <Th width={7}>{t('label.firstContactAt')}</Th>
              ) : null}
              {listType === 'waitingPatients' && (
                <Th width={5}>{t('label.diagnostic')}</Th>
              )}
            </Tr>
          </Thead>
          <Tbody>{PersonRows()}</Tbody>
        </Table>
      </div>
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
        isOpen={isOpenInfo}
        onClose={onCloseInfo}
        scrollBehavior="inside"
        size={isMobile ? 'full' : undefined}
      >
        <ModalOverlay
          css={{
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
          <ModalContent minW="80vw">
            <ModalBody
              display={'flex'}
              flexDirection={'column'}
              justifyContent={'space-between'}
            >
              {currentPerson ? (
                <PersonModal
                  onClose={onCloseInfo}
                  person={currentPerson}
                  personType={listType !== 'doctors' ? 'patient' : 'doctor'}
                />
              ) : null}
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
      <Modal
        isOpen={isOpenCreate}
        onClose={onCloseCreate}
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
              {newPerson ? (
                <PersonModal
                  onClose={onCloseCreate}
                  person={newPerson}
                  personType={listType !== 'doctors' ? 'patient' : 'doctor'}
                  type="create"
                />
              ) : null}
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
}

export default PersonList;
