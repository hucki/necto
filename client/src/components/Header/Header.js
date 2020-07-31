import React from 'react';
import classes from './Header.module.css';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { DatePicker } from '../../elements';
import { changeDate } from '../../actions/actions'



function Header(props) {

  function onChange(date, dateString) {
    props.dispatch(changeDate(date))
    console.log(date, dateString);
  }
  return (
    <div className={classes.Header + ' box'}>
      <h1 className={classes.Headline}>necto</h1>
      <DatePicker onChange={onChange} value={props.currentDate} size='small'/>
    </div>
  )
}
const MapStateToProps = state => {
  const { currentDate } = state
  return { currentDate }
}
const MapDispatchToProps = dispatch => {
  return {
    changeDate,
    dispatch
  }
}
export default connect(MapStateToProps, MapDispatchToProps)(Header);