import React, { FormEvent, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { useAllEmployees, useUpdateEmployee } from '../../hooks/employees';
import { Contract, Employee, Employee2Team, Team } from '../../types/Employee';
import { useAddEmployeeToTeam } from '../../hooks/teams';
import { useAllTeams } from '../../hooks/teams';
import { Button, FormLabel, Input, LabelledInput, LabelledSelect, Select } from '../../components/Library';
import { FormControl, Heading, List, ListIcon, ListItem } from '@chakra-ui/react';
import { RiArrowDropRightLine, RiEditFill } from 'react-icons/ri';
import { useTranslation } from 'react-i18next';
import { useAllUsers } from '../../hooks/user';
import { colors } from '../../config/colors';
dayjs.extend(isBetween);

interface ContractOverviewProps {
  contract: Contract;
  disabled: boolean;
}
const ContractOverview = ({ contract, disabled = true }: ContractOverviewProps) => {
  const { t } = useTranslation();
  return (
    <>
      <Heading as='h2' size='sm' mb="3" mt="5">{t('label.contractData')}</Heading>
      <FormControl id="appointmentsPerWeek" style={{margin: '8px auto'}}>
        <Input
          disabled={disabled}
          value={contract.appointmentsPerWeek || 0}
        />
        <FormLabel>{t('label.appointmentsPerWeek')}</FormLabel>
      </FormControl>
      <FormControl id="hoursPerWeek" style={{margin: '8px auto'}}>
        <Input
          disabled={disabled}
          value={contract.hoursPerWeek || 0}
        />
        <FormLabel>{t('label.hoursPerWeek')}</FormLabel>
      </FormControl>
      <FormControl id="bgColor" style={{margin: '8px auto'}}>
        <Select
          disabled={disabled}
          value={contract.bgColor}
          style={{backgroundColor: `var(--bg${contract.bgColor[0].toUpperCase() + contract.bgColor.substring(1)})`}}
        >
          {colors.map((color,i) => <option key={i} value={color}>{color}</option>)}
        </Select>
        <FormLabel>{t('label.bgColor')}</FormLabel>
      </FormControl>
    </>
  );
};

const EmployeeSettings = () => {
  const { t } = useTranslation();
  const { isLoading, error, employees, refetch } = useAllEmployees();
  const { isLoading: isLoadingTeams, error: errorTeams, teams } = useAllTeams();
  const {
    isLoading: isLoadingUsers,
    error: errorUsers,
    users,
  } = useAllUsers();

  const [ updateEmployee ] = useUpdateEmployee();

  const [addEmployeeToTeam, { error: savingError }] = useAddEmployeeToTeam();
  const [currentEmployee, setCurrentemployee] = useState<
    Employee | undefined
  >();

  const [employeeState, setEmployeeState] = useState({
    uuid: currentEmployee?.uuid ? currentEmployee?.uuid: '',
    firstName: currentEmployee ? currentEmployee.firstName : '',
    lastName: currentEmployee ? currentEmployee.lastName : '',
    alias: currentEmployee?.alias ? currentEmployee.alias : '',
    validUntil: currentEmployee?.validUntil ? currentEmployee.validUntil : undefined,
    userId: currentEmployee && currentEmployee?.user?.userId ? currentEmployee?.user?.userId : '',
    contract: currentEmployee && currentEmployee?.contract ? currentEmployee?.contract : [],
  });
  const defaultContract: Contract = {
    userId: currentEmployee?.uuid ? currentEmployee?.uuid: '',
    hoursPerWeek: 0,
    appointmentsPerWeek: 0,
    bgColor: 'green',
    validUntil: null
  };
  const [currentContract, setCurrentContract] = useState<Contract>(() => currentEmployee?.contract[0] || defaultContract);
  const [currentTeam, setCurrentTeam] = useState<Team | undefined>();
  const [state, setState] = useState<'view' | 'edit'>('view');
  const remainingTeams = teams.filter(t => !currentEmployee?.teams?.find(ct => ct.team.uuid === t.uuid));

  useEffect(() => {
    if (!isLoading && employees.length) {
      setCurrentemployee(employees[0]);
    }
    if (!isLoadingTeams && teams.length) {
      setCurrentTeam(teams[0]);
    }
  }, [isLoading, isLoadingTeams]);

  const onEmployeeChangeHandler = (event: any) => {
    setCurrentemployee(
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

  const onTeamChangeHandler = (event: any) => {
    setCurrentTeam(teams.filter((t) => t.uuid === event.target.value)[0]);
  };

  const handleAddEmployeeToTeam = () => {
    if (currentTeam && currentEmployee) {
      const employee2Team:Employee2Team = {
        employee: currentEmployee,
        team: currentTeam
      };
      addEmployeeToTeam({employee2Team});
      refetch();
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
    const validUntil = employeeState.validUntil ? new Date(employeeState.validUntil) : currentEmployee?.validUntil ? new Date(currentEmployee?.validUntil) : undefined;
    updateEmployee({
      employee: {
        ...currentEmployee,
        ...employeeState,
        validUntil
      }
    });
  };
  const onSelectHandler = (e: any): void => {
    setEmployeeState((currentState) => ({
      ...currentState,
      userId: e.target.value,
    }));
  };
  const onSubmitHandler = (e: FormEvent): void => {
    // TODO: handle user add and user remove
    e.preventDefault();
    onUpdateEmployee();
    toggleEdit(e);
  };

  useEffect(() => {
    if ( !isLoading && currentEmployee ) {
      setState('view');
      setEmployeeState((currentState) => ({
        ...currentState,
        ...currentEmployee,
        userId: currentEmployee.user?.userId || ''
      }));
      setCurrentContract({...defaultContract, ...currentEmployee.contract[0]});
    }
  }, [currentEmployee, isLoading]);

  return !currentEmployee ? (
    <>
      <pre>pending</pre>
    </>
  ) : (
    <>
      <form
        onSubmit={onSubmitHandler}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          width: '100%',
          maxWidth: '500px',
        }}
      >
        <FormControl id="employee" style={{margin: '5px auto'}}>
          <Select
            name="employee"
            value={currentEmployee.uuid}
            onChange={onEmployeeChangeHandler}
          >
            {employees.map((t, i) => (
              <option key={i} value={t.uuid}>
                {t.firstName + ' ' + t.lastName}
              </option>
            ))}
          </Select>
          <FormLabel>{t('label.employeeSelect')}</FormLabel>
        </FormControl>
        <Heading as='h2' size='sm' mb="2" mt="5">{t('menu.personalData')}</Heading>
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
          value={employeeState.validUntil ? dayjs(employeeState.validUntil).format('YYYY-MM-DD') : ''}
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
        {currentContract
          ? <ContractOverview
            disabled={state === 'view'}
            contract={currentContract} />
          : <b>no Contract!</b>}
        {state === 'view' ? (
          <Button aria-label="toggle edit mode" onClick={toggleEdit}>
            <RiEditFill />
          </Button>
        ) : (
          <div>
            <Button aria-label="save changes" type="submit">
              {t('button.save')}
            </Button>
            <Button aria-label="cancel changes" type="button" onClick={cancelEdit}>
              {t('button.cancel')}
            </Button>
          </div>
        )}
        {currentEmployee.teams?.length ? (
          <>
            <Heading as='h3' size='sm' mb="2" mt="5">current teams</Heading>
            <List style={{marginBottom: '10px'}}>
              {currentEmployee.teams.map((t, i) => (
                <ListItem key={i}>
                  <ListIcon as={RiArrowDropRightLine}/>
                  {t.team.displayName}
                </ListItem>
              ))}
            </List>
          </>
        ) : (
          'no teams found. Please add the employee to at least one team!'
        )}
        {currentTeam && remainingTeams.length > 0 && (
          <>
            <FormControl id="team">
              <Select
                name="team"
                value={currentTeam.uuid}
                onChange={onTeamChangeHandler}
              >
                {remainingTeams.map((t, i) => (
                  <option key={i} value={t.uuid}>
                    {t.displayName}
                  </option>
                ))}
              </Select>
              <FormLabel>add to team:</FormLabel>
            </FormControl>
            <Button type="button" onClick={handleAddEmployeeToTeam}>
              Add
            </Button>
          </>
        )}
      </form>
    </>
  );
};

export default EmployeeSettings;
