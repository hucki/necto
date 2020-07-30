import React from 'react';
import classes from './Dashboard.module.css';
import Calendar from '../Calendar/Calendar';
import TimetableContainer from '../TimetableContainer/TimetableContainer';


function Dashboard() {
  return (
    <div className={classes.Dashboard}>
      <TimetableContainer />
    </div>
  )
}

export default Dashboard;