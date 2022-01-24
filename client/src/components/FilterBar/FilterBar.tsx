import React, { Dispatch, useEffect } from 'react';
import { connect } from 'react-redux';
import { setCurrentTeam } from '../../actions/actions';
import { AppState } from '../../types/AppState';
import classes from './FilterBar.module.css';
import { useAllTeams } from '../../hooks/teams';
import { Team } from '../../types/Employee';
import { Label, Select } from '../Library';

interface FilterBarProps {
  hasTeamsFilter: boolean;
  hasBuildingFilter: boolean;
  currentTeam: Team;
  dispatch: Dispatch<any>;
}

const NavBar = ({
  hasTeamsFilter = false,
  hasBuildingFilter = false,
  currentTeam,
  dispatch,
}: FilterBarProps) => {
  const { isLoading: isLoadingTeams, error, teams } = useAllTeams();

  useEffect(() => {
    if (!isLoadingTeams && teams.length) {
      console.log(teams[0]);
      dispatch(setCurrentTeam(teams[0]));
    }
  }, [isLoadingTeams]);

  function onTeamChangeHandler(event: any) {
    dispatch(
      setCurrentTeam(teams.filter((t) => t.uuid === event.target.value)[0])
    );
  }

  return (
    <div className={classes.FilterBar}>
      {hasTeamsFilter && currentTeam && (
        <>
          <Label htmlFor="team">Team</Label>
          <Select
            name="team"
            value={currentTeam.uuid}
            onChange={onTeamChangeHandler}
          >
            {teams.map((t, i) => (
              <option key={i} value={t.uuid}>
                {t.displayName}
              </option>
            ))}
          </Select>
        </>
      )}
    </div>
  );
};

const MapStateToProps = (state: AppState) => {
  const currentTeam = state.currentTeam;
  return { currentTeam };
};
const MapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    setCurrentTeam,
    dispatch,
  };
};

export default connect(MapStateToProps, MapDispatchToProps)(NavBar);
