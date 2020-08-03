import React from 'react';
import { connect } from 'react-redux';
import classes from './Dashboard.module.css';
import TimetableContainer from '../Timetable/TimetableContainer/TimetableContainer';
import TeamContainer from '../Team/TeamContainer/TeamContainer';


const Dashboard = ({currentView}) => {
  const showContent = currentView === 'Appointments' ? <TimetableContainer /> : <TeamContainer />

  return (
    <div className={classes.Dashboard}>
      {showContent}
    </div>
  )
}

const mapStateToProps = state => {
  return {
    currentView: state.settings.currentView
  }
}

export default connect(mapStateToProps, null)(Dashboard);