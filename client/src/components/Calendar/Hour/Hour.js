import React from 'react';
import classes from './Hour.module.css';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
dayjs.extend(weekday)

const currentWeek = {}

const view = 'hour' || 'scale';

const Hour = () => {
  return (
    <>
      <div className={classes.Hour}></div>
    </>
  );
}
export default Hour;