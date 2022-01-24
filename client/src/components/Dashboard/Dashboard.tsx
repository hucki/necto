import React, { CSSProperties } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import classes from './Dashboard.module.css';
import TeamContainer from '../Team/TeamContainer/TeamContainer';
import { useAllTeamMembers } from '../../hooks/user';
import UserProfile from '../UserProfile/UserProfile';
import { AppState } from '../../types/AppState';
import TeamCalendar from '../../views/TeamCalendar/TeamCalendar';
import Rooms from '../../views/Rooms/Rooms';
import TeamSettings from '../../views/TeamSettings/TeamSettings';
import EmployeeSettings from '../../views/EmployeeSettings/EmployeeSettings';

interface DashboardInputProps {
  a0Id: string;
  style?: CSSProperties;
}
const Dashboard = ({ a0Id }: DashboardInputProps): JSX.Element => {
  const { isLoading, error, teamMembers } = useAllTeamMembers();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error getting teamMembers: {error}</div>;
  if (!teamMembers) return <div>Data missing</div>;

  return (
    <div className={classes.Dashboard}>
      <Switch>
        <Route exact path="/">
          <h1>Welcome home</h1>
        </Route>
        <Route path="/rooms">
          <Rooms />
        </Route>
        <Route path="/teamcal">
          <TeamCalendar />
        </Route>
        <Route path="/team">
          <TeamContainer teamMembers={teamMembers} />
        </Route>
        <Route path="/teamsettings">
          <TeamSettings />
          {/* <TeamContainer teamMembers={teamMembers} /> */}
        </Route>
        <Route path="/employeesettings">
          <EmployeeSettings />
        </Route>
        <Route path="/profile">
          <UserProfile a0Id={a0Id} />
        </Route>
        <Route path="*">
          <div>Route not found</div>
        </Route>
      </Switch>
    </div>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    currentView: state.settings.currentView,
  };
};

export default connect(mapStateToProps, null)(Dashboard);
