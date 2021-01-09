/** @jsx jsx */
import { jsx } from '@emotion/react';
import dayjs, { Dayjs } from 'dayjs';
import { Event } from '../../types/Event';
import { Ressource } from '../../types/Ressource';
import TeamtableItem from '../Timetable/TeamTableItem/TeamTableItem';
import * as colors from '../../styles/colors'
import { Dispatch, SetStateAction } from 'react';

interface CalendarColumnInputProps {
  date: Dayjs;
  events: Event[];
  ressources: Ressource[];
  numOfHours: number;
  hoursInterval: [number, number];
  clickedId: number;
  setClickedId: Dispatch<SetStateAction<number>>;
  clickedDateTime: Dayjs;
  setClickedDateTime: Dispatch<SetStateAction<Dayjs>>;
  openModal: () => void;
}
interface ItemStyle {
  top: string;
  height: string;
}

function CalendarColumn({date, events, ressources, numOfHours, hoursInterval, clickedId, setClickedId, clickedDateTime, setClickedDateTime, openModal}:CalendarColumnInputProps):JSX.Element {
  const renderCustomEvent = (event: Event, styles: ItemStyle) => {
    return <TeamtableItem key={event.id} event={event} styles={styles} />;
  };

  function getPosition(e: React.MouseEvent<HTMLDivElement, MouseEvent>) : void {
    e.preventDefault();
    if (e.target !== e.currentTarget) return;
    setClickedId(parseInt(e.currentTarget.id.split(/_r/)[1]));
    const clickedDate = dayjs(e.currentTarget.id.split(/_d/)[1].substr(0,8));
    const {height, top } = e.currentTarget.getBoundingClientRect();
    const startOfDay = clickedDate.add(hoursInterval[0], 'hour');
    const pxPerHour = height / numOfHours;
    const clickedPx = e.pageY - top < 0 ? 0 : e.pageY - top;
    const clickedMinutesRounded = Math.round(clickedPx / (pxPerHour / 60)/15) * 15;
    setClickedDateTime(startOfDay.add(clickedMinutesRounded, 'minute'));
    openModal();
  }

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
      onClick={getPosition}
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