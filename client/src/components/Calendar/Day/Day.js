import React from 'react';
import classes from './Day.module.css';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import {teamMembers, groups, items} from '../../../assets/data'
import Hour from '../Hour/Hour';
dayjs.extend(weekday)

const currentWeek = {}

const hourRange = Array(24).fill(0).map((item, i) => <Hour key={i} />);

const Day = (props) => {
  return (
    <div className={classes.Day}>
      <div className={classes.DayHeader}>{props.day}</div>
      <div className={classes.Hours}>
        {hourRange}
      </div>
    </div>
  );
}
export default Day;