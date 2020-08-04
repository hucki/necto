import React, { useEffect, useState } from 'react';
import Measure from 'react-measure';
import { connect } from 'react-redux';
import classes from './UserCalendarContainer.module.css';
import { toggleVisible, clickRow, setStart, setEnd, setDimensions } from '../../../actions/actions';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import TimetableInputForm from '../TimetableInputForm/TimetableInputForm';
import TeamTableItem from '../TeamTableItem/TeamTableItem';
dayjs.extend(isBetween);

const renderCustomEvent = (event,
                          styles) => {
  return (
    <TeamTableItem
      key={event.id}
      event={event}
      styles={styles}/>
  );
};

const UserCalendarContainer = ({events, currentDate, hoursInterval, dispatch, visible, width, height, top, rowId}) => {
  const [numOfHours, setNumOfHours] = useState(hoursInterval[1]-hoursInterval[0]+1)
  const [daysToShow, setDaysToShow] = useState(['Mon','Tue','Wed','Thu','Fri']) // TODO move to state-ettings
  const [numOfCols, setNumOfCols] = useState(daysToShow.length);
  const [timeScaleWidth, setTimeScaleWidth] = useState(50); // TODO move to state-settings
  const [cellHeight, setCellHeight] = useState(height/numOfHours);
  const [relCellHeight, setRelCellHeight] = useState(100/numOfHours);
  const [cellWidth, setCellWidth] = useState((width-timeScaleWidth)/numOfCols);
  const [cellStyle, setCellStyle] = useState({height: `${cellHeight}px`, width: `${cellWidth}px`})
  const [startOfDay, setStartOfDay] = useState(currentDate.clone().set('hour', hoursInterval[0]).set('minutes', 0).set('seconds', 0))


  useEffect(() => {
    calcDimensions()
  },[cellHeight, cellWidth])

  function calcDimensions() {
    setCellHeight(height/numOfHours);
    setCellWidth((width-timeScaleWidth)/numOfCols);
    setCellStyle({
      height: `${relCellHeight}%`,
      width: `${cellWidth}px`});
  }

  function getPosition (e) {
    e.preventDefault();

    if((typeof e.target.className) !== 'string') return;
    const clickOnFreeTime = !e.target.className.indexOf('UserCalendarContainer_day__');

    if (clickOnFreeTime) {
      dispatch(clickRow(e.target.className.split(' ')[1]));
      const y = e.clientY - top;
      const clickTimeMin = ((y-cellHeight)/(cellHeight/60));
      const clickTime = startOfDay.clone().add(clickTimeMin,'m').set('seconds',0);
      const fullQuarterHour = Math.round(clickTime.get('minute')/15)*15;
      const clickTimeFQH = clickTime.set('minutes', 0).add(fullQuarterHour, 'm');

      dispatch(setStart(clickTimeFQH));
      dispatch(setEnd(clickTimeFQH.add(45,'m')));
      dispatch(toggleVisible());
    }
  }
  function getItemStyle(event) {
    const minsFromStartOfDay =  dayjs(event.startTime).diff(dayjs(event.startTime).startOf('day').add(hoursInterval[0],'h'), 'minute');
    const minsDuration = dayjs(event.endTime).diff(event.startTime, 'minute');
    const pxPerMinute = cellHeight / 60;
    const pxFromStartOfDay = (pxPerMinute * minsFromStartOfDay) + cellHeight;
    const pxItemHeight = pxPerMinute * minsDuration;
    const itemStyle = {
      top: `${pxFromStartOfDay}px`,
      height: `${pxItemHeight}px`
    }
      ;
    return itemStyle;
  }
  const hoursScale = Array(hoursInterval[1]-hoursInterval[0]).fill(null).map((hour, index) =>
    <div  key={index+hoursInterval[0]}
          className={classes.hour}
          style={{
            height: `${relCellHeight}%`,
            width: `${timeScaleWidth}px`}}> {index+hoursInterval[0]}:00</div>);

  const days = daysToShow.map(day =>
    <div  key={day}
          className={`${classes.day} ${day}`}
          style={{
            height: `100%`,
            width: `${cellWidth}px`,
          }}>
        <div className={classes.dayHeader} style={{
      height: `${relCellHeight}%`,
      width: `${cellWidth}px`}}>{day}</div>
        {events[day].map(event => renderCustomEvent(event, getItemStyle(event)))}
    </div>);

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
      setCellHeight(height/numOfHours);
      setCellWidth(width/numOfCols);
    }}>
      {({ measureRef }) => (
          <div className={classes.UserCalendarContainer} onClick={getPosition} ref={measureRef} style={{
            backgroundSize: '1px ' + `${2 * relCellHeight}%`
            }}>
            <div className={classes.hoursScale}>
              <div className={classes.hoursScaleHeader} style={{
                height: `${100/numOfHours}%`,
                width: `${timeScaleWidth}px`}}> Time</div>
              {hoursScale}
            </div>
            {console.log(width, height, top)}
            {days}
          </div>
        )}
    </Measure>
    <TimetableInputForm visible={visible}/>
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
    currentDate: state.current.currentDate,
    hoursInterval: state.settings.hoursInterval,
    visible: state.newAppointment.inputFormVisible,
    rowId: state.newAppointment.clickedRowId,
    user: state.userData.currentUser,
    width: state.teamtable.viewportDimensions.width,
    height: state.teamtable.viewportDimensions.height,
    top: state.teamtable.viewportDimensions.top,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleVisible,
    clickRow,
    setStart,
    setEnd,
    setDimensions,
    dispatch
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(UserCalendarContainer);