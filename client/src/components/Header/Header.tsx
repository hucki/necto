import React from 'react';
import classes from './Header.module.css';
import NavBar from '../NavBar/NavBar';

interface HeaderProps {
  userName: string;
}

function Header({ userName }: HeaderProps) {
  return (
    <div className={classes.Header + ' box'}>
      <h1 className={classes.logo}>necto</h1>
      <NavBar />
    </div>
  );
}

export default Header;
