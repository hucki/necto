import React from 'react';
import Timetable from 'react-timetable-events';
import classes from './TimetableContainer.module.css'
import {events} from '../../assets/data'

const TimetableContainer = () => {
  return (
    <div className={classes.TimetableContainer}>
      <Timetable events={events}/>
    </div>
  )
}

export default TimetableContainer