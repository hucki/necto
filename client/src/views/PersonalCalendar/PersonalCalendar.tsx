/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { connect } from 'react-redux';
import CalendarContainer from '../../components/Calendar/CalendarContainer';
import { AppState } from '../../types/AppState';
import { useDaysEvents } from '../../hooks/events';
import dayjs, { Dayjs } from 'dayjs';
import { FullPageSpinner } from '../../components/Library';
import { useEffect, useState } from 'react';
import { Employee, Team } from '../../types/Employee';
import { EmployeeRessource } from '../../types/Ressource';
import { useAuth0User } from '../../hooks/user';

interface TeamCalendarInputProps {
  currentDate?: Dayjs;
  currentTeam?: Team;
  a0Id: string;
}

function PersonalCalendar({
  currentDate,
  currentTeam,
  a0Id,
}: TeamCalendarInputProps): JSX.Element {
  const [calendarDate, setCalendarDate] = useState(
    currentDate ? currentDate : dayjs()
  );
  const { isLoading, rawEvents } = useDaysEvents(calendarDate);
  const { user, isLoading: isLoadingUser } = useAuth0User(a0Id);

  useEffect(() => {
    if (currentDate && calendarDate !== currentDate)
      setCalendarDate(currentDate);
  }, [currentDate, calendarDate, setCalendarDate]);
  const teamMembers = currentTeam?.employees;

  interface TeamMemberMapProps {
    employee: Employee;
  }

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
      <CalendarContainer
        readOnly={false}
        events={rawEvents}
        ressources={ressources}
        daysRange={[calendarDate, calendarDate]}
      />
    </div>
  );
}

const mapStateToProps = (state: AppState) => {
  return {
    currentTeam: state.currentTeam,
    currentDate: state.current.currentDate,
    hoursInterval: state.settings.hoursInterval,
  };
};

export default connect(mapStateToProps, null)(PersonalCalendar);
