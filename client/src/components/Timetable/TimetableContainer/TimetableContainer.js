import React from 'react';
import Timetable from 'react-timetable-events';
import classes from './TimetableContainer.module.css'
import {events} from '../../../assets/data'
import TimetableItem from '../TimetableItem/TimetableItem';

const onClickHandler = (e) => {
  console.log('clicked event:', e.target)
}

const renderCustomEvent = (event, defaultAttributes, styles) => {
  return (
    <TimetableItem key={event.id} event={event} defaultAttributes={defaultAttributes} styles={styles}/>
  )
}

const TimetableContainer = () => {
  return (
    <div className={classes.TimetableContainer} onClick={onClickHandler}>
      <Timetable events={events} renderEvent={renderCustomEvent} />
    </div>
  )
}

export default TimetableContainer