import React from 'react';
import { connect } from 'react-redux';
import Timetable from 'react-timetable-events';
import classes from './TimetableContainer.module.css';
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

const TimetableContainer = ({events, currentDate, hoursInterval, dispatch, visible, rowId}) => {

  function getPosition (e) {
    e.preventDefault();
    const clickOnFreeTime = !e.target.className.indexOf('styles_day__');

    if (clickOnFreeTime) {
      dispatch(clickRow(e.target.className.split(' ')[1]));
      const rect = e.target.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const numberOfHours = hoursInterval[1]-hoursInterval[0]+1;
      const cellHeight = (rect.bottom-rect.top)/numberOfHours;
      const startOfDay = currentDate.clone().set('hour', hoursInterval[0]).set('minutes', 0).set('seconds', 0);
      const clickTimeMin = ((y-cellHeight)/(cellHeight/60));
      const clickTime = startOfDay.clone().add(clickTimeMin,'m');
      const fullQuarterHour = Math.round(clickTime.get('minute')/15)*15;
      const clickTimeFQH = clickTime.set('minutes', 0).add(fullQuarterHour, 'm').set('seconds',0);

      dispatch(setStart(clickTimeFQH));
      dispatch(setEnd(clickTimeFQH.add(45,'m')));
      dispatch(toggleVisible());
    }
  }


  return (
    <div className={classes.TimetableContainer} onClick={getPosition}>
      <Timetable
        timeLabel={dayjs(currentDate).format('ddd DD.MM.')}
        hoursInterval={hoursInterval}
        events={events}
        renderEvent={renderCustomEvent}
        styles={classes}
      />
      <TimetableInputForm visible={visible}/>
    </div>
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

const MapStateToProps = state => {
  return {
    events: filteredEvents(state.events, state.currentDate),
    currentDate: state.currentDate,
    hoursInterval: state.hoursInterval,
    visible: state.newAppointment.inputFormVisible,
    rowId: state.newAppointment.clickedRowId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleVisible: toggleVisible,
    clickRow: clickRow,
    setStart: setStart,
    setEnd: setEnd,
    dispatch
  };
};


export default connect(MapStateToProps, mapDispatchToProps)(TimetableContainer);