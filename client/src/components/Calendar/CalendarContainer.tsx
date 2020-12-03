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
  const [ numOfDays ] = useState(dayjs(daysRange[0]).diff(daysRange[1], 'day')+1);
  const [ totalRows ] = useState((1 + (numOfDays * ressources.length)));
  const [ currentHoursInterval, setCurrentHoursInterval ] = useState(hoursInterval);
  const [ numOfHours ] = useState(currentHoursInterval === undefined ? 0 : currentHoursInterval[1]-currentHoursInterval[0]);

  const days : string[] = [];
  events.map(event => {
    return dayjs(event.startTime).format('YYYY-MM-DD')
  })
  const dayRows = days.map(day => <div>day</div>)
  const ressourceColsHeader = ressources.map(ressource =>
    <div
      id={`rcolHeader_${ressource.id}`}
      css={{
        width: `calc(100% / ${ressources.length})`,
        textAlign: 'center',
      }}
    >
      {ressource.shortDescription}
    </div>
  )
  const ressourceColsBody = ressources.map(ressource =>
    <div
      id={`rcolBody_${ressource.id}`}
      css={{
        width: `calc(100% / ${ressources.length})`,
        height: '100%'
      }}
    >
      content
    </div>
  )

  // calculate boundaries to fit all events
  events.forEach(event => {
    const newStart = dayjs(event.startTime).hour();
    const newEnd = dayjs(event.endTime).hour();
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
  const calendarScale = [];
  for (let i = currentHoursInterval[0]; i<=currentHoursInterval[1]; i++) {
    calendarScale.push(<div id={`CalendarScale_${i}`} css={{height: `calc(100% / ${numOfHours})`}}>{i}:00</div>)
  }
  const calendarDays = [];
  let curCalendarDay = daysRange[0];
  for (let i = 0; i <= dayjs(daysRange[0]).diff(daysRange[1], 'day'); i++) {
    calendarDays.push(
    <div id={`CalendarDay_${i}`}
      css={{
        width: `calc((100% - (100% / ${totalRows})) * ${numOfDays})`,
        textAlign: 'center'
      }}
      >
      <div id={`DayHeader_${i}`} css={{ height: `calc((100% / ${numOfHours+1}) / 2)`}}
      >{curCalendarDay.format('DD.MM.YYYY')}</div>
      <div id={`RessourceHeader_${i}`}
        css={{
          display: 'flex',
          height: `calc((100% / ${numOfHours+1}) / 2)`,
          flexDirection: 'row',
        }}
      >
        {ressourceColsHeader}
      </div>
      <div id={`RessourceBody_${i}`}
        css={{
          display: 'flex',
          height: `calc(100% / ${numOfHours+1} * ${numOfHours})`,
          flexDirection: 'row',
          //justifyContent: 'space-around',
        }}
      >
        {ressourceColsBody}
      </div>
    </div>
      )
    curCalendarDay = curCalendarDay.add(1, 'day');
  }

  return (
    <div id="containerDiv"
      css={{
        fontSize: '1rem',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        textAlign: 'right'
      }}
    >
      <div id="CalendarScale"
      css={{
        width: `calc(100% / ${totalRows})`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <div id="CalendarScaleHeader"
          css={{height: `calc(100% / ${numOfHours+1})`}}>
          </div>
        {calendarScale}
      </div>
      {dayRows}
      {calendarDays}
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