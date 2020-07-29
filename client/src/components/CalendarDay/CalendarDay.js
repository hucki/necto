import React from 'react';
import classes from './CalendarDay.module.css';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import CalendarHour from '../CalendarHour/CalendarHour';
dayjs.extend(weekday)

const hours = Array(10).fill(0).map((item, index) => <CalendarHour key={index}></CalendarHour>);

const CalendarDay = (props) => {

  return (
    <div className={classes.CalendarDay}>
      <div className={classes.CalendarDayHeader}>{props.day}</div>
      <div>members</div>
      {hours}
    </div>
  )

}

export default CalendarDay;