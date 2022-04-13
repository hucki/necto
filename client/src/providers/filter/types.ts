import { Dispatch, SetStateAction } from 'react';
import { Company } from '../../types/Company';
import { Team } from '../../types/Employee';

export type CalendarView = 'day' | 'week'

export type FilterStateContextType = {
  calendarView: CalendarView,
  setCalendarView: Dispatch<SetStateAction<CalendarView>>,
  currentCompany: Company | undefined,
  setCurrentCompany: Dispatch<SetStateAction<Company | undefined>>,
  currentTeam: Team | undefined,
  setCurrentTeam: Dispatch<SetStateAction<Team | undefined>>,
  currentBuildingId: string | undefined,
  setCurrentBuildingId: Dispatch<SetStateAction<string | undefined>>,
}

export type FilterContext = FilterStateContextType