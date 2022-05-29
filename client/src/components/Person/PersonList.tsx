import { Flex, Icon, InputGroup, InputLeftElement, Modal, ModalBody, ModalContent, ModalOverlay, Table, Tbody, Td, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react';
import dayjs from 'dayjs';
import React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RiCheckboxBlankLine, RiCheckLine, RiSearchLine, RiUserAddLine } from 'react-icons/ri';
import { getDisplayName } from '../../helpers/displayNames';
import { useFilter } from '../../hooks/useFilter';
import { useViewport } from '../../hooks/useViewport';
import { Doctor, DoctorInput } from '../../types/Doctor';
import { Patient, PatientInput, WaitingPatient } from '../../types/Patient';
import * as colors from '../../styles/colors';
import { Button, IconButton, Input } from '../Library';
import FilterBar from '../FilterBar/FilterBar';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import { PersonModal } from './PersonModal';
import { Person } from '../../types/Person';


interface PersonListProps {
  persons: Doctor[] | Patient[] | WaitingPatient[]
  type?: 'doctors' | 'patients' | 'waitingPatients'
}

function PersonList({persons, type = 'patients'}: PersonListProps) {
  const { isMobile } = useViewport();
  const { t } = useTranslation();
  const { currentCompany } = useFilter();

  const isWaitingPatient = (person: Person | WaitingPatient): person is WaitingPatient => {
    if ('numberInLine' in person) return true;
    return false;
  };

  const isPatient = (person: Person ): person is Patient => {
    if ('firstContactAt' in person) return true;
    return false;
  };

  // search function
  const [search, setSearch] = useState('');

  const allPatients = persons as Patient[] | WaitingPatient[];
  const filteredPatients = allPatients.filter((person: Patient | WaitingPatient) =>
    person.firstName.toLowerCase().includes(search.toLowerCase()) ||
    person.lastName.toLowerCase().includes(search.toLowerCase()) ||
    person.street?.toLowerCase().includes(search.toLowerCase()) ||
    person.city?.toLowerCase().includes(search.toLowerCase()) ||
    person.careFacility?.toLowerCase().includes(search.toLowerCase()) ||
    person.notices?.toLowerCase().includes(search.toLowerCase()) ||
    person.contactData
      ?.filter((contact) => contact.type === 'telephone')
      .findIndex(contact => contact.contact.toLowerCase()
        .includes(search.toLowerCase())) !== -1
  );

  const allDoctors = persons as Doctor[];
  const filteredDoctors = allDoctors.filter((person: Doctor) =>
    person.firstName.toLowerCase().includes(search.toLowerCase()) ||
    person.lastName.toLowerCase().includes(search.toLowerCase()) ||
    person.street?.toLowerCase().includes(search.toLowerCase()) ||
    person.city?.toLowerCase().includes(search.toLowerCase()) ||
    person.contactData
      ?.filter((contact) => contact.type === 'telephone')
      .findIndex(contact => contact.contact.toLowerCase()
        .includes(search.toLowerCase())) !== -1
  );

  const filteredPersons = type === 'doctors' ? filteredDoctors : filteredPatients;

  const handleSearch = (event: React.FormEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value);
  };

  // pagination
  const rowsPerPage = isMobile ? 6 : 12;
  const numOfPages = Math.ceil(filteredPersons.length / rowsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  // modal control
  const { isOpen: isOpenInfo, onOpen: onOpenInfo, onClose: onCloseInfo } = useDisclosure();
  const { isOpen: isOpenCreate, onOpen: onOpenCreate, onClose: onCloseCreate } = useDisclosure();

  // handle selected / new Person
  const [ currentPerson, setCurrentPerson] = useState<Person | WaitingPatient | undefined>(undefined);
  const [ newPerson, setNewPerson] = useState<PatientInput | DoctorInput | undefined>(undefined);
  function showPersonInfo(person:Person) {
    setCurrentPerson(person);
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
      telephoneNumber: '',
      mailAddress: '',
    };
    const patientFields = {
      isAddpayFreed: false,
      careFacility: '',
      notices: '',
      firstContactAt: dayjs().toDate(),
      isWaitingSince: dayjs().toDate(),
      companyId: currentCompany?.uuid,
    };
    const newPerson = Object.assign(sharedFields, (type === 'doctors' ? null : patientFields));
    setNewPerson({...newPerson });
  };

  function showPersonCreate() {
    initNewPerson();
    onOpenCreate();
  }

  const PersonRows = (): JSX.Element[] =>
    filteredPatients
      .filter(
        (p: Person | WaitingPatient, i) =>
          i < currentPage * rowsPerPage && i >= (currentPage - 1) * rowsPerPage
      )
      .map((p: Patient | WaitingPatient)=> (
        <Tr key={p.uuid} onClick={() => showPersonInfo(p)}>
          { type === 'waitingPatients' && isWaitingPatient(p) && <Td><b>{p.numberInLine}</b></Td>}
          <Td>{p.firstName}</Td>
          <Td>{p.lastName}</Td>
          { type !== 'doctors' && <Td>{p.gender}</Td> }
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
          {type !== 'doctors' && (
            <>
              <Td>{p.notices}</Td>
              <Td>{p.doctor && getDisplayName(p.doctor)}</Td>
              <Td>{p.careFacility}</Td>
              <Td>
                <Icon
                  as={p.isAddpayFreed ? RiCheckLine : RiCheckboxBlankLine}
                  w={5}
                  h={5}
                  color={p.isAddpayFreed ? 'indigo' : 'gray.400'}
                />
              </Td>
            </>
          )}
          { type === 'doctors' && (
            <>
              <Td>{p.street}</Td>
              <Td>{p.zip}</Td>
              <Td>{p.city}</Td>
            </>
          )}
          {type === 'waitingPatients'
            ? <Td>{dayjs(p.isWaitingSince).format('ll')}</Td>
            : type !== 'doctors'
              ? <Td>{dayjs(p.firstContactAt).format('ll')}</Td>
              : null
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
        { type !== 'waitingPatients' && (
          <Button
            aria-label={`add${type === 'doctors' ? 'Doctor' : 'Patient'}`}
            leftIcon={<RiUserAddLine />}
            onClick={() => showPersonCreate()}
            colorScheme={'green'}
            w='15rem'
            mx='0.5rem'
          >
            {`add ${type === 'doctors' ? 'Doctor' : 'Patient'}`}
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
              {type !== 'doctors' && <Th width={2}>{t('label.gender')} </Th>}
              <Th>{t('label.telephoneNumber')} </Th>
              <Th>{t('label.mailAddress')} </Th>
              {type !== 'doctors' && (
                <>
                  <Th>{t('label.notices')} </Th>
                  <Th>{t('label.doctor')} </Th>
                  <Th>{t('label.careFacility')} </Th>
                  <Th width={5}>{t('label.isAddpayFreed')}</Th>
                </>
              )}
              {type === 'doctors' && (
                <>
                  <Th>{t('label.street')}</Th>
                  <Th>{t('label.zip')}</Th>
                  <Th>{t('label.city')}</Th>
                </>
              )}
              {type === 'waitingPatients'
                ? <Th width={7}>{t('label.isWaitingSince')}</Th>
                : type !== 'doctors'
                  ? <Th width={7}>{t('label.firstContactAt')}</Th>
                  : null
              }
              {/* {<Th width={5}>{t('label.actions')}</Th>} */}
              {type === 'waitingPatients' && <Th width={5}>{t('label.diagnostic')}</Th>}
            </Tr>
          </Thead>
          <Tbody>
            {PersonRows()}
            {/* {PatientAddRow(currentCompany)} */}
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
              🚧 work in Progress
              {currentPerson ? <PersonModal onClose={onCloseInfo} person={currentPerson} personType={type !== 'doctors' ? 'patient': 'doctor'}/> : null}
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
              🚧 work in Progress
              {newPerson ? <PersonModal onClose={onCloseCreate} person={newPerson} personType={type !== 'doctors' ? 'patient': 'doctor'} type="create" /> : null}
              {/* {newPatient ? <PatientInfo onClose={onCloseCreate} patient={newPatient} type="create"/> : null } */}
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
};

export default PersonList;