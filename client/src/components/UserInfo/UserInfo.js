import React from 'react';
import { connect } from 'react-redux';
import classes from './UserInfo.module.css';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

const UserInfo = ({ user, userId, userData, events, currentDate }) => {
  return (
    <div>
      <div className={classes.userInfo}> Hi {user}! </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    events: state.appointments.events,
    user: state.userData.currentUser,
    userId: state.userData.currentUserId,
    userData: state.appointments.teamMembers[state.userData.currentUserId],
    currentDate: state.current.currentDate,
  };
};
export default connect(mapStateToProps, null)(UserInfo);
