import React, { useEffect, useState } from 'react';
import Measure from 'react-measure';
import { connect } from 'react-redux';
import classes from './TeamtableContainer.module.css';
import { toggleVisible, clickRow, setStart, setEnd } from '../../../actions/actions';
import dayjs from 'dayjs';
import TimetableInputForm from '../TimetableInputForm/TimetableInputForm';
import TeamTableItem from '../TeamTableItem/TeamTableItem';


const renderCustomEvent = (event,
                          styles) => {
  return (
    <TeamTableItem
      key={event.id}
      event={event}
      styles={styles}/>
  );
};

const TeamtableContainer = ({events, currentDate, hoursInterval, dispatch, visible, rowId, startOfDay}) => {
  const [dimensions, setDimensions] = useState({dimensions: {
    width: -1,
    height: -1,
  }});
  const { width, height, top } = dimensions.dimensions
  const [numOfHours, setNumOfHours] = useState(hoursInterval[1]-hoursInterval[0]+1)
  const [numOfCols, setNumOfCols] = useState(Object.keys(events).length);
  const [timeScaleWidth, setTimeScaleWidth] = useState(50);
  const [cellHeight, setCellHeight] = useState(height/numOfHours);
  const [cellWidth, setCellWidth] = useState((width-timeScaleWidth)/numOfCols);
  const [cellStyle, setCellStyle] = useState({height: `${cellHeight}px`, width: `${cellWidth}px`})

  useEffect(() => {
    calcDimensions()
  },[cellHeight, cellWidth])

  function calcDimensions() {
    setCellHeight(height/numOfHours);
    setCellWidth((width-timeScaleWidth)/numOfCols);
    setCellStyle({height: `${cellHeight}px`, width: `${cellWidth}px`});
  }

  function getPosition (e) {
    e.preventDefault();

    if((typeof e.target.className) !== 'string') return;
    const clickOnFreeTime = !e.target.className.indexOf('TeamtableContainer_day__');

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
    const minsFromStartOfDay = dayjs(event.startTime).diff(startOfDay, 'minute');
    const minsDuration = dayjs(event.endTime).diff(event.startTime, 'minute');
    const pxPerMinute = cellHeight / 60;
    const pxFromStartOfDay = (pxPerMinute * minsFromStartOfDay) + cellHeight;
    const pxItemHeight = pxPerMinute * minsDuration;
    const itemStyle = {
      top: `${parseInt(pxFromStartOfDay)}px`,
      height: `${parseInt(pxItemHeight)}px`
    }
      ;
    return itemStyle;
  }
  const hoursScale = Array(hoursInterval[1]-hoursInterval[0]).fill(null).map((hour, index) =>
    <div  key={index+hoursInterval[0]}
          className={classes.hour}
          style={{height: cellHeight, width: `${timeScaleWidth}px`}}> {index+hoursInterval[0]}:00</div>);

  const days = Object.keys(events).map(personId =>
    <div  key={personId}
          className={`${classes.day} ${personId}`}
          style={{
            height: `100%`,
            width: `${cellWidth}px`,
            backgroundSize: '1px ' + 2 * cellHeight + 'px',
          }}>
        <div className={classes.dayHeader} style={{
      height: `${cellHeight}px`,
      width: `${cellWidth}px`}}>{personId}</div>
        {events[personId].map(event => renderCustomEvent(event, getItemStyle(event)))}
    </div>);

  return (
    <>
    <Measure
      bounds
      onResize={contentRect => {
      setDimensions({ dimensions: contentRect.bounds });
      setCellHeight(height/numOfHours);
      setCellWidth(width/numOfCols);
    }}>
      {({ measureRef }) => (
          <div className={classes.TeamtableContainer} onClick={getPosition} ref={measureRef} style={{backgroundSize: '1px ' + 2 * cellHeight + 'px'}}>
            <div className={classes.hoursScale}>
              <div className={classes.hoursScaleHeader} style={{height: cellStyle.height, width: `${timeScaleWidth}px`}}> Time</div>
              {hoursScale}
            </div>
            {days}
          </div>
        )}
      {/* <div className={classes.TeamtableContainer} onClick={getPosition}>

        {hoursScale}
        </div>
        <div className='teamtimes'></div>
        <div></div>
        <Teamscale />
        <Teamtable
          timeLabel={dayjs(currentDate).format('ddd DD.MM.')}
          hoursInterval={hoursInterval}
          events={events}
          renderEvent={renderCustomEvent}
          styles={classes}
        />
        <TimetableInputForm visible={visible}/>
      </div> */}
    </Measure>
    <TimetableInputForm visible={visible}/>
    </>
  );
};

function filteredEvents (events, currentDate) {
  const filtered = {};
  Object.keys(events).map(stateKey => {
    filtered[stateKey] = [];
    events[stateKey].map(event => {
      if (dayjs(event.startTime).isSame(currentDate, 'day')) filtered[stateKey] = [...filtered[stateKey], event];
      return event;
    });
    return stateKey;
  });
  return filtered;
}

const mapStateToProps = state => {
  return {
    events: filteredEvents(state.appointments.events, state.current.currentDate),
    currentDate: state.current.currentDate,
    hoursInterval: state.settings.hoursInterval,
    visible: state.newAppointment.inputFormVisible,
    rowId: state.newAppointment.clickedRowId,
    startOfDay: state.current.currentDate.clone().set('hour', state.settings.hoursInterval[0]).set('minutes', 0).set('seconds', 0)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleVisible,
    clickRow,
    setStart,
    setEnd,
    dispatch
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(TeamtableContainer);