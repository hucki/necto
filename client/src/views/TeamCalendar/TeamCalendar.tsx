/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { connect } from 'react-redux';
import CalendarContainer from '../../components/Calendar/CalendarContainer';
import { AppState } from '../../types/AppState';
import { useDaysEvents } from '../../hooks/events';
import dayjs, { Dayjs } from 'dayjs';
import { FullPageSpinner } from '../../components/Library';
import { TeamMember } from '../../types/User';
import { Person } from '../../types/Ressource';
import { useEffect, useState } from 'react';

interface TeamCalendarInputProps {
  currentDate?: Dayjs;
  teamMembers: TeamMember[];
}

function TeamCalendar({
  currentDate,
  teamMembers,
}: TeamCalendarInputProps): JSX.Element {
  const [calendarDate, setCalendarDate] = useState(
    currentDate ? currentDate : dayjs()
  );
  const { isLoading, rawEvents } = useDaysEvents(calendarDate);
  // teamMembers.forEach(member => console.log(member.bgColor))
  useEffect(() => {
    if (currentDate && calendarDate !== currentDate)
      setCalendarDate(currentDate);
  }, [currentDate, calendarDate, setCalendarDate]);

  const ressources: Person[] = teamMembers.map((member) => ({
    id: member.id,
    displayName: member.firstName,
    shortDescription: member.firstName,
    longDescription: member.firstName + ' ' + member.lastName,
    bgColor: member.bgColor,
  }));
  if (isLoading) return <FullPageSpinner />;

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
    currentDate: state.current.currentDate,
    hoursInterval: state.settings.hoursInterval,
  };
};

export default connect(mapStateToProps, null)(TeamCalendar);
