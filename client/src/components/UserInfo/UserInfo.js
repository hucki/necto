import React from 'react';
import { connect } from 'react-redux';
import classes from './UserInfo.module.css';

const UserInfo = ({user}) => {
  return (
    <div className={classes.userInfo}>
      Hello {user}!

    </div>
  );
}

const mapStateToProps = state => {
  return {
    user: state.userData.currentUser
  }
}
export default connect(mapStateToProps, null)(UserInfo);