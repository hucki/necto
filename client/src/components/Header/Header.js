import React from 'react';
import classes from './Header.module.css';
import { DatePicker } from 'antd';

function onChange(date, dateString) {
  console.log(date, dateString);
}

function Header() {
  return (
    <div className={classes.Header + ' box'}>
      <h1 className={classes.Headline}>necto</h1>
      <DatePicker onChange={onChange} picker="week" />
    </div>
  )
}

export default Header;