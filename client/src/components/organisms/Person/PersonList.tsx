import {
  Button,
  Flex,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Switch,
  Tag,
  TagLabel,
  useDisclosure,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RiCloseLine, RiSearchLine, RiUserAddLine } from 'react-icons/ri';
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
import { IconButton, PaginationButton } from '../../atoms/Buttons';
import { PersonCard } from '../../molecules/Cards/PersonCard';
import { AddpayTags, getAddpayForTags } from '../Patients/AddpayForm';
import { WaitingPreference } from '../../../types/Settings';
import { useAllWaitingPreferences } from '../../../hooks/settings';
import { WaitingPreferenceTagWrapper } from '../Patients/WaitingPreferenceForm';
import { FaTimes } from 'react-icons/fa';
import { PersonCreateModal } from './PersonCreateModal';
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { PersonListStyle } from '../../atoms/TableStyles';
import { PaginationWrapper } from '../../atoms/Wrapper';
import { DiagnosticDisplay } from '../../molecules/DataDisplay/DiagnosticEvent';

type ListType = 'doctors' | 'patients' | 'waitingPatients';

interface PersonListProps {
  persons: Person[];
  listType: ListType;
  showArchived?: boolean;
  // eslint-disable-next-line no-unused-vars
  setShowArchived?: (value: boolean) => void;
}

const columnHelper = createColumnHelper<Person>();
const personColumnNames = [
  'numberInLine',
  'person',
  'addpayFreedom',
  'email',
  'notices',
  'doctor',
  'isWaitingSince',
  'firstContactAt',
  'diagnostic',
  'waitingPreference',
] as const;
type PersonColumnName = (typeof personColumnNames)[number];

type PersonColumns = {
  [key in PersonColumnName as key]:
    | ColumnDef<Person, Person>
    | ColumnDef<Person, unknown>;
};

const waitingPatientFields: Partial<PersonColumnName>[] = [
  'numberInLine',
  'person',
  'diagnostic',
  'isWaitingSince',
  'waitingPreference',
  'addpayFreedom',
  'email',
  'notices',
  'doctor',
];
const patientFields: Partial<PersonColumnName>[] = [
  'person',
  'addpayFreedom',
  'email',
  'notices',
  'doctor',
  'firstContactAt',
];

