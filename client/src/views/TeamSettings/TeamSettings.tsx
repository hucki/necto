import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { useAllTeams } from '../../hooks/teams';
import { Team } from '../../types/Employee';
dayjs.extend(isBetween);

const TeamSettings = () => {
  const { isLoading, error, teams } = useAllTeams();
  const [currentTeam, setCurrentTeam] = useState<Team | undefined>();

  useEffect(() => {
    if (!isLoading && teams.length) {
      setCurrentTeam(teams[0]);
    }
  }, [isLoading]);
  const onTeamChangeHandler = (event: any) => {
    setCurrentTeam(teams.filter((t) => t.uuid === event.target.value)[0]);
  };

  return !currentTeam ? (
    <>
      <pre>pending</pre>
    </>
  ) : (
    <>
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
      {currentTeam.employees?.length ? (
        currentTeam.employees.map((e, i) => (
          <div key={i}>{e.employee.firstName}</div>
        ))
      ) : (
        <div>no peeps in this team</div>
      )}
    </>
  );
};

export default TeamSettings;
