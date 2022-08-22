import React, { FormEvent, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { useAllEmployees, useUpdateEmployee } from '../../hooks/employees';
import { Contract, Employee, Employee2Team, Team } from '../../types/Employee';
import { useAddEmployeeToTeam } from '../../hooks/teams';
import { useAllTeams } from '../../hooks/teams';
import { Button, FormLabel, Input, Select } from '../../components/Library';
import { FormControl, Heading, List, ListIcon, ListItem } from '@chakra-ui/react';
import { RiArrowDropRightLine, RiEditFill } from 'react-icons/ri';
import { useTranslation } from 'react-i18next';
import { useAllUsers } from '../../hooks/user';
import { colors } from '../../config/colors';
dayjs.extend(isBetween);

interface ContractOverviewProps {
  contract: Contract;
}
const ContractOverview = ({ contract }: ContractOverviewProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Heading as='h2' size='sm' mb="3">{t('label.contractData')}</Heading>
      <FormControl id="appointmentsPerWeek" style={{margin: '8px auto'}}>
        <Input value={contract.appointmentsPerWeek}/>
        <FormLabel>AppointmentsPerWeek</FormLabel>
      </FormControl>
      <FormControl id="hoursPerWeek" style={{margin: '8px auto'}}>
        <Input value={contract.hoursPerWeek}/>
        <FormLabel>HoursPerWeek</FormLabel>
      </FormControl>
      <FormControl id="bgColor" style={{margin: '8px auto'}}>
        <Select
          value={contract.bgColor}
          style={{backgroundColor: `var(--bg${contract.bgColor[0].toUpperCase() + contract.bgColor.substring(1)})`}}
        >
          {colors.map((color,i) => <option key={i} value={color}>{color}</option>)}
        </Select>
        <FormLabel>bgColor</FormLabel>
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
    alias: currentEmployee ? currentEmployee.alias : '',
    userId: currentEmployee && currentEmployee?.user?.userId ? currentEmployee?.user?.userId : '',
    contract: currentEmployee && currentEmployee?.contract ? currentEmployee?.contract : [],
  });
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
    updateEmployee({
      employee: {
        ...currentEmployee,
        ...employeeState
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
    e.preventDefault();
    onUpdateEmployee();
    toggleEdit(e);
  };

  useEffect(() => {
    if ( !isLoading && currentEmployee ) {
      setEmployeeState((currentState) => ({
        ...currentState,
        ...currentEmployee,
        userId: currentEmployee.user?.userId || ''
      }));
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
        <Heading as='h2' size='sm' mb="2">{t('menu.personalData')}</Heading>
        <FormControl id="firstName" style={{margin: '5px auto'}}>
          <Input
            disabled={state === 'view'}
            type="text"
            name="firstName"
            autoComplete="given-name"
            value={employeeState.firstName}
            onChange={onChangeHandler}
          />
          <FormLabel>{t('label.firstName')}</FormLabel>
        </FormControl>
        <FormControl id="alias" style={{margin: '5px auto'}}>
          <Input
            disabled={state === 'view'}
            type="text"
            name="alias"
            autoComplete="alias"
            value={employeeState.alias}
            onChange={onChangeHandler}
          />
          <FormLabel>alias</FormLabel>
        </FormControl>
        <FormControl id="lastName" style={{margin: '5px auto'}}>
          <Input
            disabled={state === 'view'}
            type="text"
            name="lastName"
            autoComplete="family-name"
            value={employeeState.lastName}
            onChange={onChangeHandler}
          />
          <FormLabel>{t('label.lastName')}</FormLabel>
        </FormControl>
        <FormControl id="user" style={{margin: '5px auto'}}>
          <Select
            disabled={state === 'view'}
            name="userId"
            value={employeeState.userId}
            onChange={onSelectHandler}
          >
            <option value={'remove'}>❌ No User</option>
            {users
              // .filter(u => u.userSettings && u.userSettings[0].userId !== currentEmployee.user?.userId)
              .map((u, i) => (
                <option key={i} value={u.uuid}>
                  {u.email + ':' + u.lastName + ', ' + u.firstName}
                </option>
              ))}
          </Select>
          <FormLabel>User</FormLabel>
        </FormControl>
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
        {currentEmployee.contract.length ? <ContractOverview contract={currentEmployee.contract[0]} /> : <b>no Contract!</b>}
        <br />
        {currentEmployee.teams?.length ? (
          <>
            <Heading as='h3' size='sm' mb="2">current teams</Heading>
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
