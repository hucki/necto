import React from 'react';
import { connect } from 'react-redux';
import classes from './UserInfo.module.css';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { AppState } from '../../types/AppState';
dayjs.extend(isBetween);

interface UserInfoProps {
  userName: string;
}

const UserInfo = ({ userName }: UserInfoProps) => {
  return (
    <div>
      <div className={classes.userInfo}> Hi {userName}! </div>
    </div>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    user: state.userData.currentUser,
  };
};
export default connect(mapStateToProps, null)(UserInfo);
