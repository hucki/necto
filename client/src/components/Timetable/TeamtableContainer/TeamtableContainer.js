import React, { useEffect, useState } from 'react';
import useDimensions from 'react-use-dimensions';
import { useWeeksEvents } from '../../../hooks/events';
import { events2Appointments } from '../../../helpers/dataConverter';
import { connect } from 'react-redux';
import classes from './TeamtableContainer.module.css';
import {
  toggleVisible,
  clickRow,
  setStart,
  setEnd,
  setDimensions,
  setCellDimensions,
} from '../../../actions/actions';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import TimetableInputForm from '../TimetableInputForm/TimetableInputForm';
import TeamtableDay from '../TeamtableDay/TeamtableDay';
dayjs.extend(isoWeek);

const TeamtableContainer = ({
  // events,
  users,
  currentDate,
  hoursInterval,
  dispatch,
  visible,
  width,
  height,
  top,
  timeScaleWidth,
  rowId,
  startOfDay,
  cellHeight,
  cellWidth,
  relCellHeight,
}) => {
  const [numOfHours] = useState(hoursInterval[1] - hoursInterval[0] + 1);
  const numOfCols = users.length;
  const [ref, dimensions] = useDimensions();
  //eslint-disable-next-line no-unused-vars
  const [dimensionsCalculated, setDimensionsCalculated] = useState({
    width: -1,
    height: -1,
  });
  const { rawEventsIsLoading, rawEventsError, rawEvents } = useWeeksEvents(
    dayjs(currentDate).format('YYYY'),
    dayjs(currentDate).isoWeek()
  );

  useEffect(() => {
    const calcDimensions = () => {
      dispatch(
        setDimensions({
          width: Math.floor(dimensions.width),
          height: Math.floor(dimensions.height),
          top: Math.floor(dimensions.y),
        })
      );
      dispatch(
        setCellDimensions({
          cellHeight: height / numOfHours,
          cellWidth: (width - timeScaleWidth) / numOfCols,
          relCellHeight: 100 / numOfHours,
        })
      );
      setDimensionsCalculated({
        width: Math.floor(dimensions.width),
        height: Math.floor(dimensions.height),
      });
    };
    calcDimensions();
  }, [
    height,
    numOfHours,
    numOfCols,
    timeScaleWidth,
    width,
    dispatch,
    dimensions,
  ]);

  if (rawEventsIsLoading) return <div>Loading...</div>;
  if (rawEventsError)
    return <div>Error getting events: {rawEventsError.message}</div>;
  if (!rawEvents) return null;
  const events = events2Appointments(rawEvents, users);

  function getPosition(e) {
    e.preventDefault();
    if (typeof e.target.className !== 'string') return;
    const clickOnFreeTime = !e.target.className.indexOf('TeamtableDay_day__');
    if (clickOnFreeTime) {
      dispatch(clickRow(e.target.className.split(' ')[1]));
      const y = e.pageY - dimensions.y - cellHeight;
      const clickTimeMin = y / (cellHeight / 60);
      const clickTime = startOfDay
        .clone()
        .add(clickTimeMin, 'm')
        .set('seconds', 0);
      const fullQuarterHour = Math.round(clickTime.get('minute') / 15) * 15;
      const clickTimeFQH = clickTime
        .set('minutes', 0)
        .add(fullQuarterHour, 'm');
      dispatch(setStart(clickTimeFQH));
      dispatch(setEnd(clickTimeFQH.add(45, 'm')));
      dispatch(toggleVisible());
    }
  }

  const relCellHeightStyle = { height: `${relCellHeight}%` };

  const hoursScale = Array(hoursInterval[1] - hoursInterval[0])
    .fill(null)
    .map((hour, index) => (
      <div
        key={index + hoursInterval[0]}
        className={classes.hour}
        style={{
          ...relCellHeightStyle,
          width: `${timeScaleWidth}px`,
        }}
      >
        {' '}
        {index + hoursInterval[0]}:00
      </div>
    ));
  if (!users.length) return null;
  const headerArray = users.map((user) => user.firstName);
  return (
    <>
      <div
        className={classes.TeamtableContainer}
        onClick={getPosition}
        ref={ref}
        style={{
          backgroundSize: `1px ${2 * relCellHeight}%`,
        }}
      >
        <div className={classes.hoursScale}>
          <div
            className={classes.hoursScaleHeader}
            style={{
              height: `${100 / numOfHours}%`,
              width: `${timeScaleWidth}px`,
            }}
          >
            {' '}
          </div>
          {hoursScale}
        </div>
        <TeamtableDay events={events} headerArray={headerArray} />
      </div>

      <TimetableInputForm visible={visible} rowId={rowId} />
    </>
  );
};

function filteredEvents(events, currentDate) {
  const filtered = {};
  Object.keys(events).map((stateKey) => {
    filtered[stateKey] = [];
    events[stateKey].map((event) => {
      if (dayjs(event.startTime).isSame(currentDate, 'day'))
        filtered[stateKey] = [...filtered[stateKey], event];
      return event;
    });
    return stateKey;
  });
  return filtered;
}

const mapStateToProps = (state) => {
  return {
    events: filteredEvents(
      state.appointments.events,
      state.current.currentDate
    ),
    currentDate: state.current.currentDate,
    hoursInterval: state.settings.hoursInterval,
    visible: state.newAppointment.inputFormVisible,
    rowId: state.newAppointment.clickedRowId,
    startOfDay: state.current.currentDate
      .clone()
      .set('hour', state.settings.hoursInterval[0])
      .set('minutes', 0)
      .set('seconds', 0),
    width: state.teamtable.viewportDimensions.width,
    height: state.teamtable.viewportDimensions.height,
    top: state.teamtable.viewportDimensions.top,
    timeScaleWidth: state.teamtable.settings.timeScaleWidth,
    cellHeight: state.teamtable.calculatedDimensions.cellHeight,
    cellWidth: state.teamtable.calculatedDimensions.cellWidth,
    relCellHeight: state.teamtable.calculatedDimensions.relCellHeight,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleVisible,
    clickRow,
    setStart,
    setEnd,
    setDimensions,
    setCellDimensions,
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamtableContainer);
