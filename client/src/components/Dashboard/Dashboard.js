import React from 'react';
import classes from './Dashboard.module.css';
import CalendarContainer from '../CalendarContainer/CalendarContainer';

function Dashboard() {
  return (
    <div className={classes.Dashboard}>
      <CalendarContainer />
    </div>
  )
}

export default Dashboard;