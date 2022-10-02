import { createContext } from 'react';
import { FilterContext } from './types';

export const defaultFilterContextProps: FilterContext = {
  calendarView: 'week',
  setCalendarView: () => undefined,
  currentCompany: undefined,
  setCurrentCompany: () => undefined,
  currentTeam: undefined,
  setCurrentTeam: () => undefined,
  currentBuildingId: undefined,
  setCurrentBuildingId: () => undefined,
  currentCalendarOption: 'appointments',
  setCurrentCalendarOption: () => undefined,
};

export const filterContext = createContext<FilterContext>(
  defaultFilterContextProps
);

export const FilterContextConsumer = filterContext.Consumer;
