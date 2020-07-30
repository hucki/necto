import React from 'react';
import classes from './CalendarContainer.module.css';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import CalendarDay from '../CalendarDay/CalendarDay';
import {teamMembers, groups, items} from '../../assets/data'
dayjs.extend(weekday)

const currentWeek = {}
const members = teamMembers.map((member, index) =>
  <div key={index} className={classes.Member}>
    <div className={classes.MemberHeader}>{member.firstName}</div>
  </div>
);
{/* <div className={classes.WeekdayHeader}>{dayjs().day(index+1).format('ddd, DD.MM')}</div>
<div className={classes.MemberContainer}>{members}</div> */}

const weekdays = Array(5).fill(0).map((item, index) =>
  <CalendarDay key={index} className={classes.Weekday} day={dayjs().day(index+1).format('ddd, DD.MM')}/>
);



const CalendarContainer = () => {
  return (
    <>
    <div className={classes.Week}>
      <div className={classes.Weekdays}>
        {weekdays}
      </div>
    </div>
    </>
  );
}
export default CalendarContainer;