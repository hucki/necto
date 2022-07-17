import React, { useEffect } from 'react';
import { useAllTeams } from '../../hooks/teams';
import { Label, Select, FilterBarContainer } from '../Library';
import { useAllCompanies } from '../../hooks/companies';
import { useFilter } from '../../hooks/useFilter';
import { useAllbuildings } from '../../hooks/buildings';

interface FilterBarProps {
  hasTeamsFilter?: boolean;
  hasCompanyFilter?: boolean;
  hasBuildingFilter?: boolean;
}

const FilterBar = ({
  hasTeamsFilter = false,
  hasBuildingFilter = false,
  hasCompanyFilter = false,
}: FilterBarProps) => {

  const {
    currentCompany,
    setCurrentCompany,
    currentTeam,
    setCurrentTeam,
    currentBuildingId,
    setCurrentBuildingId
  } = useFilter();

  const { isLoading: isLoadingTeams, error, teams } = useAllTeams();

  const {
    isLoading: isLoadingCompanies,
    error: hasErrorCompanies,
    companies,
  } = useAllCompanies();

  const {
    isLoading: isLoadingBuildings,
    error: errorBuildings,
    buildings,
  } = useAllbuildings();

  useEffect(() => {
    if (!isLoadingTeams && teams.length) {
      setCurrentTeam(teams[0]);
    }
  }, [isLoadingTeams]);

  useEffect(() => {
    if (!isLoadingCompanies && companies.length) {
      setCurrentCompany(companies[0]);
    }
  }, [isLoadingCompanies]);

  function onTeamChangeHandler(event: any) {
    setCurrentTeam(teams.filter((t) => t.uuid === event.target.value)[0]);
  }

  function onCompanyChangeHandler(event: any) {
    setCurrentCompany(
      companies.filter((c) => c.uuid === event.target.value)[0]
    );
  }

  function onBuildingChangeHandler(event: any) {
    setCurrentBuildingId(event.target.value);
  }

  return (
    <FilterBarContainer>
      {hasTeamsFilter && currentTeam && (
        <>
          <Label htmlFor="team">Team:</Label>
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
          <Label htmlFor="building">Ort</Label>
          <Select
            name="building"
            value={currentBuildingId}
            onChange={onBuildingChangeHandler}
          >
            {buildings.map((t, i) => (
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
    </FilterBarContainer>
  );
};

export default FilterBar;
