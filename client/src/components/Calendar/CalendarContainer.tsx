import React, { useEffect, useRef } from 'react';
import { useContext, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { Event } from '../../types/Event';
import { AppState } from '../../types/AppState';
import { EmployeeRessource, Room } from '../../types/Ressource';
import { connect } from 'react-redux';
import { CalendarColumn } from './CalendarColumn';
import { useDisclosure, useToast } from '@chakra-ui/react';
import CalendarEventInput from './CalendarEventInput';
import { GoToTarget, UserDateContext } from '../../providers/UserDate';
import { CalendarScale, CalendarScaleHeader, CalendarScaleItem, CalendarScaleTime, CalendarWrapper } from '../Library';
import { useSwipe } from '../../hooks/useSwipe';
import { filterContext } from '../../providers/filter';

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
  hoursInterval,
  ressources,
  daysRange = [currentDayjs, currentDayjs],
  readOnly = false,
  columnHeaderFormat = 'dddd DD.MM.',
  columnSubHeaderContent = 'ressource',
}: CalendarInputProps): JSX.Element {
  const toast = useToast();
  const daysRangeRef = useRef<[Dayjs, Dayjs]>(daysRange);
  const prevDaysRangeRef = useRef<[Dayjs, Dayjs]>(daysRange);
  const { goTo } = useContext(UserDateContext);
  const { calendarView } = useContext(filterContext);
  const { setTouchStart, setTouchEnd, direction } = useSwipe();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ clickedId, setClickedId ] = useState<string | undefined>(undefined);
  const [ clickedDateTime, setClickedDateTime ] = useState(dayjs());
  const [ numOfDays ] = useState(
    dayjs(daysRange[1]).diff(daysRange[0], 'day') + 1
  );
  const [currentHoursInterval, setCurrentHoursInterval] =
    useState(hoursInterval);
  const [numOfHours] = useState(
    currentHoursInterval === undefined
      ? 0
      : currentHoursInterval[1] - currentHoursInterval[0] + 1
  );
  const scaleWidth = '1rem';
  const isToday = dayjs().isBetween(daysRange[0], daysRange[1], 'date', '[]');
  const handleCloseInput = () => {
    setClickedId(undefined);
    onClose();
  };
  useEffect(() => {
    if (direction) {
      if (!clickedId) {
        const target = `${direction === 'left' ? 'next' : 'previous'}${calendarView[0].toUpperCase() + calendarView.substring(1)}`;
        goTo(target as GoToTarget);
      }
    }
  }, [direction, clickedId]);

  useEffect(() => {
    if (daysRange[0].isSame(daysRangeRef.current[0])) {
      return;
    } else {
      prevDaysRangeRef.current = daysRangeRef.current;
      daysRangeRef.current = daysRange;
    }
    // TODO: use Refs to determine if we skipped for- or backwards and give a visual hint to the user
    // if (daysRange[0].isBefore(prevDaysRangeRef.current[0])) toast({title: 'yeah', description: 'hey we skipped BACKWARDs'});
    // if (daysRange[0].isAfter(prevDaysRangeRef.current[0])) toast({title: 'yeah', description: 'hey we skipped FORWARD'});
  }, [daysRange]);
  // calculate boundaries to fit all events
  events.forEach((event) => {
    // FIXME: this resets only the scale but not the CalendarColumns
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
  for (let i = 0; i < numOfDays; i++) {
    const daysEvents = events.filter((event) => !event.isCancelled &&
      dayjs(event.startTime).isSame(dayjs(curCalendarDay), 'date')
      ? event
      : undefined
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
        openModal={onOpen}
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
      onTouchStart={e => setTouchStart(e)}
      onTouchEnd={e => setTouchEnd(e)}
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
      {clickedId && (
        <CalendarEventInput
          uuid={clickedId}
          ressource={ressources.filter((r) => r.uuid === clickedId)[0]}
          dateTime={clickedDateTime}
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={handleCloseInput}
        />
      )}
    </CalendarWrapper>
  );
}
const mapStateToProps = (state: AppState) => {
  return {
    hoursInterval: state.settings.hoursInterval,
  };
};

export default connect(mapStateToProps, null)(CalendarContainer);
