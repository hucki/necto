/** @jsx jsx */
import { jsx } from '@emotion/react';
import dayjs from 'dayjs';
import { Event } from '../../types/Event';

interface CalendarInputProps {
  events: Event[]
}
function CalendarContainer({events}: CalendarInputProps):JSX.Element {
  const days : string[] = [];
  events.map(event => {
    return dayjs(event.startTime).format('YYYY-MM-DD')
  })
  const dayRows = days.map(day => <div>day</div>)
  return (
    <div
      css={{
        fontSize: '4em',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
      }}
    >
      <div>CalendarScale from appSettings</div>
      {dayRows}
      <div>one CalendarDay per Date in Events Object
        <div>one CalendarRow per Ressource/Person</div>
      </div>
    </div>
  )
}

export {CalendarContainer};