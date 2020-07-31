import React, {useState, useCallback} from 'react';
import { connect } from 'react-redux';
import Timetable from 'react-timetable-events';
import classes from './TimetableContainer.module.css';
//import { events } from '../../../assets/data';
import TimetableItem from '../TimetableItem/TimetableItem';
import AddButton from '../../../elements/AddButton/AddButton';
import InputForm from '../../Appointments/InputForm/InputForm';

const renderCustomEvent = (event, defaultAttributes, styles) => {
  return (
    <TimetableItem key={event.id} event={event} defaultAttributes={defaultAttributes} styles={styles}/>
  )
}

const TimetableContainer = (state) => {
  console.log('here state', state.events)
  return (
    <div className={classes.TimetableContainer}>
      <Timetable
        hoursInterval={[ 6, 21 ]}
        events={state.events}
        renderEvent={renderCustomEvent} />
      <AddButton />
    </div>
  )
}

const MapStateToProps = state => {

  return {
    events: state.events
  }
}

export default connect(MapStateToProps, null)(TimetableContainer)