import React from 'react';
import { connect } from 'react-redux';
import classes from './UserInfo.module.css';
import { Progress } from 'antd';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

const UserInfo = ({user, userId, userData, events, currentDate}) => {

  let plannedAppointments = 0;
    events[user].map(event => {
      if(dayjs(event.startTime).isBetween(dayjs(currentDate).startOf('week'), dayjs(currentDate).endOf('week'))) {
        plannedAppointments++;
      }
    });
  const progress = parseInt(plannedAppointments/userData.appointmentsPerWeek*100)
  return (
    <div>
    <div className={classes.userInfo}> Hi {user}! </div>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    events: state.appointments.events,
    user: state.userData.currentUser,
    userId: state.userData.currentUserId,
    userData: state.appointments.teamMembers[state.userData.currentUserId],
    currentDate: state.current.currentDate
  }
}
export default connect(mapStateToProps, null)(UserInfo);