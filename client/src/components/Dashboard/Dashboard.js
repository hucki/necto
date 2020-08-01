import React from 'react';
import classes from './Dashboard.module.css';
import TimetableContainer from '../Timetable/TimetableContainer/TimetableContainer';


function Dashboard () {
  return (
    <div className={classes.Dashboard}>
      <TimetableContainer />
    </div>
  );
}

export default Dashboard;