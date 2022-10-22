import React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { Event } from '../../types/Event';
import { EmployeeRessource, Room } from '../../types/Ressource';
import { CalendarEntry } from './CalendarEntry';
import { Dispatch, SetStateAction, useState } from 'react';
import { v4 as uuid } from 'uuid';
import CalendarEventEdit from './CalendarEventEdit';
import { useDisclosure } from '@chakra-ui/react';
import 'dayjs/locale/de';
import {
  CalendarColumnDayHeader,
  CalendarColumnRessourceBody,
  CalendarColumnRessourceHeader,
  CalendarColumnRessourceWrapper,
  CalendarColumnWrapper,
} from '../Library';
import CalendarTimeMarker from './CalendarTimeMarker';
import { useHolidays } from '../../hooks/useHolidays';
import { DayHeaderLabel, HolidayLabel } from '../Library/Calendar';
import CalendarLeaveEdit from './CalendarLeaveEdit';
import CalendarChooseEntryModal from './CalendarChooseEntryModal';
dayjs.locale('de');

export type OnClickCalendarEventProps = {
  e: React.MouseEvent<HTMLDivElement, MouseEvent>;
  event: Event;
};

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
  const { isHoliday, isPublicHoliday, isWeekend } = useHolidays();
  const isHolidayToday = isHoliday({ date: dateInput });
  const isPublicHolidayToday = isPublicHoliday({ date: dateInput });
  const isToday = dayjs().isSame(dateInput, 'day');

  const date = dateInput.locale('de');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [clickedEvent, setClickedEvent] = useState<Event | null>(null);
  const [clickedMultiEvents, setClickedMultiEvents] = useState<
    Event[] | undefined
  >();

  function onClickCalendarEvent({ e, event }: OnClickCalendarEventProps) {
    const clickedEventElements = allClickedElements(e.pageX, e.pageY);
    if (clickedEventElements.length > 1) {
      setClickedMultiEvents(
        // clickedEventElements
        //   .map((el) =>
        events.filter((ev) =>
          clickedEventElements.includes(ev.uuid as string)
        ) || undefined
      );
    } else {
      setClickedEvent(event);
    }
  }

  const allClickedElements = (x: number, y: number) => {
    return (
      document
        .elementsFromPoint(x, y)
        .filter((element) => element.id.startsWith('calEntry-'))
        .map((element) => element.id.substring(9)) || undefined
    );
  };

  const onChosenEvent = (e: Event) => {
    setClickedMultiEvents(undefined);
    setClickedEvent(e);
  };
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
    const clickedDate = dayjs(
      e.currentTarget.id.split(/_d/)[1].substring(0, 8)
    );
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
    if (event.isAllDay) {
      return {
        top: '0',
        height: '100%',
      };
    }
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
    <CalendarColumnRessourceHeader
      id={`rcolHeader_r${ressource.uuid}`}
      key={`rcolHeader_r${ressource.uuid}`}
      numOfRessources={ressources.length}
      bgColor={ressource.bgColor}
      index={index}
    >
      {columnSubHeaderContent === 'ressource'
        ? ressource.displayName
        : date.format(columnSubHeaderContent)}
    </CalendarColumnRessourceHeader>
  ));
  const ressourceColsBody = ressources.map((ressource, index) => (
    <CalendarColumnRessourceBody
      id={`rcolBody_d${date.format('YYYYMMDD')}_r${ressource.uuid}`}
      key={`rcolBody_d${date.format('YYYYMMDD')}_r${ressource.uuid}`}
      numOfHours={numOfHours}
      numOfRessources={ressources.length}
      isPublicHoliday={Boolean(isPublicHolidayToday)}
      isWeekend={isWeekend({ date: dayjs(date) })}
      index={index}
      onClick={readOnly ? () => null : getPosition}
    >
      {isPublicHolidayToday && (
        <HolidayLabel>{isPublicHolidayToday.join()}</HolidayLabel>
      )}
      {events
        .filter((event) => event.ressourceId === ressource.uuid)
        .map((event) => renderCustomEvent(event, getItemStyle(event)))}
    </CalendarColumnRessourceBody>
  ));

  const columnHeader = date.format(columnHeaderFormat);

  const editModal = clickedEvent ? (
    clickedEvent?.type !== 'leave' ? (
      <CalendarEventEdit
        event={clickedEvent}
        isOpen={true}
        readOnly={true}
        onClose={closeClickedEventHandler}
        onOpen={onOpen}
      />
    ) : (
      <CalendarLeaveEdit
        leave={clickedEvent}
        isOpen={true}
        readOnly={true}
        onClose={closeClickedEventHandler}
        onOpen={onOpen}
      />
    )
  ) : undefined;
  return (
    <CalendarColumnWrapper
      id={`CalendarDay_d${date.format('YYYYMMDD')}`}
      key={`CalendarDay_d${date.format('YYYYMMDD')}`}
    >
      {isToday && (
        <CalendarTimeMarker scaleHeightUnits={numOfHours + 1} firstHour={6} />
      )}
      <CalendarColumnDayHeader
        numOfHours={numOfHours}
        isToday={isToday}
        id={`DayHeader_d${date.format('YYYYMMDD')}`}
        key={`DayHeader_d${date.format('YYYYMMDD')}`}
      >
        <DayHeaderLabel size={isPublicHolidayToday ? 'small' : undefined}>
          {columnHeader}
        </DayHeaderLabel>
        {isPublicHolidayToday && (
          <HolidayLabel>{isPublicHolidayToday.join()}</HolidayLabel>
        )}
      </CalendarColumnDayHeader>
      <CalendarColumnRessourceWrapper
        id={`RessourceHeader_d${date.format('YYYYMMDD')}`}
        key={`RessourceHeader_d${date.format('YYYYMMDD')}`}
        numOfHours={numOfHours}
      >
        {ressourceColsHeader}
      </CalendarColumnRessourceWrapper>
      <div
        id={`RessourceBody_d${date.format('YYYYMMDD')}`}
        key={`RessourceBody_d${date.format('YYYYMMDD')}`}
        style={{
          display: 'flex',
          height: `calc(100% / ${numOfHours + 1} * ${numOfHours})`,
          flexDirection: 'row',
        }}
      >
        {ressourceColsBody}
      </div>
      {clickedEvent && editModal}
      {clickedMultiEvents && (
        <CalendarChooseEntryModal
          events={clickedMultiEvents}
          handleChosenEvent={onChosenEvent}
        />
      )}
    </CalendarColumnWrapper>
  );
}

export { CalendarColumn };
