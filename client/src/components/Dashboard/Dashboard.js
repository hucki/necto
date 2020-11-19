import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import classes from './Dashboard.module.css';
import UserCalendarContainer from '../Timetable/UserCalendarContainer/UserCalendarContainer';
import TeamContainer from '../Team/TeamContainer/TeamContainer';
import TimetableContainer from '../Timetable/TimetableContainer/TimetableContainer';
import { useAllTeamMembers } from '../../hooks/user';

const Dashboard = () => {
  const { isLoading, error, teamMembers } = useAllTeamMembers();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error getting teamMembers: {error.message}</div>;
  if (!teamMembers) return null;

  return (
    <div className={classes.Dashboard}>

      <Switch>
        <Route exact path="/">
          <TimetableContainer teamMembers={teamMembers} />
        </Route>
        <Route path="/appointments">
          <TimetableContainer teamMembers={teamMembers} />
        </Route>
        <Route path="/personal">
        <UserCalendarContainer teamMembers={teamMembers} />
        </Route>
        <Route path="/team">
          <TeamContainer teamMembers={teamMembers} />
        </Route>
        <Route path="*">
          <div>Route nor found</div>
        </Route>
      </Switch>
    </div>);
};

const mapStateToProps = (state) => {
  return {
    currentView: state.settings.currentView,
  };
};

export default connect(mapStateToProps, null)(Dashboard);
