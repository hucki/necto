import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import {
  useAllEmployees,
  useCreateEmployee,
  useUpdateEmployee,
} from '../../hooks/employees';
import {
  Contract,
  Employee,
  Employee2Team,
  NewContract,
  Team,
} from '../../types/Employee';
import { useAddEmployeeToTeam } from '../../hooks/teams';
import { useAllTeams } from '../../hooks/teams';
import {
  FormLabel,
  FormControl,
  LabelledInput,
  LabelledSelect,
  Select,
  Checkbox,
} from '../../components/Library';
import {
  Button,
  Heading,
  List,
  ListIcon,
  ListItem,
  Stack,
} from '@chakra-ui/react';
import {
  RiArrowDropRightLine,
  RiEditFill,
  RiUserAddLine,
} from 'react-icons/ri';
import { useTranslation } from 'react-i18next';
import { useAllUsers } from '../../hooks/user';
import { colors } from '../../config/colors';
import { useFilter } from '../../hooks/useFilter';
import {
  ControlWrapper,
  SettingsWrapper,
  SettingsGrid,
} from '../../components/atoms/Wrapper';
import { IconButton } from '../../components/atoms/Buttons';
import { FaPlus } from 'react-icons/fa';
import { useCreateContract, useUpdateContract } from '../../hooks/contract';
import { useAllRooms } from '../../hooks/rooms';
import { IoCloseOutline, IoSaveOutline } from 'react-icons/io5';
import ContractSummary from '../../components/molecules/DataDisplay/ContractSummary';
import { getCurrentContract } from '../../helpers/contract';
dayjs.extend(isBetween);

interface ContractFormProps {
  contract: Contract | NewContract;
  disabled: boolean;
  handleChangeContract: ({
    // eslint-disable-next-line no-unused-vars
    targetName,
    // eslint-disable-next-line no-unused-vars
    targetValue,
  }: {
    targetName: keyof Contract;
    targetValue: string;
  }) => void;
}
const ContractForm = ({
  contract,
  handleChangeContract,
  disabled = true,
}: ContractFormProps) => {
  const { t } = useTranslation();
  const { rooms } = useAllRooms();
  const bgColor = contract.bgColor || 'green';
  const activeWorkdays = contract.activeWorkdays.split(',');
  const handleContractChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    e.preventDefault();
    handleChangeContract({
      targetName: e.target.name as keyof Contract,
      targetValue: e.target.value,
    });
  };

  const ActiveWorkdaysCheckboxes = () => {
    const allWorkdays = ['1', '2', '3', '4', '5'];
    const handleActiveWorkdayChange = (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const day = e.currentTarget.name;
      const checked = e.currentTarget.checked;
      const newActiveWorkdays = checked
        ? [...activeWorkdays, day].sort((a, b) => parseInt(a) - parseInt(b))
        : [...activeWorkdays.filter((activeDay) => activeDay !== day)].sort(
            (a, b) => parseInt(a) - parseInt(b)
          );
      handleChangeContract({
        targetName: 'activeWorkdays',
        targetValue: newActiveWorkdays.join(),
      });
    };
    return (
      <>
        {allWorkdays.map((day) => (
          <Checkbox
            disabled={disabled}
            key={day}
            name={day}
            isChecked={Boolean(activeWorkdays.find((item) => item === day))}
            onChange={handleActiveWorkdayChange}
          >
            {dayjs().day(parseInt(day)).format('ddd')}
          </Checkbox>
        ))}
      </>
    );
  };
  return (
    <>
      <Heading as="h2" size="sm" mb="3" mt="5">
        {t('label.contractData')}
      </Heading>
      <ContractSummary contract={contract} />
      <Stack direction="row">
        <ActiveWorkdaysCheckboxes />
      </Stack>
      <LabelledInput
        id="workdaysPerWeek"
        disabled={disabled}
        type="number"
        name="workdaysPerWeek"
        value={contract.workdaysPerWeek || 0}
        onChangeHandler={handleContractChange}
        label={t('label.workdaysPerWeek')}
      />
      <LabelledInput
        id="appointmentsPerWeek"
        disabled={disabled}
        type="number"
        name="appointmentsPerWeek"
        value={contract.appointmentsPerWeek || 0}
        onChangeHandler={handleContractChange}
        label={t('label.appointmentsPerWeek')}
      />
      <LabelledInput
        id="hoursPerWeek"
        disabled={disabled || Boolean(contract.appointmentsPerWeek)}
        type="number"
        name="hoursPerWeek"
        value={contract.hoursPerWeek || 0}
        onChangeHandler={handleContractChange}
        label={t('label.hoursPerWeek')}
        errorMessage={
          contract.appointmentsPerWeek && contract.appointmentsPerWeek > 0
            ? t('employee.contract.hours') +
              ' ' +
              t('employee.contract.overruledBy') +
              t('employee.contract.appointments')
            : undefined
        }
      />
      <FormControl id="bgColor" m={'15px auto 10px auto'}>
        <Select
          disabled={disabled}
          name="bgColor"
          value={contract.bgColor || 'green'}
          style={{
            backgroundColor: `var(--bg${
              bgColor[0].toUpperCase() + bgColor.substring(1)
            })`,
          }}
          onChange={handleContractChange}
        >
          {colors.map((color, i) => (
            <option key={i} value={color}>
              {color}
            </option>
          ))}
        </Select>
        <FormLabel>{t('label.bgColor')}</FormLabel>
      </FormControl>
      <FormControl id="roomId">
        <Select
          disabled={disabled}
          name="roomId"
          style={{
            backgroundColor: contract.roomId ? undefined : 'var(--bgNote)',
          }}
          value={contract.roomId}
          onChange={handleContractChange}
        >
          <option value="">{t('label.noRoom')}</option>
          {rooms.map((room, i) => (
            <option key={i} value={room.uuid}>
              {room.displayName} (
              {room.building.displayName + ': ' + room.description})
            </option>
          ))}
        </Select>
        <FormLabel>{t('label.room')}</FormLabel>
      </FormControl>
    </>
  );
};

