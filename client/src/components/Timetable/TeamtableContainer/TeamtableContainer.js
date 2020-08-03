import React, { useEffect, useState } from 'react';
import Measure from 'react-measure';
import { connect } from 'react-redux';
import Timetable from 'react-timetable-events';
import classes from './TeamtableContainer.module.css';
import TimetableItem from '../TimetableItem/TimetableItem';
import { toggleVisible, clickRow, setStart, setEnd } from '../../../actions/actions';
import dayjs from 'dayjs';
import TimetableInputForm from '../TimetableInputForm/TimetableInputForm';


const renderCustomEvent = (event, defaultAttributes, styles) => {
  return (
    <TimetableItem
      key={event.id}
      event={event}
      defaultAttributes={defaultAttributes}
      styles={styles}/>
  );
};

const TeamtableContainer = ({events, currentDate, hoursInterval, dispatch, visible, rowId}) => {
  const [dimensions, setDimensions] = useState({dimensions: {
    width: -1,
    height: -1,
  }});
  const { width, height } = dimensions.dimensions
  const [numOfHours, setNumOfHours] = useState(hoursInterval[1]-hoursInterval[0]+1)
  const [numOfRows, setNumOfRows] = useState(Object.keys(events).length + 1);
  const [cellHeight, setCellHeight] = useState(height/numOfHours);
  const [cellWidth, setCellWidth] = useState(width/numOfRows);
  const [cellStyle, setCellStyle] = useState({height: `${cellHeight}px`, width: `${cellWidth}px`})
  const [startOfDay, setStartOfDay] = useState(currentDate.clone().set('hour', hoursInterval[0]).set('minutes', 0).set('seconds', 0))


  useEffect(() => {
    calcDimensions()
  },[cellHeight, cellWidth])

  function calcDimensions() {
    setCellHeight(height/numOfHours);
    setCellWidth(width/numOfRows);
    setCellStyle({height: `${cellHeight}px`, width: `${cellWidth}px`});
    console.log(dimensions)
  }

  function getPosition (e) {

  //   e.preventDefault();
  //   if((typeof e.target.className) !== 'string') return;
  //   const clickOnFreeTime = !e.target.className.indexOf('styles_day__');
  //   if (clickOnFreeTime) {
  //     dispatch(clickRow(e.target.className.split(' ')[1]));
  //     const rect = e.target.getBoundingClientRect();
  //     const y = e.clientY - rect.top;
  //     const numOfHours = hoursInterval[1]-hoursInterval[0]+1;
  //     const cellHeight = (rect.bottom-rect.top)/numOfHours;
  //     const startOfDay = currentDate.clone().set('hour', hoursInterval[0]).set('minutes', 0).set('seconds', 0);
  //     const clickTimeMin = ((y-cellHeight)/(cellHeight/60));
  //     const clickTime = startOfDay.clone().add(clickTimeMin,'m');
  //     const fullQuarterHour = Math.round(clickTime.get('minute')/15)*15;
  //     const clickTimeFQH = clickTime.set('minutes', 0).add(fullQuarterHour, 'm').set('seconds',0);

  //     dispatch(setStart(clickTimeFQH));
  //     dispatch(setEnd(clickTimeFQH.add(45,'m')));
  //     dispatch(toggleVisible());
  //   }
  }
  const hoursScale = Array(hoursInterval[1]-hoursInterval[0]).fill(null).map((hour, index) =>
    <div  key={index+hoursInterval[0]}
          style={cellStyle}> {index+hoursInterval[0]}:00</div>);

  const days = Object.keys(events).map(personId =>
    <div key={personId} className={classes.day} style={{
      height: `100%`,
      width: `${cellWidth}px`,
      backgroundSize: '1px ' + 2 * cellHeight + 'px',
      }}>
        <div className={classes.dayHeader}>{personId}</div>
        {events[personId].map(event => renderCustomEvent(event))}
    </div>);

  return (
    <Measure
      bounds
      onResize={contentRect => {
      setDimensions({ dimensions: contentRect.bounds });
      setCellHeight(height/numOfHours);
      setCellWidth(width/numOfRows);
    }}>
      {({ measureRef }) => (
          <div className={classes.TeamtableContainer} onClick={getPosition} ref={measureRef}>
            <div className='teamscale'>
              <div className={classes.hoursScaleHeader} style={cellStyle}> Time</div>
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
    rowId: state.newAppointment.clickedRowId
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