import React, { ReactNode, useEffect } from 'react';
import { useState } from 'react';
import { EventTypeOption, CalendarView } from './types';
import { Company } from '../../types/Company';
import { Team } from '../../types/Employee';
import { filterContext } from '.';
import { useAllCompanies } from '../../hooks/companies';

type FilterProviderProps = {
  children?: ReactNode;
};
export const FilterProvider = ({ children }: FilterProviderProps) => {
  const { companies } = useAllCompanies();
  const [calendarView, setCalendarView] = useState<CalendarView>('week');
  const [currentEventType, setCurrentEventType] =
    useState<EventTypeOption>('appointments');
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
        currentEventType,
        setCurrentEventType,
      }}
    >
      {children}
    </filterContext.Provider>
  );
};
