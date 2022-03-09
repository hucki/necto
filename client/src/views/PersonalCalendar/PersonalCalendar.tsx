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
import { useAuth0 } from '@auth0/auth0-react';

interface TeamCalendarInputProps {
  currentDate?: Dayjs;
  currentTeam?: Team;
}

function PersonalCalendar({
  currentDate,
  currentTeam,
}: TeamCalendarInputProps): JSX.Element {
  const [calendarDate, setCalendarDate] = useState(
    currentDate ? currentDate : dayjs()
  );
  const { isLoading, rawEvents } = useDaysEvents(calendarDate);
  const { user, isAuthenticated, isLoading: isLoadingAuth } = useAuth0();
  useEffect(() => {
    if (currentDate && calendarDate !== currentDate)
      setCalendarDate(currentDate);
  }, [currentDate, calendarDate, setCalendarDate]);
  const teamMembers = currentTeam?.employees;

  interface TeamMemberMapProps {
    employee: Employee;
  }
  const ressources: EmployeeRessource[] = teamMembers?.length
    ? [teamMembers.map(({ employee }: TeamMemberMapProps) => ({
      uuid: employee.uuid,
      displayName: employee.firstName,
      shortDescription: employee.firstName,
      longDescription: employee.firstName + ' ' + employee.lastName,
      bgColor: employee.contract[0].bgColor,
    }))[0]]
    : [];

  if (isLoading) return <FullPageSpinner />;
  console.log({user});
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
