/** @jsx jsx */
import { jsx } from '@emotion/react'
import { connect } from 'react-redux';
import CalendarContainer from '../../components/Calendar/CalendarContainer';
import { AppState } from '../../types/AppState';
import { useDaysEvents } from '../../hooks/events';
import dayjs, { Dayjs } from 'dayjs';
import { FullPageSpinner } from '../../components/Library';
import { TeamMember } from '../../types/User';
import { Ressource } from '../../types/Ressource';
import { useState } from 'react';

interface TeamCalendarInputProps {
  currentDate?: Dayjs;
  teamMembers: TeamMember[];
}

function TeamCalendar({ currentDate, teamMembers }: TeamCalendarInputProps):JSX.Element {
  const [ calendarDate ] = useState(currentDate ? currentDate : dayjs())
  const { isLoading, rawEvents } = useDaysEvents(
    calendarDate
  );
  const ressources: Ressource[] = teamMembers.map(member => ({id: member.id, shortDescription: member.firstName, longDescription: member.firstName + ' ' + member.lastName}))
  if (isLoading) return <FullPageSpinner />
  console.log(rawEvents)

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
      <CalendarContainer events={rawEvents} ressources={ressources} daysRange={[calendarDate, calendarDate]}/>
    </div>
  )
}

const mapStateToProps = (state: AppState) => {
  return {
    currentDate: state.current.currentDate,
    hoursInterval: state.settings.hoursInterval,
  };
};

export default connect(mapStateToProps, null)(TeamCalendar);