const EmployeeSettings = () => {
  const { t } = useTranslation();
  const { isLoading, employees, refetch: refetchEmployees } = useAllEmployees();
  const { isLoading: isLoadingTeams, teams } = useAllTeams();
  const { users } = useAllUsers();
  const { currentCompany } = useFilter();

  const { mutateAsync: createEmployee, status: createEmployeeStatus } =
    useCreateEmployee();
  const { mutateAsync: updateEmployee } = useUpdateEmployee();
  const { mutateAsync: updateContract } = useUpdateContract();
  const { mutateAsync: createContract } = useCreateContract();
  const { mutateAsync: addEmployeeToTeam, status: addEmployeeToTeamStatus } =
    useAddEmployeeToTeam();

  const [currentEmployee, setCurrentEmployee] = useState<
    Employee | undefined
  >();

  const [employeeState, setEmployeeState] = useState({
    uuid: currentEmployee?.uuid ? currentEmployee?.uuid : '',
    firstName: currentEmployee ? currentEmployee.firstName : '',
    lastName: currentEmployee ? currentEmployee.lastName : '',
    alias: currentEmployee?.alias ? currentEmployee.alias : '',
    validUntil: currentEmployee?.validUntil
      ? currentEmployee.validUntil
      : undefined,
    userId:
      currentEmployee && currentEmployee?.user?.userId
        ? currentEmployee?.user?.userId
        : '',
    contract:
      currentEmployee && currentEmployee?.contract
        ? currentEmployee?.contract
        : [],
    companyId:
      currentEmployee && currentEmployee?.companyId
        ? currentEmployee?.companyId
        : currentCompany?.uuid || '',
  });
  const defaultContract: NewContract = {
    employeeId: currentEmployee?.uuid ? currentEmployee?.uuid : '',
    hoursPerWeek: 0,
    appointmentsPerWeek: 0,
    activeWorkdays: '1,2,3,4,5',
    workdaysPerWeek: 5,
    roomId: '',
    bgColor: 'green',
  };
  const [currentContract, setCurrentContract] = useState<
    Contract | NewContract
  >(() => {
    if (currentEmployee?.contract.length) {
      return {
        ...sanitizeContract(currentEmployee.contract[0]),
      };
    }
    return defaultContract;
  });
  const [currentTeam, setCurrentTeam] = useState<Team | undefined>();
  const [state, setState] = useState<'view' | 'edit'>('view');
  const remainingTeams = teams.filter(
    (t) => !currentEmployee?.teams?.find((ct) => ct.team.uuid === t.uuid)
  );

  useEffect(() => {
    if (!isLoading && employees.length) {
      setCurrentEmployee(employees[0]);
    }
    if (!isLoadingTeams && teams.length) {
      setCurrentTeam(teams[0]);
    }
  }, [isLoading, isLoadingTeams]);

  const onEmployeeChangeHandler = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCurrentEmployee(
      employees.filter((t) => t.uuid === event.target.value)[0]
    );
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    setEmployeeState((currentState) => ({
      ...currentState,
      [e.target.name]: e.target.value,
    }));
  };

  const onContractChangeHandler = ({
    targetName,
    targetValue,
  }: {
    targetName: keyof Contract;
    targetValue: string;
  }) => {
    setCurrentContract((contract) => ({
      ...contract,
      [targetName]: targetValue,
    }));
  };

  const onTeamChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentTeam(teams.filter((t) => t.uuid === event.target.value)[0]);
  };

  const handleCreateEmployee = async () => {
    if (!currentCompany?.uuid) {
      return;
    }
    const defaultEmployee = {
      uuid: '',
      firstName: 'first Name',
      lastName: 'last Name',
      contract: [],
      companyId: currentCompany.uuid,
    };
    await createEmployee({ employee: defaultEmployee }).then((employee) => {
      refetchEmployees().then(({ data }) =>
        setCurrentEmployee(
          data ? data.filter((t) => t.uuid === employee.uuid)[0] : undefined
        )
      );
      return employee;
    });
  };

  const handleAddEmployeeToTeam = () => {
    if (currentTeam && currentEmployee) {
      const employee2Team: Employee2Team = {
        employee: currentEmployee,
        team: currentTeam,
      };
      addEmployeeToTeam({ employee2Team });
      refetchEmployees();
    }
  };
  const cancelEdit = () => {
    setState((currentState) => (currentState === 'view' ? 'edit' : 'view'));
  };
  const toggleEdit = (e: FormEvent): void => {
    e.preventDefault();
    setState((currentState) => (currentState === 'view' ? 'edit' : 'view'));
  };

  const onUpdateEmployee = () => {
    const validUntil = employeeState.validUntil
      ? new Date(employeeState.validUntil)
      : currentEmployee?.validUntil
      ? new Date(currentEmployee?.validUntil)
      : undefined;
    updateEmployee({
      employee: {
        ...currentEmployee,
        ...employeeState,
        validUntil,
      },
    });
    const contract = {
      ...defaultContract,
      ...currentContract,
    } as Contract;
    if (contract.roomId === '') contract.roomId = undefined;
    if (currentContract.hasOwnProperty('id')) {
      updateContract({ contract });
    } else {
      createContract({ contract });
    }
    refetchEmployees();
  };
  const onSelectHandler = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setEmployeeState((currentState) => ({
      ...currentState,
      userId: e.target.value,
    }));
  };
  const onSubmitHandler = (e: FormEvent): void => {
    e.preventDefault();
    onUpdateEmployee();
    toggleEdit(e);
  };

  const sanitizeContract = (contract: Contract): Contract => {
    return {
      ...contract,
      hoursPerWeek: contract.hoursPerWeek || 0,
      appointmentsPerWeek: contract.appointmentsPerWeek || 0,
      bgColor: contract.bgColor || 'green',
      roomId: contract.roomId || '',
    };
  };

  useEffect(() => {
    if (!isLoading && currentEmployee) {
      setState('view');
      setEmployeeState((currentState) => ({
        ...currentState,
        ...currentEmployee,
        userId: currentEmployee.user?.userId || '',
        alias: currentEmployee.alias || '',
      }));
      setCurrentContract({
        ...defaultContract,
        employeeId: currentEmployee.uuid,
        ...(getCurrentContract(currentEmployee)
          ? sanitizeContract(getCurrentContract(currentEmployee))
          : undefined),
      });
    }
  }, [currentEmployee, isLoading]);

  return !currentEmployee ? null : (
    <>
      <ControlWrapper>
        <Button
          leftIcon={<RiUserAddLine />}
          disabled={
            !(
              createEmployeeStatus === 'idle' ||
              createEmployeeStatus === 'success'
            )
          }
          colorScheme="green"
          onClick={handleCreateEmployee}
        >
          New
        </Button>
        <FormControl id="employee" style={{ margin: 'auto 1rem' }}>
          <Select
            name="employee"
            value={currentEmployee.uuid}
            onChange={onEmployeeChangeHandler}
          >
            {employees
              .sort((a, b) => (a.lastName < b.lastName ? -1 : 1))
              .map((t, i) => (
                <option key={i} value={t.uuid}>
                  {t.firstName + ' ' + t.lastName}
                </option>
              ))}
          </Select>
          <FormLabel>{t('label.employeeSelect')}</FormLabel>
        </FormControl>
        {state === 'view' ? (
          <Button
            aria-label="toggle edit mode"
            onClick={toggleEdit}
            colorScheme="blue"
          >
            <RiEditFill />
          </Button>
        ) : (
          <>
            <Button
              aria-label="save changes"
              onClick={onSubmitHandler}
              colorScheme="blue"
            >
              <IoSaveOutline size="1.5rem" />
            </Button>
            <Button
              aria-label="cancel changes"
              type="button"
              onClick={cancelEdit}
              colorScheme="red"
            >
              <IoCloseOutline size="1.5rem" />
            </Button>
          </>
        )}
      </ControlWrapper>
      <SettingsGrid>
        <SettingsWrapper>
          <Heading as="h2" size="sm" mb="2" mt="5">
            {t('menu.personalData')}
          </Heading>
          <LabelledInput
            id="firstName"
            disabled={state === 'view'}
            type="text"
            name="firstName"
            autoComplete="given-name"
            value={employeeState.firstName}
            onChangeHandler={onChangeHandler}
            label={t('label.firstName')}
          />
          <LabelledInput
            id="alias"
            disabled={state === 'view'}
            type="text"
            name="alias"
            autoComplete="alias"
            value={employeeState.alias}
            onChangeHandler={onChangeHandler}
            label={t('label.alias')}
          />
          <LabelledInput
            id="lastName"
            disabled={state === 'view'}
            type="text"
            name="lastName"
            autoComplete="family-name"
            value={employeeState.lastName}
            onChangeHandler={onChangeHandler}
            label={t('label.lastName')}
          />
          <LabelledInput
            id="validUntil"
            disabled={state === 'view'}
            type="date"
            name="validUntil"
            autoComplete="valid-until"
            value={
              employeeState.validUntil
                ? dayjs(employeeState.validUntil).format('YYYY-MM-DD')
                : ''
            }
            onChangeHandler={onChangeHandler}
            label={t('label.validUntil')}
          />
          <LabelledSelect
            id="user"
            disabled={state === 'view'}
            name="userId"
            value={employeeState.userId}
            onChangeHandler={onSelectHandler}
            hasOptionNoSelection={true}
            noSelectionLabel="❌ No User"
            label={t('label.user')}
            options={users}
          />
        </SettingsWrapper>
        <SettingsWrapper>
          {currentContract ? (
            <ContractForm
              disabled={state === 'view'}
              contract={currentContract}
              handleChangeContract={onContractChangeHandler}
            />
          ) : (
            <b>no Contract!</b>
          )}
        </SettingsWrapper>

        <SettingsWrapper>
          {currentEmployee.teams?.length ? (
            <>
              <Heading as="h3" size="sm" mb="2" mt="5">
                {t('label.currentTeams')}
              </Heading>
              <List style={{ marginBottom: '10px' }}>
                {currentEmployee.teams.map((t, i) => (
                  <ListItem key={i}>
                    <ListIcon as={RiArrowDropRightLine} />
                    {t.team.displayName}
                  </ListItem>
                ))}
              </List>
            </>
          ) : (
            <span>{t('warning.employeeSettings.noTeamSelected')}</span>
          )}
          {currentTeam && remainingTeams.length > 0 && (
            <ControlWrapper>
              <FormControl id="team" m={'15px auto 10px auto'}>
                <Select
                  name="team"
                  value={currentTeam.uuid}
                  onChange={onTeamChangeHandler}
                  disabled={
                    state !== 'edit' || addEmployeeToTeamStatus !== 'idle'
                  }
                >
                  {remainingTeams.map((t, i) => (
                    <option key={i} value={t.uuid}>
                      {t.displayName}
                    </option>
                  ))}
                </Select>
                <FormLabel>team to add to:</FormLabel>
              </FormControl>
              <IconButton
                aria-label="add employee to team"
                icon={<FaPlus />}
                alignSelf="center"
                type="button"
                onClick={handleAddEmployeeToTeam}
                disabled={
                  state !== 'edit' || addEmployeeToTeamStatus !== 'idle'
                }
                colorScheme="green"
              />
            </ControlWrapper>
          )}
        </SettingsWrapper>
      </SettingsGrid>
    </>
  );
};

export default EmployeeSettings;
