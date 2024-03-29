import {
  Button,
  Flex,
  Icon,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Switch,
  Table,
  Tag,
  TagLabel,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import React, { useEffect, useMemo } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  RiCheckboxBlankLine,
  RiCheckLine,
  RiCloseLine,
  RiSearchLine,
  RiUserAddLine,
} from 'react-icons/ri';
import { getDisplayName } from '../../../helpers/displayNames';
import { useViewport } from '../../../hooks/useViewport';
import { Doctor } from '../../../types/Doctor';
import { Patient, WaitingPatient } from '../../../types/Patient';
import * as colors from '../../../styles/colors';
import { FormControl, Input, Label } from '../../Library';
import { PersonModalContent } from './PersonModalContent';
import {
  Person,
  isDoctor,
  isPatient,
  isWaitingPatient,
} from '../../../types/Person';
import { CgChevronDoubleLeft, CgChevronDoubleRight } from 'react-icons/cg';
import { IconButton } from '../../atoms/Buttons';
import { PersonCard } from '../../molecules/Cards/PersonCard';
import { AddpayTags, getAddpayForTags } from '../Patients/AddpayForm';
import { WaitingPreference } from '../../../types/Settings';
import { useAllWaitingPreferences } from '../../../hooks/settings';
import { WaitingPreferenceTagWrapper } from '../Patients/WaitingPreferenceForm';
import { FaTimes } from 'react-icons/fa';
import { PersonCreateModal } from './PersonCreateModal';

type ListType = 'doctors' | 'patients' | 'waitingPatients';

interface PersonListProps {
  persons: Doctor[] | Patient[] | WaitingPatient[];
  listType: ListType;
  showArchived?: boolean;
  // eslint-disable-next-line no-unused-vars
  setShowArchived?: (value: boolean) => void;
}

