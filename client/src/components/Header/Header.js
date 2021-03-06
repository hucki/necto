import React from 'react';
import classes from './Header.module.css';
import NavBar from '../NavBar/NavBar';
import UserInfo from '../UserInfo/UserInfo';

function Header ({userName}) {
  return (
    <div className={classes.Header + ' box'}>
      <h1 className={classes.logo}>necto</h1>
      <UserInfo userName={userName}/>
      <NavBar />
    </div>
  );
}

export default Header;
