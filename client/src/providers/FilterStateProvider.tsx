// import UserContext — you'd learn how to implement this below
import React, { createContext, Dispatch, SetStateAction, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(LocalizedFormat);
dayjs.locale('de');
import { Company } from '../types/Company';

export type CalendarView = 'day' | 'week'

type FilterStateContextType = {
  calendarView: CalendarView,
  setCalendarView: Dispatch<SetStateAction<CalendarView>>,
  currentCompany: Company | undefined,
  setCurrentCompany: Dispatch<SetStateAction<Company | undefined>>,
}

const defaultFilterState: FilterStateContextType = {
  calendarView: 'day',
  setCalendarView: () => undefined,
  currentCompany: undefined,
  setCurrentCompany: () => undefined,
};

const FilterStateContext = createContext<FilterStateContextType>(defaultFilterState);

function FilterStateProvider({children}:{children: any}) {

  const [calendarView, setCalendarView] = useState<CalendarView>('day');
  const [currentCompany, setCurrentCompany] = useState<Company | undefined>(undefined);
  const value = useMemo(() => ({
    calendarView,
    setCalendarView,
    currentCompany,
    setCurrentCompany
  }),[calendarView, currentCompany]);

  return (
    <FilterStateContext.Provider value={value}>
      {children}
    </FilterStateContext.Provider>
  );

}

export {FilterStateProvider, FilterStateContext};