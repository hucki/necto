import React, {useState, useCallback} from 'react';
import { connect } from 'react-redux';
import Timetable from 'react-timetable-events';
import classes from './TimetableContainer.module.css';
import TimetableItem from '../TimetableItem/TimetableItem';
import AddButton from '../../../elements/AddButton/AddButton';
import InputForm from '../../Appointments/InputForm/InputForm';
import dayjs from 'dayjs';

const renderCustomEvent = (event, defaultAttributes, styles) => {
  return (
    <TimetableItem
      key={event.id}
      event={event}
      defaultAttributes={defaultAttributes}
      styles={styles}/>
  )
}

function getPosition(e) {
  e.preventDefault();
  const rect = e.target.getBoundingClientRect();
  const x = e.clientX - rect.left; //x position within the element.
  const y = e.clientY - rect.top;  //y position within the element.

  console.log('clicked a x/y (rel to container)',  Math.floor(x),Math.floor(y))
  // row ?
  // // time ?
  // var startOfDay = event.startTime.clone().set('hour', this.props.hoursInterval[0]).set('minutes', 0);

  // var minutesFromStartOfDay = round_1(event.startTime.diff(startOfDay) / 1000 / 60);
  // var minutes = round_1(event.endTime.diff(event.startTime) / 1000 / 60);
  // return {
  //   height: minutes * this.state.rowHeight / 60 + 'vh',
  //   marginTop: minutesFromStartOfDay * this.state.rowHeight / 60 + 'vh'
  // };
}

const TimetableContainer = ({events, currentDate}) => {
  return (
    <div className={classes.TimetableContainer} onClick={getPosition}>
      <Timetable
        timeLabel={dayjs(currentDate).format('DD.MM.YYYY')}
        hoursInterval={[ 6, 21 ]}
        events={events}
        renderEvent={renderCustomEvent}
        styles={classes}
        />
      <AddButton />
    </div>
  )
}

function filteredEvents(events, currentDate) {
  const filtered = {};
  Object.keys(events).map(stateKey => {
    filtered[stateKey] = [];
    events[stateKey].map(event => {
      if (dayjs(event.startTime).isSame(currentDate, 'day')) filtered[stateKey] = [...filtered[stateKey], event];
    })
  })
  return filtered;
}

const MapStateToProps = state => {
  return {
    events: filteredEvents(state.events, state.currentDate),
    currentDate: state.currentDate
  }
}

export default connect(MapStateToProps, null)(TimetableContainer)