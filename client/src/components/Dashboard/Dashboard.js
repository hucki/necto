import React from 'react';
import classes from './Dashboard.module.css';
import TimetableContainer from '../Timetable/TimetableContainer/TimetableContainer';
import TeamContainer from '../Team/TeamContainer/TeamContainer';


function Dashboard () {
  return (
    <div className={classes.Dashboard}>
      <TimetableContainer />
      <TeamContainer />
    </div>
  );
}

export default Dashboard;