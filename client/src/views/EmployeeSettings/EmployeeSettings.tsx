import React, { FormEvent, useContext, useEffect, useState } from 'react';
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
  NewContract,
  isContract,
  isContractWithId,
} from '../../types/Employee';
import {
  FormLabel,
  FormControl,
  LabelledInput,
  LabelledSelect,
  Select,
} from '../../components/Library';
import { Button, Heading } from '@chakra-ui/react';
import { RiEditFill, RiUserAddLine } from 'react-icons/ri';
import { useTranslation } from 'react-i18next';
import { useAllUsers } from '../../hooks/user';
import { useFilter } from '../../hooks/useFilter';
import {
  ControlWrapper,
  SettingsWrapper,
  SettingsGrid,
} from '../../components/atoms/Wrapper';
import { useCreateContract, useUpdateContract } from '../../hooks/contract';
import { IoCloseOutline, IoSaveOutline } from 'react-icons/io5';
import { getContractOfCurrentMonth } from '../../helpers/contract';
import { TeamsForm } from '../../components/organisms/Employee/TeamsForm';
import { ContractForm } from '../../components/organisms/Employee/ContractForm';
import { UserDateContext } from '../../providers/UserDate';
dayjs.extend(isBetween);

export const defaultContract: NewContract = {
  employeeId: '',
  hoursPerWeek: 0,
  appointmentsPerWeek: 0,
  activeWorkdays: '1,2,3,4,5',
  workdaysPerWeek: 5,
  roomId: '',
  bgColor: 'green',
  validUntil: null,
};

const EmployeeSettings = () => {
  const { t } = useTranslation();
  const { currentDate } = useContext(UserDateContext);
  const year = currentDate.year();
  const month = currentDate.month();
  const { isLoading, employees, refetch: refetchEmployees } = useAllEmployees();

  const { users } = useAllUsers();
  const { currentCompany } = useFilter();

  const { mutateAsync: createEmployee, status: createEmployeeStatus } =
    useCreateEmployee();
  const { mutateAsync: updateEmployee } = useUpdateEmployee();
  const { mutateAsync: updateContract } = useUpdateContract();
  const { mutateAsync: createContract } = useCreateContract();

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

  const newEmptyContract = {
    ...defaultContract,
    employeeId: currentEmployee?.uuid || '',
  };

  const [currentContract, setCurrentContract] = useState<
    Contract | NewContract
  >(() => {
    if (currentEmployee?.contract.length) {
      return {
        ...sanitizeContract(
          getContractOfCurrentMonth(currentEmployee, year, month)
        ),
      };
    }
    return newEmptyContract;
  });

  const [state, setState] = useState<'view' | 'edit'>('view');

  useEffect(() => {
    if (!isLoading && employees.length) {
      setCurrentEmployee(employees[0]);
    }
  }, [isLoading]);

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
    const validUntilContract = currentContract.validUntil
      ? new Date(currentContract.validUntil)
      : null;
    const contract = {
      ...newEmptyContract,
      ...currentContract,
      validUntil: validUntilContract,
    } as Contract;
    if (contract.roomId === '') contract.roomId = undefined;
    const lastContract = currentEmployee?.contract.find(
      (contract) =>
        contract.validUntil === null ||
        dayjs(contract.validUntil).isSame(dayjs('2999-12-31'), 'day')
    );
    if (isContractWithId(currentContract)) {
      if (
        currentContract.id === lastContract?.id &&
        currentContract.validUntil !== lastContract?.validUntil
      ) {
        createContract({
          contract: { ...contract, validUntil: lastContract?.validUntil },
        });
      }
      updateContract({ contract });
    } else {
      createContract({ contract });
    }
    refetchEmployees();
  };

  const handleCreateEmployeeContract = () => {
    const newContract = {
      ...newEmptyContract,
    } as Contract;
    if (newContract.roomId === '') newContract.roomId = undefined;
    if (
      isContract(currentContract) &&
      (currentContract.validUntil === null ||
        dayjs(currentContract.validUntil).isSame(dayjs('2999-12-31'), 'day'))
    ) {
      // update current contract with validUntil === yesterday
      updateContract({
        contract: {
          ...currentContract,
          validUntil: dayjs().subtract(1, 'day').toDate(),
        },
      });
    }
    createContract({ contract: newContract });
    refetchEmployees();
  };
  const onSelectHandler = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setEmployeeState((currentState) => ({
      ...currentState,
      userId: e.target.value,
    }));
  };

  const onSelectContractHandler = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const contract = currentEmployee?.contract.filter(
      (c) => c.id === parseInt(e.target.value)
    )[0];
    if (contract) setCurrentContract(contract);
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
        ...newEmptyContract,
        employeeId: currentEmployee.uuid,
        ...(getContractOfCurrentMonth(currentEmployee, year, month)
          ? sanitizeContract(
              getContractOfCurrentMonth(currentEmployee, year, month)
            )
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
          <SettingsWrapper>
            <TeamsForm
              employeeId={currentEmployee.uuid}
              isReadOnly={state === 'view'}
            />
          </SettingsWrapper>
        </SettingsWrapper>
        <SettingsWrapper>
          <Heading as="h2" size="sm" mb="2" mt="5">
            {t('label.contract')}
          </Heading>
          <LabelledSelect
            id="currentContract"
            disabled={state === 'view'}
            name="contractId"
            value={(currentContract as Contract).id}
            onChangeHandler={onSelectContractHandler}
            noSelectionLabel="❌ No Contract"
            label=""
            options={employeeState.contract}
          />
          {currentContract ? (
            <ContractForm
              disabled={state === 'view'}
              contract={currentContract}
              handleChangeContract={onContractChangeHandler}
            />
          ) : (
            <b>no Contract!</b>
          )}
          <SettingsWrapper>
            <Heading as="h2" size="sm" mb="2" mt="5">
              {t('label.createContract')}
            </Heading>
            <ControlWrapper>
              <Button
                isDisabled={state === 'view'}
                colorScheme="green"
                onClick={handleCreateEmployeeContract}
              >
                New Contract
              </Button>
              {/* <LabelledInput
                id="validFromContract"
                disabled={state === 'view'}
                type="date"
                name="validFrom"
                autoComplete="valid-from"
                value={dayjs(newContractValidFrom).format('YYYY-MM-DD')}
                onChangeHandler={onChangeNewContractValidity}
                label={t('label.validFrom')}
              /> */}
              {/* <LabelledInput
                id="validUntilContract"
                disabled={state === 'view'}
                type="date"
                name="validUntil"
                autoComplete="valid-until"
                value={dayjs(newContractValidUntil).format('YYYY-MM-DD')}
                onChangeHandler={onChangeNewContractValidity}
                label={t('label.validUntil')}
              /> */}
            </ControlWrapper>
          </SettingsWrapper>
        </SettingsWrapper>
      </SettingsGrid>
    </>
  );
};

export default EmployeeSettings;
