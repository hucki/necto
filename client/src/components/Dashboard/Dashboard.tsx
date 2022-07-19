import React, { CSSProperties, useContext } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
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
import { AuthContext } from '../../providers/AuthProvider';
import Home from '../../views/Home/Home';

interface DashboardInputProps {
  id: string;
  style?: CSSProperties;
}
const Dashboard = ({ id }: DashboardInputProps): JSX.Element => {
  const { user } = useContext(AuthContext);
  const { isLoading, error, teamMembers } = useAllTeamMembers();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error getting teamMembers: {error}</div>;
  if (!teamMembers) return <div>Data missing</div>;

  const RedirectHome = () => {
    return <Redirect to="/" />;
  };

  return (
    <div className={classes.Dashboard}>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/rooms" component={Rooms} />
        <Route path="/patients" component={user?.isPlanner || user?.isAdmin || user?.isEmployee ? Patients : RedirectHome} />
        <Route path="/doctors" component={user?.isPlanner || user?.isAdmin ? Doctors : RedirectHome} />
        <Route path="/waiting" component={user?.isPlanner || user?.isAdmin ? WaitingList : RedirectHome} />
        <Route path="/teamcal" component={user?.isAdmin ? TeamCalendar : RedirectHome} />
        <Route path="/personalcal">
          <PersonalCalendar id={id}/>
        </Route>
        <Route path="/settings" component={Settings} />
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
