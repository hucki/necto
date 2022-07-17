/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import dayjs, { Dayjs } from 'dayjs';
import { Event } from '../../types/Event';
import { EmployeeRessource, Room } from '../../types/Ressource';
import { CalendarEntry } from './CalendarEntry';
import classes from './Calendar.module.css';
import { Dispatch, SetStateAction, useState } from 'react';
import { v4 as uuid } from 'uuid';
import CalendarEventEdit from './CalendarEventEdit';
import { useDisclosure } from '@chakra-ui/react';
import * as colors from '../../styles/colors';
import 'dayjs/locale/de';
dayjs.locale('de');

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
  columnHeaderFormat?: CalendarColumnHeaderFormat;
  columnSubHeaderContent?: CalendarColumnSubHeaderContent;
}
interface ItemStyle {
  top: string;
  height: string;
}

function CalendarColumn({
  date: dateInput,
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
  columnHeaderFormat = 'dddd',
  columnSubHeaderContent = 'ressource',
}: CalendarColumnInputProps): JSX.Element {
  const isToday = dayjs().isSame(dateInput, 'day');
  const isWeekend = dayjs(dateInput).day() === 0 || dayjs(dateInput).day() === 6;
  const date = dateInput.locale('de');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [clickedEvent, setClickedEvent] = useState<Event | null>(null);

  function onClickCalendarEvent(event: Event) {
    setClickedEvent(event);
  }

  function closeClickedEventHandler() {
    setClickedEvent(null);
    onClose();
  }

  const renderCustomEvent = (event: Event, styles: ItemStyle) => {
    if (!event.uuid) event.uuid = uuid();
    return (
      <CalendarEntry
        readOnly={readOnly}
        key={event.uuid.toString()}
        event={event}
        onClickHandler={onClickCalendarEvent}
        styles={styles}
        showTime
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
  const ressourceColsHeader = ressources.map((ressource, index) => (
    <div
      id={`rcolHeader_r${ressource.uuid}`}
      key={`rcolHeader_r${ressource.uuid}`}
      css={{
        width: `calc(100% / ${ressources.length})`,
        textAlign: 'center',
        borderRight:
          index === ressources.length - 1
            ? '2px solid gray'
            : '1px dashed #3333',
      }}
      className={`${classes['bg_' + ressource.bgColor]} `}
    >
      {columnSubHeaderContent === 'ressource' ? ressource.displayName : date.format(columnSubHeaderContent)}
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
        backgroundColor: isWeekend ? '#3333' : undefined,
        borderRight:
          index === ressources.length - 1
            ? '2px solid gray'
            : '1px dashed #3333',
      }}
      onClick={readOnly ? () => null : getPosition}
    >
      {events
        .filter((event) => event.ressourceId === ressource.uuid)
        .map((event) => renderCustomEvent(event, getItemStyle(event)))}
    </div>
  ));

  const columnHeader = date.format(columnHeaderFormat);
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
          backgroundColor: isToday ? `${colors.indigoDarken10}` : `${colors.gray20}`,
          color: isToday ? `${colors.indigoLighten80}` : `${colors.gray}`,
          fontWeight: 'bold',
        }}
      >
        {columnHeader}
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
      {clickedEvent && (
        <CalendarEventEdit
          event={clickedEvent}
          isOpen={true}
          readOnly={true}
          onClose={closeClickedEventHandler}
          onOpen={onOpen}
        />
      )}
    </div>
  );
}

export { CalendarColumn };
