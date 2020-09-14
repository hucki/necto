import React from 'react';
import { connect } from 'react-redux';
import classes from './Dashboard.module.css';
import UserCalendarContainer from '../Timetable/UserCalendarContainer/UserCalendarContainer';
import TeamContainer from '../Team/TeamContainer/TeamContainer';
import TeamtableContainer from '../Timetable/TeamtableContainer/TeamtableContainer';
import { useAllUsers } from '../../hooks/user';

const Dashboard = ({ currentView }) => {
  const { usersIsLoading, usersError, users } = useAllUsers();
  if (usersIsLoading) return <div>Loading...</div>;
  if (usersError) return <div>Error getting users: {usersError.message}</div>;
  if (!users) return null;

  const showContent = () => {
    switch (currentView) {
      case 'Appointments':
        return <TeamtableContainer users={users} />;
      case 'Personal':
        return <UserCalendarContainer />;
      case 'Team':
        return <TeamContainer />;
      case 'Settings':
        return <TeamtableContainer />;
      default:
        return <TeamtableContainer />;
    }
  };

  return <div className={classes.Dashboard}>{showContent()}</div>;
};

const mapStateToProps = (state) => {
  return {
    currentView: state.settings.currentView,
  };
};

export default connect(mapStateToProps, null)(Dashboard);
