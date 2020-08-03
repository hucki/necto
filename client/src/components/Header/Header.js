import React from 'react';
import classes from './Header.module.css';
import NavBar from '../NavBar/NavBar';


function Header () {
  return (
    <div className={classes.Header + ' box'}>
      <NavBar />
    </div>
  );
}

export default Header;