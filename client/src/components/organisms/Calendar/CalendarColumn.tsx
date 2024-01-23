import React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { Event, isLeave } from '../../../types/Event';
import {
  EmployeeRessource,
  isEmployeeRessource,
} from '../../../types/Ressource';
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
} from '../../Library';
import CalendarTimeMarker from './CalendarTimeMarker';
import { useHolidays } from '../../../hooks/useHolidays';
import { DayHeaderLabel, HolidayLabel } from '../../Library/Calendar';
import CalendarLeaveEdit from './CalendarLeaveEdit';
import CalendarChooseEntryModal from './CalendarChooseEntryModal';
import { Room } from '../../../types/Rooms';
import { CounterOfDone } from '../../molecules/DataDisplay/CounterOfDone';
import styled from '@emotion/styled/macro';
import { BgColor } from '../../../types/Colors';
import {
  CalendarColumnHeaderFormat,
  CalendarColumnSubHeaderContent,
} from './types';
dayjs.locale('de');

export type OnClickCalendarEventProps = {
  e: React.MouseEvent<HTMLDivElement, MouseEvent>;
  event: Event;
};

const CounterOfDoneContainer = styled.div({
  position: 'absolute',
  bottom: 0,
  right: 0,
  zIndex: 1,
});

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
  targetDateTime: Dayjs | undefined;
  setTargetDateTime: Dispatch<SetStateAction<Dayjs | undefined>>;
  openModal: () => void;
  readOnly?: boolean;
  columnHeaderFormat?: CalendarColumnHeaderFormat;
  columnSubHeaderContent?: CalendarColumnSubHeaderContent;
}
export interface ItemStyle {
  top: string;
  height: string;
}

function CalendarColumn({
  date: dateInput,
  events,
  ressources,
  numOfHours,
  hoursInterval,
  setClickedId,
  setClickedDateTime,
  targetDateTime,
  setTargetDateTime,
  openModal,
  readOnly = false,
  columnHeaderFormat = 'dddd',
  columnSubHeaderContent = 'ressource',
}: CalendarColumnInputProps): JSX.Element {
  const { isPublicHoliday, isWeekend } = useHolidays();
  const isPublicHolidayToday = isPublicHoliday({ date: dateInput });
  const isToday = dayjs().isSame(dateInput, 'day');

  const date = dateInput.locale('de');
  const { onClose } = useDisclosure();

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

  interface RenderCustomEventProps {
    event: Event;
    styles: ItemStyle;
    bgColor?: BgColor;
  }
  const renderCustomEvent = ({
    event,
    styles,
    bgColor,
  }: RenderCustomEventProps) => {
    if (!event.uuid) event.uuid = uuid();
    return (
      <CalendarEntry
        readOnly={readOnly}
        key={event.uuid.toString()}
        event={event}
        onClickHandler={onClickCalendarEvent}
        styles={styles}
        showTime
        bgColor={bgColor}
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

  function setMouseOverTime(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void {
    e.preventDefault();
    if (e.target !== e.currentTarget) return;
    const clickedDate = dayjs(
      e.currentTarget.id.split(/_d/)[1].substring(0, 8)
    );
    const { height, top } = e.currentTarget.getBoundingClientRect();
    const startOfDay = clickedDate.add(hoursInterval[0], 'hour');
    const pxPerHour = height / numOfHours;
    const clickedPx = e.pageY - top < 0 ? 0 : e.pageY - top;
    const clickedMinutesRounded =
      Math.round(clickedPx / (pxPerHour / 60) / 15) * 15;
    const newTargetDateTime = startOfDay.add(clickedMinutesRounded, 'minute');
    if (targetDateTime !== newTargetDateTime) {
      setTargetDateTime(newTargetDateTime);
    }
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
  const ressourceColsHeader = ressources.map((ressource, index) => {
    return (
      <CalendarColumnRessourceHeader
        id={`rcolHeader_r${ressource.uuid}`}
        key={`rcolHeader_r${ressource.uuid}`}
        numOfRessources={ressources.length}
        bgColor={isEmployeeRessource(ressource) ? ressource.bgColor : undefined}
        index={index}
      >
        {columnSubHeaderContent === 'ressource'
          ? ressource.displayName
          : date.format(columnSubHeaderContent)}
      </CalendarColumnRessourceHeader>
    );
  });
  const ressourceColsBody = ressources.map((ressource, index) => {
    const noOfAppointments = {
      total: events
        .filter((event) => event.ressourceId === ressource.uuid)
        .filter((event) => event.type === 'appointment' && !event.isCancelled)
        .length,
      done: events
        .filter((event) => event.ressourceId === ressource.uuid)
        .filter(
          (event) =>
            event.type === 'appointment' && event.isDone && !event.isCancelled
        ).length,
    };
    return (
      <CalendarColumnRessourceBody
        id={`rcolBody_d${date.format('YYYYMMDD')}_r${ressource.uuid}`}
        key={`rcolBody_d${date.format('YYYYMMDD')}_r${ressource.uuid}`}
        numOfHours={numOfHours}
        numOfRessources={ressources.length}
        isPublicHoliday={Boolean(isPublicHolidayToday)}
        isWeekend={isWeekend({ date: dayjs(date) })}
        index={index}
        onClick={readOnly ? () => null : getPosition}
        onMouseMove={setMouseOverTime}
      >
        {Boolean(noOfAppointments.total) && (
          <CounterOfDoneContainer>
            <CounterOfDone
              done={noOfAppointments.done}
              total={noOfAppointments.total}
            />
          </CounterOfDoneContainer>
        )}
        {isPublicHolidayToday && (
          <HolidayLabel>{isPublicHolidayToday.join()}</HolidayLabel>
        )}
        {events
          .filter((event) => event.ressourceId === ressource.uuid)
          .map((event) =>
            renderCustomEvent({
              event,
              styles: getItemStyle(event),
              bgColor: isEmployeeRessource(ressource)
                ? ressource.bgColor
                : undefined,
            })
          )}
      </CalendarColumnRessourceBody>
    );
  });

  const columnHeader = date.format(columnHeaderFormat);

  const editModal = clickedEvent ? (
    !isLeave(clickedEvent) ? (
      <CalendarEventEdit
        event={clickedEvent}
        isOpen={true}
        readOnly={true}
        onClose={closeClickedEventHandler}
      />
    ) : (
      <CalendarLeaveEdit
        leave={clickedEvent}
        isOpen={true}
        onClose={closeClickedEventHandler}
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
      {targetDateTime && (
        <CalendarTimeMarker
          scaleHeightUnits={numOfHours + 1}
          firstHour={6}
          color="black"
          dateTime={targetDateTime}
          onlyLine={!date.isSame(targetDateTime, 'day')}
          hasDot={false}
        />
      )}
      <CalendarColumnDayHeader
        numOfHours={numOfHours}
        isToday={isToday}
        id={`DayHeader_d${date.format('YYYYMMDD')}`}
        key={`DayHeader_d${date.format('YYYYMMDD')}`}
      >
        <DayHeaderLabel>{columnHeader}</DayHeaderLabel>
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
