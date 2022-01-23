import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { useAllEmployees } from '../../hooks/employees';
import { Employee, Employee2Team, Team } from '../../types/Employee';
import { useAddEmployeeToTeam } from '../../hooks/teams';
import { useAllTeams } from '../../hooks/teams';
dayjs.extend(isBetween);

interface EmployeeOverviewProps {
  employee: Employee;
}
const EmployeeOverview = ({ employee }: EmployeeOverviewProps) => {
  return (
    <>
      <h2>{employee.firstName + ' ' + employee.lastName}</h2>
      <h3>Contract Data</h3>
      <ul>
        <li>
          AppointmentsPerWeek:{' '}
          <strong>{employee.contract[0].appointmentsPerWeek}</strong>
        </li>
        <li>
          HoursPerWeek: <strong>{employee.contract[0].hoursPerWeek}</strong>
        </li>
        <li>
          bgColor: <strong>{employee.contract[0].bgColor}</strong>
        </li>
      </ul>
      <h3>Teams</h3>
      {employee.teams?.length ? (
        <>
          <h4>current teams</h4>
          <ul>
            {employee.teams.map((t, i) => (
              <li key={i}>{t.displayName}</li>
            ))}
          </ul>
        </>
      ) : (
        'no teams found. Please add the employee to at least one team!'
      )}
    </>
  );
};

const EmployeeSettings = () => {
  const { isLoading, error, employees } = useAllEmployees();
  const { isLoading: isLoadingTeams, error: errorTeams, teams } = useAllTeams();
  const [addEmployeeToTeam, { error: savingError }] = useAddEmployeeToTeam();

  const [currentEmployee, setCurrentemployee] = useState<
    Employee | undefined
  >();
  useEffect(() => {
    if (!isLoading && employees.length) {
      setCurrentemployee(employees[0]);
    }
  }, [isLoading]);

  const onemployeeChangeHandler = (event: any) => {
    setCurrentemployee(
      employees.filter((t) => t.uuid === event.target.value)[0]
    );
  };

  const [currentTeam, setCurrentTeam] = useState<Team | undefined>();

  useEffect(() => {
    if (!isLoadingTeams && teams.length) {
      setCurrentTeam(teams[0]);
    }
  }, [isLoadingTeams]);

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
    }

  };

  return !currentEmployee ? (
    <>
      <pre>pending</pre>
    </>
  ) : (
    <>
      <select
        name="employee"
        value={currentEmployee.uuid}
        onChange={onemployeeChangeHandler}
      >
        {employees.map((t, i) => (
          <option key={i} value={t.uuid}>
            {t.firstName + ' ' + t.lastName}
          </option>
        ))}
      </select>
      <EmployeeOverview employee={currentEmployee} />
      <br />
      add selected employee to team:
      {currentTeam && (
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
      )}
      <button type="button" onClick={handleAddEmployeeToTeam}>
        Add
      </button>
    </>
  );
};

export default EmployeeSettings;
