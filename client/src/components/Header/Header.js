import React from 'react';
import classes from './Header.module.css';

function Header() {
  return (
    <div className={classes.Header + ' box'}>
      <p>i am a Header</p>
    </div>
  )
}

export default Header;