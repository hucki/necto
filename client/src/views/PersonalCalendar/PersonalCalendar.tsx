import React from 'react';
import CalendarContainer from '../../components/organisms/Calendar/CalendarContainer';
import { useEvents } from '../../hooks/events';
import dayjs, { Dayjs } from 'dayjs';
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
import { Employee } from '../../types/Employee';

dayjs.extend(weekOfYear);
dayjs.extend(LocalizedFormat);
dayjs.extend(utc);
dayjs.locale('de');

interface PersonalCalendarInputProps {
  id: string;
  employeeId: Employee['uuid'];
}

function PersonalCalendar({
  id,
  employeeId,
}: PersonalCalendarInputProps): JSX.Element {
  const [currentCalendarView, setCurrentCalendarView] = useState<
    CalendarView | undefined
  >();
  const { calendarView, setCalendarView } = useContext(filterContext);
  const { isMobile } = useViewport();
  const { currentDate } = useContext(UserDateContext);
  const [calendarDate, setCalendarDate] = useState(
    currentDate ? currentDate : dayjs()
  );

  const eventDate =
    calendarView === 'week'
      ? {
          week: calendarDate.week(),
        }
      : {
          date: calendarDate,
        };
  const { isLoading: isLoadingEvents, rawEvents: events } = useEvents({
    year: calendarDate.year(),
    employeeId,
    ...eventDate,
  });

  const { user, isLoading: isLoadingUser } = useUser(id);
  const isLoading = isLoadingEvents || isLoadingUser;

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

  const daysRange: [Dayjs, Dayjs] =
    calendarView === 'day'
      ? [calendarDate, calendarDate]
      : [
          calendarDate.startOf('week'),
          calendarDate.startOf('week').add(6, 'day'),
        ];
  return (
    <ViewWrapper>
      <FilterBar hasDayWeekOption hasEventTypeOption />
      <CalendarContainer
        readOnly={false}
        events={events}
        ressources={ressources}
        daysRange={daysRange}
        columnHeaderFormat={
          calendarView === 'week' && isMobile ? 'DD.' : 'DD.MM.'
        }
        columnSubHeaderContent={
          calendarView === 'week' && isMobile ? 'dd' : 'dddd'
        }
      />
    </ViewWrapper>
  );
}

export default PersonalCalendar;