function PersonList({
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
    [persons, search, waitingPreferenceFilter]
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

  function showPersonInfo(pid: Person['uuid']) {
    const person = persons.find((p) => p.uuid === pid);
    if (person) {
      setCurrentPerson({
        ...person,
        notices: isPatient(person) ? person.notices || '' : undefined,
        medicalReport: isPatient(person)
          ? person.medicalReport || ''
          : undefined,
      });
      onOpenInfo();
    }
  }
  const handleSearch = (event: React.FormEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value);
  };

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

  const personColumns: PersonColumns = {
    numberInLine: columnHelper.accessor('numberInLine', {
      id: 'nr',
      header: 'Nr',
      cell: (cell) => {
        const cellValue = cell.getValue();
        return <b>{cellValue as string}</b>;
      },
    }),
    person: columnHelper.accessor((row) => row, {
      id: 'person',
      header: t('label.name'),
      cell: (row) => {
        const rowValue = row.getValue();
        return <PersonCard person={rowValue} />;
      },
    }),
    addpayFreedom: columnHelper.accessor((row) => row, {
      id: 'addpayFreedom',
      header: t('label.isAddpayFreed'),
      cell: (row) => {
        const person = row.getValue();
        if (isDoctor(person)) return;
        return (
          <AddpayTags
            size="md"
            isInteractive={false}
            addpayState={getAddpayForTags({
              addpayFreedom: person.addpayFreedom || [],
              currentYear: dayjs().year(),
              onlyCurrentYear: true,
            })}
          />
        );
      },
    }),
    email: columnHelper.accessor((row) => row, {
      id: 'email',
      header: t('label.mailAddress'),
      cell: (row) => {
        const person = row.getValue();
        if (isDoctor(person)) return;
        return person.contactData
          ?.filter((c) => c.type === 'email')
          .map((mail) => <div key={mail.uuid}>{mail.contact}</div>);
      },
    }),
    notices: columnHelper.accessor((row) => row, {
      id: 'notices',
      header: t('label.notices'),
      cell: (row) => {
        const person = row.getValue();
        if (isDoctor(person)) return;
        return person.notices;
      },
    }),
    doctor: columnHelper.accessor((row) => row, {
      id: 'doctor',
      header: t('label.doctor'),
      cell: (row) => {
        const person = row.getValue();
        if (isDoctor(person) || !person.doctor) return;
        return getDisplayName({ person: person.doctor, type: 'short' });
      },
    }),

    isWaitingSince: columnHelper.accessor('isWaitingSince', {
      id: 'isWaitingSince',
      header: t('label.isWaitingSince'),
      cell: (cell) => {
        const cellValue = cell.getValue() as string;
        return dayjs(cellValue).format('ll');
      },
    }),
    firstContactAt: columnHelper.accessor('firstContactAt', {
      id: 'firstContactAt',
      header: t('label.firstContactAt'),
      cell: (cell) => {
        const cellValue = cell.getValue() as string;
        return dayjs(cellValue).format('ll');
      },
    }),
    diagnostic: columnHelper.accessor((row) => row, {
      id: 'diagnostic',
      header: t('label.diagnostic'),
      cell: (row) => {
        const person = row.getValue();
        if (!person.uuid) return;
        return DiagnosticDisplay({ patientId: person.uuid });
      },
    }),
    waitingPreference: columnHelper.accessor((row) => row, {
      id: 'waitingPreference',
      header: t('label.waitingPreference'),
      cell: (row) => {
        const person = row.getValue();
        return (person as Patient).waitingPreferences?.map((wp) => (
          <>
            <Tag colorScheme="orange" variant="solid" key={wp.key}>
              <TagLabel>{wp.label}</TagLabel>
            </Tag>
          </>
        ));
      },
    }),
  };

  const patientColumns = patientFields.map((field) => personColumns[field]);
  const waitingPatientColumns = waitingPatientFields.map(
    (field) => personColumns[field]
  );

  const table = useReactTable({
    data: filteredPersons,
    columns: isWaitingPatientList ? waitingPatientColumns : patientColumns,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
  });

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
          <PersonListStyle archived={showArchived}>
            <table>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => {
                  // const isSum = row.original.dayOfMonth === 99;
                  return (
                    <tr
                      key={row.id}
                      style={{
                        textAlign: 'center',
                        // backgroundColor: 'lightgray',
                      }}
                      onClick={() => showPersonInfo(row.original.uuid)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <PaginationWrapper>
              <PaginationButton
                onClick={() => table.setPageIndex(0)}
                isDisabled={!table.getCanPreviousPage()}
              >
                {'<<'}
              </PaginationButton>
              <PaginationButton
                onClick={() => table.previousPage()}
                isDisabled={!table.getCanPreviousPage()}
              >
                {'<'}
              </PaginationButton>
              <PaginationButton
                onClick={() => table.nextPage()}
                isDisabled={!table.getCanNextPage()}
              >
                {'>'}
              </PaginationButton>
              <PaginationButton
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                isDisabled={!table.getCanNextPage()}
              >
                {'>>'}
              </PaginationButton>
              <div>{t('pagination.page')}</div>
              <span className="flex items-center gap-1">
                <strong>
                  {table.getState().pagination.pageIndex + 1}{' '}
                  {t('pagination.of') + ' '}
                  {table.getPageCount()}
                </strong>
              </span>
            </PaginationWrapper>
          </PersonListStyle>
        </div>
      ) : (
        <div>no persons in list</div>
      )}
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

export default PersonList;
