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
import { Patient, PatientInput, WaitingPatient } from '../../types/Patient';
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
import { PatientInfo } from './PatientInfo';

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
  console.log(filteredPatients);
  // pagination
  const rowsPerPage = isMobile ? 6 : 12;
  const numOfPages = Math.ceil(filteredPatients.length / rowsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  // interactive row ro add patients
  const PatientAddRow = (currentCompany: Company | undefined): JSX.Element => {
    const [
      createPatient,
      { error, data, isSuccess, status, isIdle, isLoading },
    ] = useCreatePatient();
    const [newPatient, setNewPatient] = useState<PatientInput>();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [title, setTitle] = useState('');
    const [street, setStreet] = useState('');
    const [gender, setGender] = useState('');
    const [zip, setZip] = useState('');
    const [city, setCity] = useState('');
    const [isAddpayFreed, setIsAddpayFreed] = useState(false);
    const [firstContactAt, setFirstContactAt] = useState(dayjs().toDate());
    const [isWaitingSince, setIsWaitingSince] = useState(dayjs().toDate());
    const [notices, setNotices] = useState('');
    const [careFacility, setCareFacility] = useState('');
    const [telephoneNumber, setTelephoneNumber] = useState('');
    const [mailAddress, setMailAddress] = useState('');

    function handleFirstNameChange(event: React.FormEvent<HTMLInputElement>) {
      event.preventDefault();
      setFirstName(event.currentTarget.value);
    }
    function handleLastNameChange(event: React.FormEvent<HTMLInputElement>) {
      event.preventDefault();
      setLastName(event.currentTarget.value);
    }
    function handleTitleChange(event: React.FormEvent<HTMLInputElement>) {
      event.preventDefault();
      setTitle(event.currentTarget.value);
    }
    function handleStreetChange(event: React.FormEvent<HTMLInputElement>) {
      event.preventDefault();
      setStreet(event.currentTarget.value);
    }
    function handleTelephoneChange(event: React.FormEvent<HTMLInputElement>) {
      event.preventDefault();
      setTelephoneNumber(event.currentTarget.value);
    }
    function handleMailChange(event: React.FormEvent<HTMLInputElement>) {
      event.preventDefault();
      setMailAddress(event.currentTarget.value);
    }
    function handleGenderChange(event: React.FormEvent<HTMLInputElement>) {
      event.preventDefault();
      setGender(event.currentTarget.value);
    }
    function handleZipChange(event: React.FormEvent<HTMLInputElement>) {
      event.preventDefault();
      setZip(event.currentTarget.value);
    }
    function handleCityChange(event: React.FormEvent<HTMLInputElement>) {
      event.preventDefault();
      setCity(event.currentTarget.value);
    }
    function handleCareFacilityChange(event: React.FormEvent<HTMLInputElement>) {
      event.preventDefault();
      setCareFacility(event.currentTarget.value);
    }
    function handleIsAddpayFreedChange(
      event: React.FormEvent<HTMLInputElement>
    ) {
      event.preventDefault();
      setIsAddpayFreed(event.currentTarget.checked);
    }
    function handleNoticesChange(event: React.FormEvent<HTMLInputElement>) {
      event.preventDefault();
      setNotices(event.currentTarget.value);
    }
    function handleFirstContactAtChange(date: ReactDatePickerReturnType) {
      if (date) {
        setIsWaitingSince(dayjs(date.toString()).toDate());
        setFirstContactAt(dayjs(date.toString()).toDate());
      }
    }
    function handleSubmit() {
      setNewPatient({
        firstName,
        lastName,
        title,
        gender,
        zip,
        street,
        city,
        isAddpayFreed,
        careFacility,
        notices,
        firstContactAt,
        isWaitingSince,
        companyId: currentCompany?.uuid,
        telephoneNumber,
        mailAddress,
      });
    }
    function initNewPatient() {
      setFirstName('');
      setLastName('');
      setTitle('');
      setStreet('');
      setGender('');
      setZip('');
      setCity('');
      setIsAddpayFreed(false);
      setNotices('');
      setTelephoneNumber('');
      setCareFacility('');
      setMailAddress('');
      setIsWaitingSince(dayjs().toDate());
      setFirstContactAt(dayjs().toDate());
    }
    useEffect(() => {
      if (!newPatient) return;
      if ((newPatient?.firstName, newPatient?.lastName)) {
        createPatient({ patient: newPatient }).then((res) => {
          if (res?.uuid) {
            toast({
              title: 'Patient created.',
              description: `Patient ${res.lastName}, ${res.firstName} has been created`,
              status: 'success',
              duration: 5000,
              isClosable: true,
            });
          }
        });
        setNewPatient(undefined);
        initNewPatient();
      } else {
        toast({
          title: 'Missing Data!',
          description:
            'Be sure to provide at least the full first and last name of the patient',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
      }
    }, [newPatient]);
    return (
      <>
        <Tr key="PatientAddRow">
          <Td>
            {' '}
            <Input
              id="firstName"
              name="firstName"
              value={firstName}
              onChange={handleFirstNameChange}
            />
          </Td>
          <Td>
            <Input
              id="lastName"
              name="lastName"
              value={lastName}
              onChange={handleLastNameChange}
            />
          </Td>
          {/* <Td>
          <Input
            id="title"
            name="title"
            value={title}
            onChange={handleTitleChange}
          />
        </Td> */}
          <Td>
            <Input
              id="gender"
              name="gender"
              value={gender}
              onChange={handleGenderChange}
            />
          </Td>
          <Td>
            <Input
              id="street"
              name="street"
              value={street}
              onChange={handleStreetChange}
            />
          </Td>
          <Td>
            <Input id="zip" name="zip" value={zip} onChange={handleZipChange} />
          </Td>
          <Td>
            <Input
              id="city"
              name="city"
              value={city}
              onChange={handleCityChange}
            />
          </Td>
          <Td>
            <Input
              id="notices"
              name="notices"
              value={notices}
              onChange={handleNoticesChange}
            />
          </Td>
          <Td>
            <Input
              id="telephone"
              name="telephone"
              value={telephoneNumber}
              onChange={handleTelephoneChange}
            />
          </Td>
          <Td>
            <Input
              id="mail"
              name="mail"
              value={mailAddress}
              onChange={handleMailChange}
            />
          </Td>
          <Td>
            <Input
              id="careFacility"
              name="careFacility"
              value={careFacility}
              onChange={handleCareFacilityChange}
            />
          </Td>
          <Td>
            <Checkbox
              id="isAddpayFreed"
              name="isAddpayFreed"
              isChecked={isAddpayFreed}
              onChange={handleIsAddpayFreedChange}
              borderColor={colors.gray80}
            />
          </Td>
          <Td>
            <DatePicker
              id="firstContactAt"
              name="firstContactAt"
              showTimeSelect
              locale="de"
              timeFormat="p"
              timeIntervals={15}
              dateFormat="Pp"
              selected={dayjs(firstContactAt).toDate()}
              onChange={(date: ReactDatePickerReturnType) => {
                if (date) handleFirstContactAtChange(date);
              }}
            />
          </Td>
          {/* {hasActions && (
            <Td>
              <IconButton
                aria-label="add patient"
                icon={<RiAddBoxFill color="green" />}
                size="md"
                onClick={() => handleSubmit()}
              />
            </Td>
          )} */}
        </Tr>
      </>
    );
  };

  const { isOpen: isOpenInfo, onOpen: onOpenInfo, onClose: onCloseInfo } = useDisclosure();
  const { isOpen: isOpenCreate, onOpen: onOpenCreate, onClose: onCloseCreate } = useDisclosure();
  const [ currentPatient, setCurrentPatient] = useState<Patient | WaitingPatient | undefined>(undefined);
  const [ newPatient, setNewPatient] = useState<Patient | undefined>(undefined);
  function showPatientInfo(patient:Patient) {
    setCurrentPatient(patient);
    onOpenInfo();
  }
  function showPatientCreate() {
    onOpenCreate();
  }

  const PatientRows = (): JSX.Element[] =>
    filteredPatients
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
          {/* <Td>{p.street}</Td>
          <Td>{p.zip}</Td>
          <Td>{p.city}</Td> */}
          <Td>{p.notices}</Td>
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
              <Th>{t('patients.firstName')}</Th>
              <Th>{t('patients.lastName')}</Th>
              <Th width={2}>{t('patients.gender')} </Th>
              {/* <Th>{t('patients.street')} </Th>
              <Th width={5}>{t('patients.zip')} </Th>
              <Th>{t('patients.city')} </Th> */}
              <Th>{t('patients.notices')} </Th>
              <Th>{t('patients.telephoneNumber')} </Th>
              <Th>{t('patients.mailAddress')} </Th>
              <Th>{t('patients.careFacility')} </Th>
              <Th width={5}>{t('patients.isAddpayFreed')}</Th>
              {type === 'waitingPatients'
                ? <Th width={7}>{t('patients.isWaitingSince')}</Th>
                : <Th width={7}>{t('patients.firstContactAt')}</Th>
              }
              {/* {<Th width={5}>{t('patients.actions')}</Th>} */}
              {type === 'waitingPatients' && <Th width={5}>{t('patients.diagnostic')}</Th>}
            </Tr>
          </Thead>
          <Tbody>
            {PatientRows()}
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
              {currentPatient ? <PatientInfo onClose={onCloseInfo} patient={currentPatient} /> : null }
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
              {newPatient ? <PatientInfo onClose={onCloseCreate} patient={newPatient} type="create"/> : null }
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
}

export default PatientsList;
