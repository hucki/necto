import React, { Dispatch, useContext, useEffect } from 'react';
import { connect } from 'react-redux';
import { setCurrentTeam } from '../../actions/actions';
import { AppState } from '../../types/AppState';
import classes from './FilterBar.module.css';
import { useAllTeams } from '../../hooks/teams';
import { Team } from '../../types/Employee';
import { Label, Select } from '../Library';
import { Company } from '../../types/Company';
import { useAllCompanies } from '../../hooks/companies';
import { FilterStateContext } from '../../providers/FilterStateProvider';

interface FilterBarProps {
  hasTeamsFilter?: boolean;
  hasCompanyFilter?: boolean;
  hasBuildingFilter?: boolean;
  currentTeam: Team;
  dispatch: Dispatch<any>;
}

const NavBar = ({
  hasTeamsFilter = false,
  hasBuildingFilter = false,
  hasCompanyFilter = false,
  currentTeam,
  dispatch,
}: FilterBarProps) => {
  const {currentCompany, setCurrentCompany} = useContext(FilterStateContext);
  const { isLoading: isLoadingTeams, error, teams } = useAllTeams();

  const {
    isLoading: isLoadingCompanies,
    error: hasErrorCompanies,
    companies,
  } = useAllCompanies();

  useEffect(() => {
    if (!isLoadingTeams && teams.length) {
      dispatch(setCurrentTeam(teams[0]));
    }
  }, [isLoadingTeams]);

  useEffect(() => {
    if (!isLoadingCompanies && companies.length) {
      setCurrentCompany(companies[0]);
    }
  }, [isLoadingCompanies]);

  function onTeamChangeHandler(event: any) {
    dispatch(
      setCurrentTeam(teams.filter((t) => t.uuid === event.target.value)[0])
    );
  }

  function onCompanyChangeHandler(event: any) {
    setCurrentCompany(
      companies.filter((c) => c.uuid === event.target.value)[0]
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
      {hasBuildingFilter && (
        <>
          <Label htmlFor="building">Building</Label>
          <Select
            name="building"
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
      {hasCompanyFilter && currentCompany && (
        <>
          <Label htmlFor="company">Company</Label>
          <Select
            name="company"
            value={currentCompany.uuid}
            onChange={onCompanyChangeHandler}
          >
            {companies.map((c, i) => (
              <option key={i} value={c.uuid}>
                {c.name}
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
