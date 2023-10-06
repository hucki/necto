import React, { CSSProperties, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAllTeamMembers } from '../../../hooks/user';
import TeamCalendar from '../../../views/TeamCalendar/TeamCalendar';
import PersonalCalendar from '../../../views/PersonalCalendar/PersonalCalendar';
import Patients from '../../../views/Patients/Patients';
import WaitingList from '../../../views/Patients/WaitingList';
import Settings from '../../../views/Settings/Settings';
import Doctors from '../../../views/Doctors/Doctors';
import { AuthContext } from '../../../providers/AuthProvider';
import Home from '../../../views/Home/Home';
import Institutions from '../../../views/Institutions/Institutions';
import RoomCalendar from '../../../views/RoomCalendar/RoomCalendar';
import Reports from '../../../views/Reports/Reports';
import { isAuthorized } from '../../../config/navigation';

interface DashboardInputProps {
  id: string;
  style?: CSSProperties;
}
const Dashboard = ({ id }: DashboardInputProps) => {
  const { user } = useContext(AuthContext);
  const employeeId = user?.employeeId;
  const { isLoading, error, teamMembers } = useAllTeamMembers();
  if (isLoading)
    return (
      <>
        <div>Loading...</div>
      </>
    );
  if (error) return <div>Error getting teamMembers</div>;
  if (!teamMembers) return <div>Data missing</div>;

  const RedirectHome = () => {
    return <Navigate to="/home" />;
  };

  return (
    <>
      <div style={{ width: '100%', height: '100%' }}>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/roomCalendar" element={<RoomCalendar />} />
          <Route
            path="/patients"
            element={
              user && isAuthorized(user, 'patients') ? (
                <Patients />
              ) : (
                <RedirectHome />
              )
            }
          />
          <Route
            path="/doctors"
            element={
              user && isAuthorized(user, 'doctors') ? (
                <Doctors />
              ) : (
                <RedirectHome />
              )
            }
          />
          <Route
            path="/institutions"
            element={
              user && isAuthorized(user, 'institutions') ? (
                <Institutions />
              ) : (
                <RedirectHome />
              )
            }
          />
          <Route
            path="/waiting"
            element={
              user && isAuthorized(user, 'waiting') ? (
                <WaitingList />
              ) : (
                <RedirectHome />
              )
            }
          />
          <Route
            path="/teamcal"
            element={
              user && isAuthorized(user, 'teamcal') ? (
                <TeamCalendar />
              ) : (
                <RedirectHome />
              )
            }
          />
          <Route
            path="/personalcal"
            element={
              user && employeeId && isAuthorized(user, 'personalcal') ? (
                <PersonalCalendar id={id} employeeId={employeeId} />
              ) : (
                <RedirectHome />
              )
            }
          />
          <Route
            path="/reports"
            element={
              user && isAuthorized(user, 'reports') ? (
                <Reports />
              ) : (
                <RedirectHome />
              )
            }
          />
          <Route
            path="/settings"
            element={
              user && isAuthorized(user, 'settings') ? (
                <Settings />
              ) : (
                <RedirectHome />
              )
            }
          />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </div>
    </>
  );
};

export default Dashboard;
