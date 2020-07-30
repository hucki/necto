import React from 'react'
import classes from '../Timetable.module.css'

const onClickHandler = (e) => {
  console.log('clicked event:', e)
}

const TimetableItem = ({event, defaultAttributes, styles}) => {
  return (
    <div {...defaultAttributes}
         title={event.name}
         key={event.id}
         onClick={() => onClickHandler(event.id)}
        className={classes.event}
        >
      <span className={classes.event_info}>{ event.name }</span>
      <span className={classes.event_info}>
        { event.startTime.format('HH:mm') } TADA { event.endTime.format('HH:mm') }
      </span>
    </div>
  )
}

export default TimetableItem