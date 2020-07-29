import React from 'react';
import classes from './CalendarHour.module.css';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
dayjs.extend(weekday)

const CalendarHour = () => {

  return (
    <div className={classes.CalendarHour}></div>
  )

}

export default CalendarHour;