function PersonListLegacy({
  persons,
  listType,
  showArchived,
  setShowArchived,
}: PersonListProps) {
  const { isMobile } = useViewport();
  const { t } = useTranslation();
  const { waitingPreferences } = useAllWaitingPreferences();
  const [waitingPreferenceFilter, setWaitingPreferenceFilter] = useState<
    WaitingPreference['key'][]
  >([]);

  const removeWaitingPreferenceFilter = (removeKey: string) => {
    setWaitingPreferenceFilter((current) => [
      ...current.filter((key) => key !== removeKey),
    ]);
  };
  const addWaitingPreferenceFilter = (addKey: string) => {
    setWaitingPreferenceFilter((current) => [...current, addKey]);
  };
  const WaitingPreferenceFilter = () => {
    return (
      <WaitingPreferenceTagWrapper isReadOnly={true} isMobile={isMobile}>
        {waitingPreferences?.map((wp) => {
          const isActive = waitingPreferenceFilter.includes(wp.key);
          return (
            <Tag
              key={wp.key}
              colorScheme={isActive ? 'orange' : 'blackAlpha'}
              variant={isActive ? 'solid' : 'subtle'}
              onClick={
                isActive
                  ? () => removeWaitingPreferenceFilter(wp.key)
                  : () => addWaitingPreferenceFilter(wp.key)
              }
            >
              <TagLabel>{wp.label}</TagLabel>
            </Tag>
          );
        })}
        <IconButton
          aria-label="close modal"
          variant="subtle"
          colorScheme={waitingPreferenceFilter.length ? 'red' : 'blackAlpha'}
          isDisabled={waitingPreferenceFilter.length ? false : true}
          icon={<FaTimes />}
          onClick={() => setWaitingPreferenceFilter([])}
        />
      </WaitingPreferenceTagWrapper>
    );
  };
  const checkIsWaitingPatientList = (
    persons: Person[]
  ): persons is WaitingPatient[] => {
    if (persons[0] && 'numberInLine' in persons[0]) return true;
    return false;
  };
  const isWaitingPatientList = checkIsWaitingPatientList(persons);
  const isPatientList = (persons: Person[]): persons is Patient[] => {
    if (persons[0] && 'firstContactAt' in persons[0]) return true;
    return false;
  };

  const isDoctorList = (persons: Person[]): persons is Doctor[] => {
    if (listType === 'doctors') return true;
    return false;
  };

  // search function
  const [search, setSearch] = useState('');
  useEffect(() => {
    if (search) {
      setCurrentPage(1);
    }
  }, [search]);

  const filteredPatients: Patient[] | WaitingPatient[] = useMemo(
    () =>
      isWaitingPatientList || isPatientList(persons)
        ? (persons
            .filter((person: Patient | WaitingPatient) => {
              const searches = search.toLowerCase().split(/,| /);
              const findings: boolean[] = [];
              for (let i = 0; i < searches.length; i++) {
                const found = (term: string) =>
                  ((isPatient(person) || isWaitingPatient(person)) &&
                    person.firstName.toLowerCase().includes(term)) ||
                  person.lastName.toLowerCase().includes(term) ||
                  person.street?.toLowerCase().includes(term) ||
                  person.city?.toLowerCase().includes(term) ||
                  person.institution?.name?.toLowerCase().includes(term) ||
                  person.notices?.toLowerCase().includes(term) ||
                  person.contactData
                    ?.filter((contact) => contact.type === 'telephone')
                    .findIndex((contact) =>
                      contact.contact.toLowerCase().includes(term)
                    ) !== -1;
                if (searches[i] === '') continue;
                if (found(searches[i])) findings.push(true);
              }
              if (
                searches.filter((term) => term !== '').length ===
                findings.length
              )
                return true;
              return false;
            })
            .filter((person) => {
              return !waitingPreferenceFilter.length
                ? true
                : person.waitingPreferences?.filter((wp) =>
                    waitingPreferenceFilter.includes(wp.key)
                  ).length;
            }) as Patient[] | WaitingPatient[])
        : ([] as Patient[] | WaitingPatient[]),
    [persons]
  );

  const allDoctors = isDoctorList(persons) ? persons : [];
  const filteredDoctors = useMemo(
    () =>
      allDoctors.filter((person: Doctor) => {
        const searches = search.toLowerCase().split(/,| /);
        const findings: boolean[] = [];
        for (let i = 0; i < searches.length; i++) {
          const found = (term: string) =>
            person.firstName.toLowerCase().includes(term) ||
            person.lastName.toLowerCase().includes(term) ||
            person.street?.toLowerCase().includes(term) ||
            person.city?.toLowerCase().includes(term) ||
            person.contactData
              ?.filter((contact) => contact.type === 'telephone')
              .findIndex((contact) =>
                contact.contact.toLowerCase().includes(term)
              ) !== -1;
          if (searches[i] === '') continue;
          if (found(searches[i])) findings.push(true);
        }
        if (searches.filter((term) => term !== '').length === findings.length)
          return true;
        return false;
      }),
    [allDoctors]
  );

  const filteredPersons: Person[] =
    listType === 'doctors'
      ? filteredDoctors
      : checkIsWaitingPatientList(filteredPatients)
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
  const maxNavButtons = 5;
  const numOfNavButtons =
    numOfPages > maxNavButtons ? maxNavButtons : numOfPages;
  const ellipsisBefore =
    numOfPages > numOfNavButtons && currentPage > 3 ? ' ... ' : '';
  const ellipsisAfter =
    numOfPages > numOfNavButtons && currentPage < numOfPages - 1 ? ' ... ' : '';

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

  function showPersonInfo(person: Person) {
    setCurrentPerson({
      ...person,
      notices: isPatient(person) ? person.notices || '' : undefined,
      medicalReport: isPatient(person) ? person.medicalReport || '' : undefined,
    });
    onOpenInfo();
  }

  const diagnosticDisplay = (p: WaitingPatient) => {
    const event =
      p.events?.length &&
      p.events.filter((event) => !event.isCancelled && event.isDiagnostic)
        .length
        ? p.events.filter(
            (event) => !event.isCancelled && event.isDiagnostic
          )[0]
        : null;
    if (event) {
      return (
        <>
          <b>
            {dayjs(event.startTime).format('DD.MM.YY HH:mm')}
            {event.isDone && (
              <Icon as={RiCheckLine} w={5} h={5} color="green" />
            )}
          </b>
          {' @'}
          <i>{event.employee?.alias}</i>
        </>
      );
    }
    return null;
  };

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
            <PersonCard person={p} isInteractive={true} />
          </Td>
          {!isDoctor(p) && (
            <>
              <Td textAlign="center">
                <AddpayTags
                  size="md"
                  isInteractive={false}
                  addpayState={getAddpayForTags({
                    addpayFreedom: p.addpayFreedom || [],
                    currentYear: 2023,
                    onlyCurrentYear: true,
                  })}
                />
              </Td>
              {!isWaitingPatient(p) && (
                <Td textAlign="center">
                  <Icon
                    as={p.hasContract ? RiCheckLine : RiCheckboxBlankLine}
                    w={5}
                    h={5}
                    color={p.hasContract ? 'green' : 'red'}
                  />
                </Td>
              )}
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
          {isWaitingPatient(p) && (
            <>
              <Td>{diagnosticDisplay(p)}</Td>
              <Td>
                {p.waitingPreferences?.map((wp) => (
                  <Tag colorScheme="orange" variant="solid" key={wp.key}>
                    <TagLabel>{wp.label}</TagLabel>
                  </Tag>
                ))}
              </Td>
            </>
          )}
        </Tr>
      ));

  return (
    <>
      <Flex
        flexDirection={isMobile ? 'column' : 'row'}
        p="0.5rem"
        gap="0.5rem"
        maxWidth="100%"
      >
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
        {listType !== 'waitingPatients' && setShowArchived && (
          <>
            <Button
              aria-label={`add${listType === 'doctors' ? 'Doctor' : 'Patient'}`}
              leftIcon={<RiUserAddLine />}
              onClick={() => onOpenCreate()}
              colorScheme={'green'}
              w="15rem"
              mx="0.5rem"
            >
              {t('button.add')}
            </Button>
            <FormControl>
              <Label htmlFor="show-archived">
                {t('label.showArchivedData')}
              </Label>
              <Switch
                id="show-archived"
                colorScheme="red"
                isChecked={showArchived}
                onChange={() => setShowArchived(!showArchived)}
              />
            </FormControl>
          </>
        )}
        {listType === 'waitingPatients' && <WaitingPreferenceFilter />}
      </Flex>
      {persons.length ? (
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
            colorScheme={showArchived ? 'orange' : 'green'}
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
                    {listType !== 'waitingPatients' && (
                      <Th width={5}>{t('label.hasContract')}</Th>
                    )}
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
                  <>
                    <Th width={5}>{t('label.diagnostic')}</Th>
                    <Th width={5}>{t('label.waitingPreference')}</Th>
                  </>
                )}
              </Tr>
            </Thead>
            <Tbody textDecoration={showArchived ? 'line-through' : undefined}>
              {PersonRows()}
            </Tbody>
          </Table>
        </div>
      ) : (
        <div>no persons in list</div>
      )}
      {/* pagination controls START */}
      <Flex m={2} alignSelf="flex-end">
        <IconButton
          aria-label="previous page"
          leftIcon={<CgChevronDoubleLeft />}
          isDisabled={currentPage <= 1}
          colorScheme="blackAlpha"
          onClick={() => setCurrentPage(1)}
        />
        {ellipsisBefore}
        {new Array(numOfPages).fill(numOfPages).map((_, index) => {
          const outOfRange =
            index + 1 < currentPage - numOfNavButtons / 2 ||
            index + 1 > currentPage + numOfNavButtons / 2;
          return (
            <Button
              hidden={outOfRange}
              isDisabled={index + 1 === currentPage}
              colorScheme={index + 1 === currentPage ? 'orange' : undefined}
              key={index}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Button>
          );
        })}
        {ellipsisAfter}
        <IconButton
          aria-label="next page"
          icon={<CgChevronDoubleRight />}
          isDisabled={currentPage >= numOfPages}
          colorScheme="blackAlpha"
          onClick={() => setCurrentPage(numOfPages)}
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
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              height="fit-content"
            >
              {currentPerson ? (
                <PersonModalContent
                  onClose={onCloseInfo}
                  person={currentPerson}
                  personType={listType !== 'doctors' ? 'patient' : 'doctor'}
                />
              ) : null}
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
      <PersonCreateModal
        isOpen={isOpenCreate}
        onClose={onCloseCreate}
        personType={listType !== 'doctors' ? 'patient' : 'doctor'}
      />
    </>
  );
}

export default PersonListLegacy;
