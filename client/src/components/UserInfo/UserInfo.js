import React from 'react';
import { connect } from 'react-redux';
import classes from './UserInfo.module.css';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

const UserInfo = ({ user }) => {
  return (
    <div>
      <div className={classes.userInfo}> Hi {user}! </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.userData.currentUser,
  };
};
export default connect(mapStateToProps, null)(UserInfo);
