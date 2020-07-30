import React from 'react';
import classes from './Dashboard.module.css';
import Calendar from '../Calendar/Calendar';


function Dashboard() {
  return (
    <div className={classes.Dashboard}>
      <Calendar />
    </div>
  )
}

export default Dashboard;