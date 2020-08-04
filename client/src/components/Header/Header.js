import React from 'react';
import classes from './Header.module.css';
import NavBar from '../NavBar/NavBar';
import UserInfo from '../UserInfo/UserInfo';


function Header () {
  return (
    <div className={classes.Header + ' box'}>
      <UserInfo />
      <NavBar />
    </div>
  );
}

export default Header;