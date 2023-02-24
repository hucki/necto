import React, { useEffect, useRef } from 'react';
import { useContext, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { Event } from '../../../types/Event';
import { AppState } from '../../../types/AppState';
import { EmployeeRessource } from '../../../types/Ressource';
import { CalendarColumn } from './CalendarColumn';
import { useDisclosure } from '@chakra-ui/react';
import CalendarEventInput from './CalendarEventInput';
import { GoToTarget, UserDateContext } from '../../../providers/UserDate';
import {
  CalendarScale,
  CalendarScaleHeader,
  CalendarScaleItem,
  CalendarScaleTime,
  CalendarWrapper,
} from '../../Library';
import { useSwipe } from '../../../hooks/useSwipe';
import { filterContext } from '../../../providers/filter';
import CalendarLeaveInput from './CalendarLeaveInput';
import { SwipeIndicator } from '../../atoms/SwipeIndicator';
import { useSelector } from 'react-redux';
import { Room } from '../../../types/Rooms';

interface CalendarInputProps {
  events: Event[];
  ressources: Array<EmployeeRessource | Room>;
  hoursInterval?: [number, number];
  daysRange: [Dayjs, Dayjs];
  readOnly?: boolean;
  columnHeaderFormat?: CalendarColumnHeaderFormat;
  columnSubHeaderContent?: CalendarColumnSubHeaderContent;
}
const currentDayjs = dayjs();

function CalendarContainer({
  events,
  ressources,
  daysRange = [currentDayjs, currentDayjs],
  readOnly = false,
  columnHeaderFormat = 'dddd DD.MM.',
  columnSubHeaderContent = 'ressource',
}: CalendarInputProps): JSX.Element {
  const hoursInterval = useSelector(
    (state) => (state as AppState).settings.hoursInterval
  );
  const daysRangeRef = useRef<[Dayjs, Dayjs]>(daysRange);
  const prevDaysRangeRef = useRef<[Dayjs, Dayjs]>(daysRange);
  const { goTo } = useContext(UserDateContext);
  const { calendarView, currentEventType } = useContext(filterContext);
  const { setTouchStart, setTouchEnd, horizontalDirection } = useSwipe();
  const eventModal = useDisclosure();
  const leaveModal = useDisclosure();
  const isOpenModal = eventModal.isOpen || leaveModal.isOpen;
  const [clickedId, setClickedId] = useState<string | undefined>(undefined);
  const [clickedDateTime, setClickedDateTime] = useState(dayjs());
  const [numOfDays] = useState(
    dayjs(daysRange[1]).diff(daysRange[0], 'day') + 1
  );
  const [currentHoursInterval, setCurrentHoursInterval] =
    useState(hoursInterval);
  const numOfHours =
    currentHoursInterval === undefined
      ? 0
      : currentHoursInterval[1] - currentHoursInterval[0] + 1;
  const scaleWidth = '1rem';
  const handleCloseEventInput = () => {
    setClickedId(undefined);
    eventModal.onClose();
  };
  const handleCloseLeaveInput = () => {
    setClickedId(undefined);
    leaveModal.onClose();
  };
  useEffect(() => {
    if (horizontalDirection) {
      if (!isOpenModal) {
        const target = `${
          horizontalDirection === 'left' ? 'next' : 'previous'
        }${calendarView[0].toUpperCase() + calendarView.substring(1)}`;
        goTo(target as GoToTarget);
      }
    }
  }, [horizontalDirection, clickedId]);

  useEffect(() => {
    if (clickedId) {
      if (currentEventType === 'appointments') {
        eventModal.onOpen();
      } else {
        leaveModal.onOpen();
      }
    }
  }, [clickedId]);

  useEffect(() => {
    if (daysRange[0].isSame(daysRangeRef.current[0])) {
      return;
    } else {
      prevDaysRangeRef.current = daysRangeRef.current;
      daysRangeRef.current = daysRange;
    }
  }, [daysRange]);
  // calculate boundaries to fit all events
  events.forEach((event) => {
    // FIXME: this resets only the scale but not the CalendarColumns
    if (event.isAllDay) return;
    if (event.isCancelled) return;
    const newStart = dayjs(event.startTime).hour();
    const newEnd = dayjs(event.endTime).hour();
    if (currentHoursInterval === undefined) {
      setCurrentHoursInterval([newStart, newEnd]);
      return;
    }
    if (currentHoursInterval && newStart < currentHoursInterval[0]) {
      setCurrentHoursInterval((current) => [
        newStart,
        current === undefined ? newEnd : current[1],
      ]);
    }
    if (currentHoursInterval && newEnd > currentHoursInterval[1]) {
      setCurrentHoursInterval((current) => [
        current === undefined ? newStart : current[0],
        newEnd,
      ]);
    }
  });
  if (currentHoursInterval === undefined) return <div>no hoursInterval</div>;
  const calendarScale = [];
  for (let i = currentHoursInterval[0]; i <= currentHoursInterval[1]; i++) {
    calendarScale.push(
      <CalendarScaleItem
        numOfHours={numOfHours}
        id={`CalendarScale_${i}`}
        key={`CalendarScale_${i}`}
      >
        <CalendarScaleTime>{i}</CalendarScaleTime>
      </CalendarScaleItem>
    );
  }
  const calendarDays = [];
  let curCalendarDay = daysRange[0];

  const isSameDay = (event: Event) => {
    return dayjs(event.startTime).isSame(dayjs(curCalendarDay), 'date');
  };

  for (let i = 0; i < numOfDays; i++) {
    const daysEvents = events.filter((event) =>
      !event.isCancelled && isSameDay(event) ? event : undefined
    );
    calendarDays.push(
      <CalendarColumn
        key={`CalColumn_d${dayjs(curCalendarDay).format('YYYYMMDD')}`}
        date={curCalendarDay}
        events={daysEvents}
        ressources={ressources}
        numOfHours={numOfHours}
        hoursInterval={currentHoursInterval}
        clickedId={clickedId}
        setClickedId={setClickedId}
        clickedDateTime={clickedDateTime}
        setClickedDateTime={setClickedDateTime}
        openModal={
          currentEventType === 'appointments'
            ? eventModal.onOpen
            : leaveModal.onOpen
        }
        readOnly={readOnly}
        columnHeaderFormat={columnHeaderFormat}
        columnSubHeaderContent={columnSubHeaderContent}
      />
    );
    curCalendarDay = curCalendarDay.add(1, 'day');
  }
  return (
    <CalendarWrapper
      id="containerDiv"
      key="containerDiv"
      onTouchStart={setTouchStart}
      onTouchEnd={setTouchEnd}
    >
      <CalendarScale
        scaleWidth={scaleWidth}
        id="CalendarScale"
        key="CalendarScale"
      >
        <CalendarScaleHeader
          numOfHours={numOfHours}
          id="CalendarScaleHeader"
          key="CalendarScaleHeader"
        ></CalendarScaleHeader>
        {calendarScale}
      </CalendarScale>
      {calendarDays}
      {clickedId ? (
        <>
          <CalendarEventInput
            uuid={clickedId}
            ressource={ressources.filter((r) => r.uuid === clickedId)[0]}
            dateTime={clickedDateTime}
            isOpen={eventModal.isOpen}
            onClose={handleCloseEventInput}
          />
          <CalendarLeaveInput
            uuid={clickedId}
            ressource={ressources.filter((r) => r.uuid === clickedId)[0]}
            dateTime={clickedDateTime}
            isOpen={leaveModal.isOpen}
            onClose={handleCloseLeaveInput}
          />
        </>
      ) : null}
      {horizontalDirection && (
        <SwipeIndicator direction={horizontalDirection} />
      )}
    </CalendarWrapper>
  );
}

export default CalendarContainer;
