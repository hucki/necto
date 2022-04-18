/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { connect } from 'react-redux';
import CalendarContainer from '../../components/Calendar/CalendarContainer';
import { AppState } from '../../types/AppState';
import { useDaysEvents, useWeeksEvents } from '../../hooks/events';
import dayjs, { Dayjs } from 'dayjs';
import { FullPageSpinner, Label, Select } from '../../components/Library';
import { useContext, useEffect, useState } from 'react';
import { EmployeeRessource } from '../../types/Ressource';
import { useAuth0User } from '../../hooks/user';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';
import { Flex } from '@chakra-ui/react';
import { UserDateContext } from '../../providers/UserDate';

dayjs.extend(weekOfYear);
dayjs.extend(LocalizedFormat);
dayjs.extend(utc);
dayjs.locale('de');

interface PersonalCalendarInputProps {
  a0Id: string;
}

function PersonalCalendar({
  a0Id,
}: PersonalCalendarInputProps): JSX.Element {
  const {currentDate} = useContext(UserDateContext);
  const [calendarDate, setCalendarDate] = useState(
    currentDate ? currentDate : dayjs()
  );
  const { isLoading: isLoadingDaysEvents, rawEvents: daysEvents } = useDaysEvents(calendarDate);
  const { isLoading: isLoadingWeeksEvents, rawEvents: weeksEvents } = useWeeksEvents(calendarDate.year(), calendarDate.week());
  const { user, isLoading: isLoadingUser } = useAuth0User(a0Id);
  const isLoading = isLoadingDaysEvents || isLoadingWeeksEvents || isLoadingUser;

  const [currentView, setCurrentView] = useState<'day'|'week'>('day');
  const onCurrentViewChange = (event: any) => {
    setCurrentView(event.target.value);
  };

  useEffect(() => {
    if (currentDate && calendarDate !== currentDate)
      setCalendarDate(currentDate);
  }, [currentDate, calendarDate, setCalendarDate]);

  if (isLoading || isLoadingUser || !user?.uuid || !user?.userSettings?.length || !user?.userSettings[0].employee) return <FullPageSpinner />;

  const thisEmployee = user?.userSettings[0].employee;
  const ressources: EmployeeRessource[] = [
    {
      userId: user.uuid,
      uuid: thisEmployee.uuid,
      displayName: thisEmployee.firstName,
      shortDescription: thisEmployee.firstName,
      longDescription: thisEmployee.firstName + ' ' + thisEmployee.lastName,
      bgColor: thisEmployee.contract[0].bgColor || '',
    }
  ];

  return (
    <div
      css={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Flex w={300}>
        <Label htmlFor="view">View</Label>
        <Select
          name="view"
          value={currentView}
          onChange={onCurrentViewChange}
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
        </Select>
      </Flex>
      {currentView === 'day' &&
        <CalendarContainer
          readOnly={false}
          events={daysEvents}
          ressources={ressources}
          daysRange={[calendarDate, calendarDate]}
          columnHeaderFormat={'dddd DD.MM.'}
        />
      }
      {currentView === 'week' &&
        <CalendarContainer
          readOnly={false}
          events={weeksEvents}
          ressources={ressources}
          daysRange={[calendarDate.startOf('week'), calendarDate.startOf('week').add(6, 'day')]}
          columnHeaderFormat={'DD.MM.'}
        />
      }
    </div>
  );
}

const mapStateToProps = (state: AppState) => {
  return {
    hoursInterval: state.settings.hoursInterval,
  };
};

export default connect(mapStateToProps, null)(PersonalCalendar);