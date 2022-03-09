/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { Event } from '../../types/Event';
import { AppState } from '../../types/AppState';
import { EmployeeRessource, Room } from '../../types/Ressource';
import { connect } from 'react-redux';
import { CalendarColumn } from './CalendarColumn';
import * as colors from '../../styles/colors';
import { useDisclosure } from '@chakra-ui/react';
import CalendarEventInput from './CalendarEventInput';
import { useCurrentTime } from '../../hooks/time';

interface CalendarInputProps {
  events: Event[];
  ressources: Array<EmployeeRessource | Room>;
  hoursInterval?: [number, number];
  currentDate?: Dayjs;
  daysRange: [Dayjs, Dayjs];
  readOnly?: boolean;
  columnHeaderFormat?: CalendarColumnHeaderFormat;
}
const currentDayjs = dayjs();

function CalendarContainer({
  events,
  hoursInterval,
  ressources,
  currentDate,
  daysRange = [currentDayjs, currentDayjs],
  readOnly = false,
  columnHeaderFormat = 'dddd DD.MM.',
}: CalendarInputProps): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [clickedId, setClickedId] = useState<string | undefined>(undefined);
  const [clickedDateTime, setClickedDateTime] = useState(dayjs());
  const [numOfDays] = useState(
    dayjs(daysRange[1]).diff(daysRange[0], 'day') + 1
  );
  const [currentHoursInterval, setCurrentHoursInterval] =
    useState(hoursInterval);
  const [numOfHours] = useState(
    currentHoursInterval === undefined
      ? 0
      : currentHoursInterval[1] - currentHoursInterval[0] + 1
  );
  const scaleWidth = '3rem';

  const {date, time} = useCurrentTime();
  const isToday = date.isBetween(daysRange[0], daysRange[1], 'date', '[]');

  // calculate boundaries to fit all events
  events.forEach((event) => {
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
      <div
        id={`CalendarScale_${i}`}
        key={`CalendarScale_${i}`}
        css={{
          height: `calc(100% / ${numOfHours + 1})`,
          fontStyle: 'italic',
          fontSize: 'small',
          backgroundColor: `${colors.background}`,
          borderTop: `1px solid ${colors.border}`,
        }}
      >
        {i}:00
      </div>
    );
  }
  const calendarDays = [];
  let curCalendarDay = daysRange[0];
  for (let i = 0; i < numOfDays; i++) {
    const daysEvents = events.filter((event) =>
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
      />
    );
    curCalendarDay = curCalendarDay.add(1, 'day');
  }
  return (
    <div
      id="containerDiv"
      key="containerDiv"
      css={{
        position: 'relative',
        fontSize: '1rem',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        textAlign: 'right',
        backgroundColor: '#fff',
        backgroundImage: 'linear-gradient(#f0f2f5 50%, transparent 50%)',
        backgroundSize: `1px calc(100% / ${numOfHours + 1} * 2)`,
      }}
    >
      {isToday && <div
        className="now"
        css={{
          position: 'absolute',
          top: '100px',
          left: scaleWidth,
          width: `calc(100% - ${scaleWidth})`,
          borderBottom: '1px solid red',
          fontSize: '0.8rem',
          color: 'red'
        }}
      >
        {time}
      </div>}
      <div
        id="CalendarScale"
        key="CalendarScale"
        css={{
          width: scaleWidth,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div
          id="CalendarScaleHeader"
          key="CalendarScaleHeader"
          css={{ height: `calc(100% / ${numOfHours + 1})` }}
        ></div>
        {calendarScale}
      </div>
      {calendarDays}
      {clickedId && (
        <CalendarEventInput
          uuid={clickedId}
          ressource={ressources.filter((r) => r.uuid === clickedId)[0]}
          dateTime={clickedDateTime}
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
        />
      )}
    </div>
  );
}
const mapStateToProps = (state: AppState) => {
  return {
    currentDate: state.current.currentDate,
    hoursInterval: state.settings.hoursInterval,
  };
};

export default connect(mapStateToProps, null)(CalendarContainer);
