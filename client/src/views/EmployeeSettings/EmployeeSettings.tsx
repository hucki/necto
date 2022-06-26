import React, { FormEvent, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { useAllEmployees, useUpdateEmployee } from '../../hooks/employees';
import { Employee, Employee2Team, Team } from '../../types/Employee';
import { useAddEmployeeToTeam } from '../../hooks/teams';
import { useAllTeams } from '../../hooks/teams';
import { Button, FormGroup, Input, Label, Select } from '../../components/Library';
import { Heading, List, ListIcon, ListItem } from '@chakra-ui/react';
import { RiArrowDropRightLine, RiEditFill } from 'react-icons/ri';
import { useTranslation } from 'react-i18next';
import { useAllUsers } from '../../hooks/user';
dayjs.extend(isBetween);

interface EmployeeOverviewProps {
  employee: Employee;
}
const EmployeeOverview = ({ employee }: EmployeeOverviewProps) => {
  return (
    <>
      <Heading as='h3' size='sm'>Contract Data</Heading>
      <List>
        <ListItem>
          <ListIcon as={RiArrowDropRightLine}/>
          AppointmentsPerWeek:{' '} <strong>{employee.contract[0].appointmentsPerWeek}</strong>
        </ListItem>
        <ListItem>
          <ListIcon as={RiArrowDropRightLine}/>
          HoursPerWeek: <strong>{employee.contract[0].hoursPerWeek}</strong>
        </ListItem>
        <ListItem>
          <ListIcon as={RiArrowDropRightLine}/>
          bgColor: <strong>{employee.contract[0].bgColor}</strong>
        </ListItem>
      </List>
      <Heading as='h3' size='sm'>Teams</Heading>
      {employee.teams?.length ? (
        <>
          <Heading as='h4' size='sm'>current teams</Heading>
          <List>
            {employee.teams.map((t, i) => (
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
    console.log('submit');
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

  console.log(employeeState);
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
        <Heading as='h2' size='lg'>Employee Profile</Heading>
        <FormGroup>
          <Label htmlFor="employee">select employee</Label>
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
        </FormGroup>
        <Heading as='h3' size='sm'>Personal Data</Heading>
        <FormGroup>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            disabled={state === 'view'}
            type="text"
            name="firstName"
            autoComplete="given-name"
            value={employeeState.firstName}
            onChange={onChangeHandler}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="alias">alias</Label>
          <Input
            disabled={state === 'view'}
            type="text"
            name="alias"
            autoComplete="alias"
            value={employeeState.alias}
            onChange={onChangeHandler}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            disabled={state === 'view'}
            type="text"
            name="lastName"
            autoComplete="family-name"
            value={employeeState.lastName}
            onChange={onChangeHandler}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="user">User</Label>
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
        </FormGroup>
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
        <EmployeeOverview employee={currentEmployee} />
        <br />
        {currentTeam && (
          <>
            add selected employee to team:
            <select
              name="team"
              value={currentTeam.uuid}
              onChange={onTeamChangeHandler}
            >
              {teams.map((t, i) => (
                <option key={i} value={t.uuid}>
                  {t.displayName}
                </option>
              ))}
            </select>
          </>
        )}
        <button type="button" onClick={handleAddEmployeeToTeam}>
          Add
        </button>
      </form>
    </>
  );
};

export default EmployeeSettings;
