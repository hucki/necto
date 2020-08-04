import React, { useEffect, useState } from 'react';
import Measure from 'react-measure';
import { connect } from 'react-redux';
import classes from './UserCalendarContainer.module.css';
import { toggleVisible, clickRow, setStart, setEnd, setDimensions, setCellDimensions } from '../../../actions/actions';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import TimetableInputForm from '../TimetableInputForm/TimetableInputForm';
import TeamtableDay from '../TeamtableDay/TeamtableDay';
dayjs.extend(isBetween);

const UserCalendarContainer = ({events, currentDate, hoursInterval, daysToShow, dispatch, visible, width, height, top, timeScaleWidth, cellHeight, cellWidth, relCellHeight, user, rowId, allEvents}) => {
  const [numOfHours, setNumOfHours] = useState(hoursInterval[1]-hoursInterval[0]+1);
  const [numOfCols, setNumOfCols] = useState(daysToShow.length);
  const [dimensionsCalculated, setDimensionsCalculated] = useState({width: -1, height: -1})
  const [startOfDay, setStartOfDay] = useState(currentDate.clone().set('hour', hoursInterval[0]).set('minutes', 0).set('seconds', 0))
  console.log(allEvents)
  useEffect(() => {
    calcDimensions()
  },[dimensionsCalculated])

  function calcDimensions() {
    dispatch(setCellDimensions({
      cellHeight: height/numOfHours,
      cellWidth:(width-timeScaleWidth)/numOfCols,
      relCellHeight: 100/numOfHours
    }))
  }

  function getPosition (e) {
    e.preventDefault();
    if((typeof e.target.className) !== 'string') return;
    const clickOnFreeTime = !e.target.className.indexOf('TeamtableDay_day__');

    if (clickOnFreeTime) {
      const clickedDay = currentDate.clone().day(e.target.id).add(1,'d').set('hour', hoursInterval[0]).set('minutes', 0).set('seconds', 0)
      setStartOfDay(currentDate.clone().day(e.target.id).add(1,'d').set('hour', hoursInterval[0]).set('minutes', 0).set('seconds', 0))
      dispatch(clickRow(e.target.className.split(' ')[1]));
      const y = e.clientY - top;
      const clickTimeMin = ((y-cellHeight)/(cellHeight/60));
      const clickTime = clickedDay.clone().add(clickTimeMin,'m').set('seconds',0);
      const fullQuarterHour = Math.round(clickTime.get('minute')/15)*15;
      const clickTimeFQH = clickTime.set('minutes', 0).add(fullQuarterHour, 'm');

      dispatch(setStart(clickTimeFQH));
      dispatch(setEnd(clickTimeFQH.add(45,'m')));
      dispatch(toggleVisible());
    }
  }

  const relCellHeightStyle = {height: `${relCellHeight}%`}

  const hoursScale = Array(hoursInterval[1]-hoursInterval[0]).fill(null).map((hour, index) =>
    <div  key={index+hoursInterval[0]}
          className={classes.hour}
          style={{
            ...relCellHeightStyle,
            width: `${timeScaleWidth}px`}}> {index+hoursInterval[0]}:00</div>);

  return (
    <>
    <Measure
      bounds
      onResize={contentRect => {
        dispatch(setDimensions({
          width: Math.floor(contentRect.bounds.width),
          height: Math.floor(contentRect.bounds.height),
          top: Math.floor(contentRect.bounds.top)
        }));
        dispatch(setCellDimensions({
          cellHeight: height/numOfHours,
          cellWidth:(width-timeScaleWidth)/numOfCols,
          relCellHeight: 100/numOfHours
        }));
        setDimensionsCalculated({
          width: Math.floor(contentRect.bounds.width),
          height: Math.floor(contentRect.bounds.height)
        });
      }}>
      {({ measureRef }) => (
          <div className={classes.UserCalendarContainer} onClick={getPosition} ref={measureRef} style={{
            backgroundSize: '1px ' + `${2 * relCellHeight}%`
            }}>
            <div className={classes.hoursScale}>
              <div className={classes.hoursScaleHeader} style={{
                height: `${100/numOfHours}%`,
                width: `${timeScaleWidth}px`}}></div>
              {hoursScale}
            </div>
            <TeamtableDay events={events} headerArray={daysToShow}/>
          </div>
        )}
    </Measure>
    <TimetableInputForm visible={visible} rowId={user}/>
    </>
  );
};

function userEvents (events, currentDate, user) {
  const filtered = {
    Mon: [],
    Tue: [],
    Wed: [],
    Thu: [],
    Fri: [],
    Sat: [],
    Sun: []
  };
  events[user].map(event => {
    if(dayjs(event.startTime).isBetween(dayjs(currentDate).startOf('week'), dayjs(currentDate).endOf('week'))) filtered[dayjs(event.startTime).format('ddd')] = [...filtered[dayjs(event.startTime).format('ddd')], event];
  });
  return filtered;
}

const mapStateToProps = state => {
  return {
    events: userEvents(state.appointments.events, state.current.currentDate, state.userData.currentUser),
    allEvents: state.appointments.events,
    currentDate: state.current.currentDate,
    hoursInterval: state.settings.hoursInterval,
    visible: state.newAppointment.inputFormVisible,
    rowId: state.newAppointment.clickedRowId,
    user: state.userData.currentUser,
    width: state.teamtable.viewportDimensions.width,
    height: state.teamtable.viewportDimensions.height,
    top: state.teamtable.viewportDimensions.top,
    timeScaleWidth: state.teamtable.settings.timeScaleWidth,
    daysToShow: state.teamtable.settings.daysToShow,
    cellHeight: state.teamtable.calculatedDimensions.cellHeight,
    cellWidth: state.teamtable.calculatedDimensions.cellWidth,
    relCellHeight: state.teamtable.calculatedDimensions.relCellHeight,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleVisible,
    clickRow,
    setStart,
    setEnd,
    setDimensions,
    setCellDimensions,
    dispatch
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(UserCalendarContainer);