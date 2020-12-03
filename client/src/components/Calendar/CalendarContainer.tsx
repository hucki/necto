/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { Event } from '../../types/Event';
import { AppState } from '../../types/AppState';
import { Ressource } from '../../types/Ressource';
import { connect } from 'react-redux';

interface CalendarInputProps {
  events: Event[];
  ressources: Ressource[];
  hoursInterval?: [number, number];
  currentDate?: Dayjs;
  daysRange: [Dayjs, Dayjs];
}
const currentDayjs = dayjs();

function CalendarContainer({events, hoursInterval, ressources, currentDate, daysRange = [currentDayjs, currentDayjs]}: CalendarInputProps):JSX.Element {
  const [ currentHoursInterval, setCurrentHoursInterval ] = useState(hoursInterval);
  const days : string[] = [];
  events.map(event => {
    return dayjs(event.startTime).format('YYYY-MM-DD')
  })
  const dayRows = days.map(day => <div>day</div>)
  const ressourceRows = ressources.map(ressource => <div id={`${ressource.id}`}>{ressource.shortDescription}</div>)
  console.log(ressourceRows)
  // calculate boundaries to fit all events
  events.forEach(event => {
    const newStart = dayjs(event.startTime).hour();
    const newEnd = dayjs(event.endTime).hour() + 1;
    console.log([newStart, newEnd])
    if (currentHoursInterval === undefined) {
      setCurrentHoursInterval([newStart, newEnd]);
      return;
    }
    if (currentHoursInterval && newStart < currentHoursInterval[0] ) {
      setCurrentHoursInterval(current => [newStart, current === undefined ? newEnd : current[1]]);
    }
    if (currentHoursInterval && newEnd > currentHoursInterval[1] ) {
      setCurrentHoursInterval(current => [current === undefined ? newStart : current[0], newEnd]);
    }
  })
  if (currentHoursInterval === undefined) return <div>no hoursInterval</div>
  return (
    <div id="containerDiv"
      css={{
        fontSize: '1rem',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
      }}
    >
      <div id="CalendarScale">CalendarScale from {currentHoursInterval[0]} to {currentHoursInterval[1]} </div>
      {dayRows}
      <div id="CalendarDay">one CalendarDay per Date in Events Object
      <div id="CalendarRow">one CalendarRow per Ressource/Person: {ressourceRows}</div>
      </div>
    </div>
  )
}
const mapStateToProps = (state: AppState) => {
  return {
    currentDate: state.current.currentDate,
    hoursInterval: state.settings.hoursInterval,
  };
};

export default connect(mapStateToProps, null)(CalendarContainer);