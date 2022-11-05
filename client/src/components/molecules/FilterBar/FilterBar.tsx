import React, { useEffect } from 'react';
import { useAllTeams } from '../../../hooks/teams';
import { Label, Select, FilterBarContainer } from '../../Library';
import { useAllCompanies } from '../../../hooks/companies';
import { useFilter } from '../../../hooks/useFilter';
import { useAllbuildings } from '../../../hooks/buildings';
import { useTranslation } from 'react-i18next';
import { EventTypeOption, CalendarView } from '../../../providers/filter/types';

interface FilterBarProps {
  hasTeamsFilter?: boolean;
  hasCompanyFilter?: boolean;
  hasBuildingFilter?: boolean;
  hasDayWeekOption?: boolean;
  hasEventTypeOption?: boolean;
}

const FilterBar = ({
  hasTeamsFilter = false,
  hasBuildingFilter = false,
  hasCompanyFilter = false,
  hasDayWeekOption = false,
  hasEventTypeOption = false,
}: FilterBarProps) => {
  const { t } = useTranslation();
  const {
    currentCompany,
    setCurrentCompany,
    currentTeam,
    setCurrentTeam,
    currentBuildingId,
    setCurrentBuildingId,
    calendarView,
    setCalendarView,
    currentEventType,
    setCurrentEventType,
  } = useFilter();

  const { isLoading: isLoadingTeams, teams } = useAllTeams();

  const { isLoading: isLoadingCompanies, companies } = useAllCompanies();

  const { buildings } = useAllbuildings();

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

  function onTeamSelecthandler(event: React.FormEvent<HTMLSelectElement>) {
    setCurrentTeam(
      teams.filter((t) => t.uuid === event.currentTarget.value)[0]
    );
  }

  function onCompanySelecthandler(event: React.FormEvent<HTMLSelectElement>) {
    setCurrentCompany(
      companies.filter((c) => c.uuid === event.currentTarget.value)[0]
    );
  }

  function onBuildingSelecthandler(event: React.FormEvent<HTMLSelectElement>) {
    setCurrentBuildingId(event.currentTarget.value);
  }

  function onDayWeekSelecthandler(event: React.FormEvent<HTMLSelectElement>) {
    setCalendarView(event.currentTarget.value as CalendarView);
  }

  function onEventTypeSelecthandler(event: React.FormEvent<HTMLSelectElement>) {
    setCurrentEventType(event.currentTarget.value as EventTypeOption);
  }

  return (
    <FilterBarContainer>
      {hasTeamsFilter && currentTeam && (
        <>
          <Label htmlFor="team">Team:</Label>
          <Select
            name="team"
            value={currentTeam.uuid}
            onChange={onTeamSelecthandler}
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
            onChange={onBuildingSelecthandler}
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
            onChange={onCompanySelecthandler}
          >
            {companies.map((c, i) => (
              <option key={i} value={c.uuid}>
                {c.name}
              </option>
            ))}
          </Select>
        </>
      )}
      {hasDayWeekOption && (
        <>
          <Label htmlFor="DayWeek">{t('calendar.view.label')}</Label>
          <Select
            name="DayWeek"
            value={calendarView}
            onChange={onDayWeekSelecthandler}
          >
            <option value="day">{t('calendar.view.day')}</option>
            <option value="week">{t('calendar.view.week')}</option>
          </Select>
        </>
      )}
      {hasEventTypeOption && (
        <>
          <Select
            name="eventType"
            value={currentEventType}
            onChange={onEventTypeSelecthandler}
          >
            <option value="appointments">
              📅 {t('calendar.option.appointments')}
            </option>
            <option value="leave"> 🏝 {t('calendar.option.leave')}</option>
          </Select>
        </>
      )}
    </FilterBarContainer>
  );
};

export default FilterBar;
