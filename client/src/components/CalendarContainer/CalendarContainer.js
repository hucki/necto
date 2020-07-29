import React from 'react';
import classes from './CalendarContainer.module.css';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import CalendarDay from '../CalendarDay/CalendarDay';
dayjs.extend(weekday)

function onChange(date, dateString) {
  console.log(date, dateString);
}

const teamMembers = [
  { id: 1, firstName: 'Mitchell', lastName: 'Bidmead', color: 'black'},
  { id: 2, firstName: 'Gigi', lastName: 'Blitzer', color: 'green'},
  { id: 3, firstName: 'Trisha', lastName: 'Bernollet', color: 'red'},
  { id: 4, firstName: 'Charlie', lastName: 'Horsburgh', color: 'yellow'},
  { id: 5, firstName: 'Forbes', lastName: 'Elgy', color: 'blue'},
  { id: 6, firstName: 'Alfie', lastName: 'Dainton', color: 'olive'},
  { id: 7, firstName: 'Andriette', lastName: 'Delagua', color: 'purple'},
  { id: 8, firstName: 'Jojo', lastName: 'Heigl', color: 'orange'},
  { id: 9, firstName: 'Pearce', lastName: 'Ungerecht', color: 'pink'},
  { id: 10, firstName: 'Alanah', lastName: 'Bentje', color: 'green'}
]
const groups = [
  { id: 1, title: 'group 1' },
  { id: 2, title: 'group 2' }
]
const items = [
  { id: 1, group: 1, title: 'item 1', start_time: dayjs(), end_time: dayjs().add(1, 'hour')},
  { id: 2, group: 2, title: 'item 2', start_time: dayjs().add(-0.5, 'hour'), end_time: dayjs().add(0.5, 'hour')},
  { id: 3, group: 1, title: 'item 3', start_time: dayjs().add(2, 'hour'), end_time: dayjs().add(3, 'hour')}
]
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
    <DatePicker onChange={onChange} picker="week" />
    <div className={classes.Week}>
      <div className={classes.Weekdays}>
        {weekdays}
      </div>
    </div>
    </>
  );
}
export default CalendarContainer;