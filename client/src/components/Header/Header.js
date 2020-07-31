import React from 'react';
import classes from './Header.module.css';
import NavBar from '../NavBar/NavBar';


function Header() {
  return (
    <div className={classes.Header + ' box'}>
      <h1 className={classes.Headline}>necto</h1>
      <NavBar />
    </div>
  )
}

export default Header;