import React from 'react';
import { connect } from 'react-redux';
import classes from './Dashboard.module.css';
import UserCalendarContainer from '../Timetable/UserCalendarContainer/UserCalendarContainer';
import TeamContainer from '../Team/TeamContainer/TeamContainer';
import TimetableContainer from '../Timetable/TimetableContainer/TimetableContainer';
import { useAllTeamMembers } from '../../hooks/user';

const Dashboard = ({ currentView }) => {
  const { isLoading, error, teamMembers } = useAllTeamMembers();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error getting teamMembers: {error.message}</div>;
  if (!teamMembers) return null;

  const showContent = () => {
    switch (currentView) {
      case 'Appointments':
        return <TimetableContainer teamMembers={teamMembers} />;
      case 'Personal':
        return <UserCalendarContainer teamMembers={teamMembers} />;
      case 'Team':
        return <TeamContainer teamMembers={teamMembers} />;
      case 'Settings':
        return <TimetableContainer teamMembers={teamMembers} />;
      default:
        return <TimetableContainer teamMembers={teamMembers} />;
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
