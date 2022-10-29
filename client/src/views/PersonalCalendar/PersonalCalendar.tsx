import React from 'react';
import { connect } from 'react-redux';
import CalendarContainer from '../../components/organisms/Calendar/CalendarContainer';
import { AppState } from '../../types/AppState';
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

dayjs.extend(weekOfYear);
dayjs.extend(LocalizedFormat);
dayjs.extend(utc);
dayjs.locale('de');

interface PersonalCalendarInputProps {
  id: string;
}

function PersonalCalendar({ id }: PersonalCalendarInputProps): JSX.Element {
  const { calendarView } = useContext(filterContext);
  const { isMobile } = useViewport();
  const { currentDate } = useContext(UserDateContext);
  const [calendarDate, setCalendarDate] = useState(
    currentDate ? currentDate : dayjs()
  );
  const { isLoading: isLoadingDaysEvents, rawEvents: daysEvents } =
    useDaysEvents(calendarDate);
  const { isLoading: isLoadingWeeksEvents, rawEvents: weeksEvents } =
    useWeeksEvents(calendarDate.year(), calendarDate.week());
  const { user, isLoading: isLoadingUser } = useUser(id);
  const isLoading =
    isLoadingDaysEvents || isLoadingWeeksEvents || isLoadingUser;

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
      bgColor: thisEmployee.contract[0].bgColor || '',
    },
  ];

  return (
    <ViewWrapper>
      <FilterBar hasDayWeekOption hasCalendarOption />
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

const mapStateToProps = (state: AppState) => {
  return {
    hoursInterval: state.settings.hoursInterval,
  };
};

export default connect(mapStateToProps, null)(PersonalCalendar);
