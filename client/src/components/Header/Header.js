import React from 'react';
import classes from './Header.module.css';

function Header() {
  return (
    <div className={classes.Header + ' box'}>
      <h1 className={classes.Headline}>necto</h1>
    </div>
  )
}

export default Header;