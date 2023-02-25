import React from 'react';
import CalendarContainer from '../../components/organisms/Calendar/CalendarContainer';
import { useDaysEvents, useWeeksEvents } from '../../hooks/events';
import dayjs from 'dayjs';
import { useContext, useEffect, useState } from 'react';
import { EmployeeRessource } from '../../types/Ressource';
import { useUser } from '../../hooks/user';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';
import { UserDateContext } from '../../providers/UserDate';
import { useViewport } from '../../hooks/useViewport';
import FilterBar from '../../components/molecules/FilterBar/FilterBar';
import { filterContext } from '../../providers/filter';
import { FullPageSpinner } from '../../components/atoms/LoadingSpinner';
import { ViewWrapper } from '../../components/atoms/Wrapper';
import { CalendarView } from '../../providers/filter/types';

dayjs.extend(weekOfYear);
dayjs.extend(LocalizedFormat);
dayjs.extend(utc);
dayjs.locale('de');

interface PersonalCalendarInputProps {
  id: string;
}

function PersonalCalendar({ id }: PersonalCalendarInputProps): JSX.Element {
  const [currentCalendarView, setCurrentCalendarView] = useState<
    CalendarView | undefined
  >();
  const { calendarView, setCalendarView } = useContext(filterContext);
  const { isMobile } = useViewport();
  const { currentDate } = useContext(UserDateContext);
  const [calendarDate, setCalendarDate] = useState(
    currentDate ? currentDate : dayjs()
  );
  const { isLoading: isLoadingDaysEvents, rawEvents: daysEventsUnfiltered } =
    useDaysEvents(calendarDate);
  const { isLoading: isLoadingWeeksEvents, rawEvents: weeksEventsUnfiltered } =
    useWeeksEvents(calendarDate.year(), calendarDate.week());

  console.log({
    events: weeksEventsUnfiltered.map((e) => ({
      start: e.startTime,
      end: e.endTime,
      type: e.type,
      isCancelled: e.isCancelled,
    })),
  });
  const { user, isLoading: isLoadingUser } = useUser(id);
  const isLoading =
    isLoadingDaysEvents || isLoadingWeeksEvents || isLoadingUser;

  useEffect(() => {
    if (!currentCalendarView) {
      setCalendarView('week');
      setCurrentCalendarView('week');
    }
  }, [currentCalendarView]);

  useEffect(() => {
    if (currentDate && calendarDate !== currentDate)
      setCalendarDate(currentDate);
  }, [currentDate, calendarDate, setCalendarDate]);

  if (
    isLoading ||
    isLoadingUser ||
    !user?.uuid ||
    !user?.userSettings?.length ||
    !user?.userSettings[0].employee
  )
    return <FullPageSpinner />;

  const thisEmployee = user?.userSettings[0].employee;
  const daysEvents = daysEventsUnfiltered.filter(
    (e) => e.ressourceId === thisEmployee.uuid
  );
  const weeksEvents = weeksEventsUnfiltered.filter(
    (e) => e.ressourceId === thisEmployee.uuid
  );
  const ressources: EmployeeRessource[] = [
    {
      userId: user.uuid,
      uuid: thisEmployee.uuid,
      displayName: thisEmployee.firstName,
      shortDescription: thisEmployee.firstName,
      longDescription: thisEmployee.firstName + ' ' + thisEmployee.lastName,
      bgColor: thisEmployee.contract[0]?.bgColor || '',
      roomId: thisEmployee.contract[0]?.roomId || '',
    },
  ];

  return (
    <ViewWrapper>
      <FilterBar hasDayWeekOption hasEventTypeOption />
      {calendarView === 'day' && (
        <CalendarContainer
          readOnly={false}
          events={daysEvents}
          ressources={ressources}
          daysRange={[calendarDate, calendarDate]}
          columnHeaderFormat={'DD.MM.'}
          columnSubHeaderContent="dddd"
        />
      )}
      {calendarView === 'week' && (
        <CalendarContainer
          readOnly={false}
          events={weeksEvents}
          ressources={ressources}
          daysRange={[
            calendarDate.startOf('week'),
            calendarDate.startOf('week').add(6, 'day'),
          ]}
          columnHeaderFormat={isMobile ? 'DD.' : 'DD.MM.'}
          columnSubHeaderContent={isMobile ? 'dd' : 'dddd'}
        />
      )}
    </ViewWrapper>
  );
}

export default PersonalCalendar;
