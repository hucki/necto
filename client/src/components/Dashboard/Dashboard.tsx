import React, { CSSProperties } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import classes from './Dashboard.module.css';
import { useAllTeamMembers } from '../../hooks/user';
import { AppState } from '../../types/AppState';
import TeamCalendar from '../../views/TeamCalendar/TeamCalendar';
import PersonalCalendar from '../../views/PersonalCalendar/PersonalCalendar';
import Rooms from '../../views/Rooms/Rooms';
import Patients from '../../views/Patients/Patients';
import WaitingList from '../../views/Patients/WaitingList';
import Settings from '../../views/Settings/Settings';
import Doctors from '../../views/Doctors/Doctors';

interface DashboardInputProps {
  id: string;
  style?: CSSProperties;
}
const Dashboard = ({ id }: DashboardInputProps): JSX.Element => {
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
        <Route path="/patients">
          <Patients />
        </Route>
        <Route path="/doctors">
          <Doctors />
        </Route>
        <Route path="/waiting">
          <WaitingList />
        </Route>
        <Route path="/teamcal">
          <TeamCalendar />
        </Route>
        <Route path="/personalcal">
          <PersonalCalendar id={id}/>
        </Route>
        <Route path="/settings">
          <Settings />
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
