import React, { CSSProperties, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAllTeamMembers } from '../../../hooks/user';
import TeamCalendar from '../../../views/TeamCalendar/TeamCalendar';
import PersonalCalendar from '../../../views/PersonalCalendar/PersonalCalendar';
import Rooms from '../../../views/Rooms/Rooms';
import Patients from '../../../views/Patients/Patients';
import WaitingList from '../../../views/Patients/WaitingList';
import Settings from '../../../views/Settings/Settings';
import Doctors from '../../../views/Doctors/Doctors';
import { AuthContext } from '../../../providers/AuthProvider';
import Home from '../../../views/Home/Home';
import Institutions from '../../../views/Institutions/Institutions';

interface DashboardInputProps {
  id: string;
  style?: CSSProperties;
}
const Dashboard = ({ id }: DashboardInputProps) => {
  const { user } = useContext(AuthContext);
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
          <Route path="/rooms" element={<Rooms />} />
          <Route
            path="/patients"
            element={
              user?.isPlanner || user?.isAdmin || user?.isEmployee ? (
                <Patients />
              ) : (
                <RedirectHome />
              )
            }
          />
          <Route
            path="/doctors"
            element={
              user?.isPlanner || user?.isAdmin ? <Doctors /> : <RedirectHome />
            }
          />
          <Route
            path="/institutions"
            element={
              user?.isPlanner || user?.isAdmin ? (
                <Institutions />
              ) : (
                <RedirectHome />
              )
            }
          />
          <Route
            path="/waiting"
            element={
              user?.isPlanner || user?.isAdmin ? (
                <WaitingList />
              ) : (
                <RedirectHome />
              )
            }
          />
          <Route
            path="/teamcal"
            element={user?.isAdmin ? <TeamCalendar /> : <RedirectHome />}
          />
          <Route path="/personalcal" element={<PersonalCalendar id={id} />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </div>
    </>
  );
};

export default Dashboard;
