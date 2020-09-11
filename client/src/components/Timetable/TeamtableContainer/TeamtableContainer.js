import React, { useEffect, useState } from 'react';
import Measure from 'react-measure';
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
import TimetableInputForm from '../TimetableInputForm/TimetableInputForm';
import TeamtableDay from '../TeamtableDay/TeamtableDay';

const TeamtableContainer = ({
  events,
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
  const [numOfCols] = useState(Object.keys(events).length);
  //eslint-disable-next-line no-unused-vars
  const [dimensionsCalculated, setDimensionsCalculated] = useState({
    width: -1,
    height: -1,
  });

  useEffect(() => {
    const calcDimensions = () => {
      dispatch(
        setCellDimensions({
          cellHeight: height / numOfHours,
          cellWidth: (width - timeScaleWidth) / numOfCols,
          relCellHeight: 100 / numOfHours,
        })
      );
    };
    calcDimensions();
  }, [height, numOfHours, numOfCols, timeScaleWidth, width, dispatch]);

  function getPosition(e) {
    e.preventDefault();
    if (typeof e.target.className !== 'string') return;
    const clickOnFreeTime = !e.target.className.indexOf('TeamtableDay_day__');
    cellHeight = height / numOfHours;
    if (clickOnFreeTime) {
      dispatch(clickRow(e.target.className.split(' ')[1]));
      const y = e.clientY - top;
      const clickTimeMin = (y - cellHeight) / (cellHeight / 60);
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

  return (
    <>
      <Measure
        bounds
        onResize={(contentRect) => {
          dispatch(
            setDimensions({
              width: Math.floor(contentRect.bounds.width),
              height: Math.floor(contentRect.bounds.height),
              top: Math.floor(contentRect.bounds.top),
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
            width: Math.floor(contentRect.bounds.width),
            height: Math.floor(contentRect.bounds.height),
          });
        }}
      >
        {({ measureRef }) => (
          <div
            className={classes.TeamtableContainer}
            onClick={getPosition}
            ref={measureRef}
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
            <TeamtableDay events={events} headerArray={Object.keys(events)} />
          </div>
        )}
      </Measure>
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
