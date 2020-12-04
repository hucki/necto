/** @jsx jsx */
import { jsx } from '@emotion/react';
import dayjs, { Dayjs } from 'dayjs';
import { Event } from '../../types/Event';
import { Ressource } from '../../types/Ressource';
import TeamtableItem from '../Timetable/TeamTableItem/TeamTableItem';
import * as colors from '../../styles/colors'

interface CalendarColumnInputProps {
  date: Dayjs;
  events: Event[];
  ressources: Ressource[];
  numOfHours: number;
  hoursInterval: [number, number];
}
interface ItemStyle {
  top: string;
  height: string;
}

function CalendarColumn({date, events, ressources, numOfHours, hoursInterval}:CalendarColumnInputProps):JSX.Element {
  const renderCustomEvent = (event: Event, styles: ItemStyle) => {
    return <TeamtableItem key={event.id} event={event} styles={styles} />;
  };
  function getItemStyle(event: Event) {
    const minsToday = numOfHours * 60;
    const minsFromStartOfDay = dayjs(event.startTime).diff(
      dayjs(event.startTime).startOf('day').add(hoursInterval[0], 'h'),
      'minute'
    );
    const minsDuration = dayjs(event.endTime).diff(event.startTime, 'minute');
    const percentFromStartOfToday = minsFromStartOfDay / minsToday;
    const percentOfToday = minsDuration / minsToday;
    const itemStyle = {
      top: `calc(100% * ${percentFromStartOfToday})`,
      height: `calc(100% * ${percentOfToday})`
    };
    return itemStyle;
  }
  const ressourceColsHeader = ressources.map(ressource =>
    <div
      id={`rcolHeader_r${ressource.id}`}
      key={`rcolHeader_r${ressource.id}`}
      css={{
        width: `calc(100% / ${ressources.length})`,
        textAlign: 'center',
        backgroundColor: `${colors.bg.blue50}`, // TODO: get the real colors
      }}
    >
      {ressource.shortDescription}
    </div>
  )
  const ressourceColsBody = ressources.map(ressource =>
    <div
      id={`rcolBody_d${date.format('YYYYMMDD')}_r${ressource.id}`}
      key={`rcolBody_d${date.format('YYYYMMDD')}_r${ressource.id}`}
      css={{
        width: `calc(100% / ${ressources.length})`,
        height: '100%',
        position:  'relative'
      }}
    >
      { events.filter((event) => event.userId === ressource.id).map(event =>
          renderCustomEvent(event, getItemStyle(event)))}
    </div>
  )

  return (
    <div
      id={`CalendarDay_d${date.format('YYYYMMDD')}`}
      key={`CalendarDay_d${date.format('YYYYMMDD')}`}
      css={{
        width: `100%`,
        textAlign: 'center'
      }}
      >
      <div
        id={`DayHeader_d${date.format('YYYYMMDD')}`}
        key={`DayHeader_d${date.format('YYYYMMDD')}`}
        css={{
          height: `calc((100% / ${numOfHours+1}) / 2)`,
          backgroundColor: 'orange',
          color: 'white',
          fontWeight: 'bold',
        }}
      >{date.format('DD.MM.YYYY')}</div>
      <div
        id={`RessourceHeader_d${date.format('YYYYMMDD')}`}
        key={`RessourceHeader_d${date.format('YYYYMMDD')}`}
        css={{
          display: 'flex',
          height: `calc((100% / ${numOfHours+1}) / 2)`,
          flexDirection: 'row',
        }}
      >
        {ressourceColsHeader}
      </div>
      <div
        id={`RessourceBody_d${date.format('YYYYMMDD')}`}
        key={`RessourceBody_d${date.format('YYYYMMDD')}`}
        css={{
          display: 'flex',
          height: `calc(100% / ${numOfHours+1} * ${numOfHours})`,
          flexDirection: 'row',
        }}
      >
        {ressourceColsBody}
      </div>
    </div>
  )
}

export {CalendarColumn};