import React from 'react';
import { connect } from 'react-redux';
import classes from './Dashboard.module.css';
import UserCalendarContainer from '../Timetable/UserCalendarContainer/UserCalendarContainer';
import TeamContainer from '../Team/TeamContainer/TeamContainer';
import TeamtableContainer from '../Timetable/TeamtableContainer/TeamtableContainer';


const Dashboard = ({currentView}) => {


  const showContent = () => {
    switch(currentView) {
      case 'Appointments':
        return <TeamtableContainer />;
      case 'Personal':
        return <UserCalendarContainer />;
      case 'Team':
        return <TeamContainer />;
      case 'Settings':
        return <TeamtableContainer />;
      default:
        return <TeamtableContainer />;
    }
  }

  return (
    <div className={classes.Dashboard}>
      {showContent()}
    </div>
  )
}

const mapStateToProps = state => {
  return {
    currentView: state.settings.currentView
  }
}

export default connect(mapStateToProps, null)(Dashboard);