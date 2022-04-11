import React, { FunctionComponent, ReactNode } from 'react';
import { useState } from 'react';
import { CalendarView, FilterContext } from '../../types/AppState';
import { Company } from '../../types/Company';
import { Team } from '../../types/Employee';
import { filterContext } from '.';

export const FilterProvider: FunctionComponent = ({children}:  { children?: ReactNode; }) => {

  const [ calendarView, setCalendarView ] = useState<CalendarView>('day');
  const [ currentCompany, setCurrentCompany ] = useState<Company | undefined>(undefined);
  const [ currentTeam, setCurrentTeam ] = useState<Team | undefined>(undefined);
  const [ currentBuildingId, setCurrentBuildingId ] = useState<string | undefined>(undefined);

  return (
    <filterContext.Provider value={{
      calendarView,
      setCalendarView,
      currentCompany,
      setCurrentCompany,
      currentBuildingId,
      setCurrentBuildingId,
      currentTeam,
      setCurrentTeam
    }}>
      {children}
    </filterContext.Provider>
  );
};