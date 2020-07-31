import React, {useState, useCallback} from 'react';
import { connect } from 'react-redux';
import Timetable from 'react-timetable-events';
import classes from './TimetableContainer.module.css';
//import { events } from '../../../assets/data';
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

const TimetableContainer = ({events, currentDate}) => {
  console.log('here newDay', currentDate)
  return (
    <div className={classes.TimetableContainer}>
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
  console.log('filtered Events:', filtered)
  return filtered;
}

const MapStateToProps = state => {
  return {
    events: filteredEvents(state.events, state.currentDate),
    currentDate: state.currentDate
  }
}

export default connect(MapStateToProps, null)(TimetableContainer)