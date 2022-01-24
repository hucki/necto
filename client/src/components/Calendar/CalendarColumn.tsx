/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import dayjs, { Dayjs } from 'dayjs';
import { Event } from '../../types/Event';
import { EmployeeRessource, Room } from '../../types/Ressource';
import TeamtableItem from '../Timetable/TeamTableItem/TeamTableItem';
import classes from './Calendar.module.css';
import { Dispatch, SetStateAction } from 'react';
import { v4 as uuid } from 'uuid';

interface CalendarColumnInputProps {
  date: Dayjs;
  events: Event[];
  ressources: Array<EmployeeRessource | Room>;
  numOfHours: number;
  hoursInterval: [number, number];
  clickedId: string | undefined;
  setClickedId: Dispatch<SetStateAction<string | undefined>>;
  clickedDateTime: Dayjs;
  setClickedDateTime: Dispatch<SetStateAction<Dayjs>>;
  openModal: () => void;
  readOnly?: boolean;
  useWeekdayAsHeader?: boolean;
}
interface ItemStyle {
  top: string;
  height: string;
}

function CalendarColumn({
  date,
  events,
  ressources,
  numOfHours,
  hoursInterval,
  clickedId,
  setClickedId,
  clickedDateTime,
  setClickedDateTime,
  openModal,
  readOnly = false,
  useWeekdayAsHeader = false,
}: CalendarColumnInputProps): JSX.Element {
  const renderCustomEvent = (event: Event, styles: ItemStyle) => {
    if (!event.uuid) event.uuid = uuid();
    return (
      <TeamtableItem
        readOnly={readOnly}
        key={event.uuid.toString()}
        event={event}
        styles={styles}
      />
    );
  };

  function getPosition(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
    e.preventDefault();
    if (e.target !== e.currentTarget) return;
    setClickedId(e.currentTarget.id.split(/_r/)[1].toString());
    const clickedDate = dayjs(e.currentTarget.id.split(/_d/)[1].substr(0, 8));
    const { height, top } = e.currentTarget.getBoundingClientRect();
    const startOfDay = clickedDate.add(hoursInterval[0], 'hour');
    const pxPerHour = height / numOfHours;
    const clickedPx = e.pageY - top < 0 ? 0 : e.pageY - top;
    const clickedMinutesRounded =
      Math.round(clickedPx / (pxPerHour / 60) / 15) * 15;
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
      height: `calc(100% * ${percentOfToday})`,
    };
    return itemStyle;
  }
  const ressourceColsHeader = ressources.map((ressource) => (
    <div
      id={`rcolHeader_r${ressource.uuid}`}
      key={`rcolHeader_r${ressource.uuid}`}
      css={{
        width: `calc(100% / ${ressources.length})`,
        textAlign: 'center',
        backgroundColor: `${ressource.bgColor}`, // TODO: get the real colors
      }}
      className={`${classes['bg_' + ressource.bgColor]} `}
    >
      {ressource.displayName}
    </div>
  ));
  const ressourceColsBody = ressources.map((ressource, index) => (
    <div
      id={`rcolBody_d${date.format('YYYYMMDD')}_r${ressource.uuid}`}
      key={`rcolBody_d${date.format('YYYYMMDD')}_r${ressource.uuid}`}
      css={{
        width: `calc(100% / ${ressources.length})`,
        height: '100%',
        position: 'relative',
        borderRight:
          index === ressources.length - 1 ? '1px solid gray' : undefined,
      }}
      onClick={readOnly ? () => null : getPosition}
    >
      {events
        .filter((event) => event.ressourceId === ressource.uuid)
        .map((event) => renderCustomEvent(event, getItemStyle(event)))}
    </div>
  ));

  return (
    <div
      id={`CalendarDay_d${date.format('YYYYMMDD')}`}
      key={`CalendarDay_d${date.format('YYYYMMDD')}`}
      css={{
        width: '100%',
        textAlign: 'center',
      }}
    >
      <div
        id={`DayHeader_d${date.format('YYYYMMDD')}`}
        key={`DayHeader_d${date.format('YYYYMMDD')}`}
        css={{
          height: `calc((100% / ${numOfHours + 1}) / 2)`,
          backgroundColor: 'orange',
          color: 'white',
          fontWeight: 'bold',
        }}
      >
        {useWeekdayAsHeader ? date.format('dddd') : date.format('DD.MM.YYYY')}
      </div>
      <div
        id={`RessourceHeader_d${date.format('YYYYMMDD')}`}
        key={`RessourceHeader_d${date.format('YYYYMMDD')}`}
        css={{
          display: 'flex',
          height: `calc((100% / ${numOfHours + 1}) / 2)`,
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
          height: `calc(100% / ${numOfHours + 1} * ${numOfHours})`,
          flexDirection: 'row',
        }}
      >
        {ressourceColsBody}
      </div>
    </div>
  );
}

export { CalendarColumn };
