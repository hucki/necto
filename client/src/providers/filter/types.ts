import { Dispatch, SetStateAction } from 'react';
import { Company } from '../../types/Company';
import { Team } from '../../types/Employee';

export type CalendarView = 'day' | 'week';
export type EventTypeOption = 'appointments' | 'leave';

export type FilterStateContextType = {
  calendarView: CalendarView;
  setCalendarView: Dispatch<SetStateAction<CalendarView>>;
  currentCompany: Company | undefined;
  setCurrentCompany: Dispatch<SetStateAction<Company>>;
  currentTeam: Team | undefined;
  setCurrentTeam: Dispatch<SetStateAction<Team | undefined>>;
  currentBuildingId: string | undefined;
  setCurrentBuildingId: Dispatch<SetStateAction<string | undefined>>;
  currentEventType: EventTypeOption;
  setCurrentEventType: Dispatch<SetStateAction<EventTypeOption>>;
};

export type FilterContext = FilterStateContextType;
