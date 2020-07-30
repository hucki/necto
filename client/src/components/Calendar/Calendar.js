import React from 'react';
import classes from './Calendar.module.css';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import {teamMembers, groups, items} from '../../assets/data'
import Day from './Day/Day';
dayjs.extend(weekday)

const currentWeek = {}

const view = <Day day={dayjs().day(4).format('ddd, DD.MM.YYYY')}/>; //|| <Week />;

const Calendar = (props) => {
  return (
    <div className={classes.Calendar}>
      {view}
    </div>
  );
}
export default Calendar;