import React, { FunctionComponent, ReactNode, useEffect } from 'react';
import { useState } from 'react';
import { CalendarOption, CalendarView } from './types';
import { Company } from '../../types/Company';
import { Team } from '../../types/Employee';
import { filterContext } from '.';
import { useAllCompanies } from '../../hooks/companies';

export const FilterProvider: FunctionComponent = ({
  children,
}: {
  children?: ReactNode;
}) => {
  const {
    isLoading: isLoadingCompanies,
    error: hasErrorCompanies,
    companies,
  } = useAllCompanies();
  const [calendarView, setCalendarView] = useState<CalendarView>('day');
  const [currentCalendarOption, setCurrentCalendarOption] =
    useState<CalendarOption>('appointments');
  const [currentCompany, setCurrentCompany] = useState<Company>(
    () => companies[0]
  );
  const [currentTeam, setCurrentTeam] = useState<Team | undefined>(undefined);
  const [currentBuildingId, setCurrentBuildingId] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    setCurrentCompany(companies[0]);
  }, [companies]);

  return (
    <filterContext.Provider
      value={{
        calendarView,
        setCalendarView,
        currentCompany,
        setCurrentCompany,
        currentBuildingId,
        setCurrentBuildingId,
        currentTeam,
        setCurrentTeam,
        currentCalendarOption,
        setCurrentCalendarOption,
      }}
    >
      {children}
    </filterContext.Provider>
  );
};
