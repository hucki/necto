import React from 'react';
import classes from './Calendar.module.css';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import {DragDropContext} from 'react-beautiful-dnd';
import {teamMembers, groups, items} from '../../assets/data'
import Day from './Day/Day';
dayjs.extend(weekday)

const currentWeek = {}
const currentDay = dayjs().day(4)
const view = <Day day={currentDay.format('ddd, DD.MM.YYYY')} columnId={currentDay.format('YYYYMMDD')}/>; //|| <Week />;

const Calendar = (props) => {
  const onDragEnd = result => {
    // TODO setState
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={classes.Calendar}>
        {view}
      </div>
    </DragDropContext>
  );
}
export default Calendar;