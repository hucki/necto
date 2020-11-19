import React from 'react';
import { connect } from 'react-redux';
import { Button, Tooltip } from 'antd';
import { CaretRightOutlined, CaretLeftOutlined } from '@ant-design/icons';
import { DatePicker } from '../../elements';
import { changeDate } from '../../actions/actions';
import classes from './NavBar.module.css';
import dayjs from 'dayjs';

const NavBar = (props) => {
  function onChangeHandler(date) {
    props.dispatch(changeDate(date));
  }
  function todayClickHandler() {
    props.dispatch(changeDate(dayjs()));
  }
  function prevDayHandler() {
    props.dispatch(changeDate(dayjs(props.currentDate).subtract(1, 'day')));
  }
  function nextDayHandler() {
    props.dispatch(changeDate(dayjs(props.currentDate).add(1, 'day')));
  }

  return (
    <div className={classes.NavBar}>
      <Button disabled={dayjs().isSame(dayjs(props.currentDate), 'day')} onClick={todayClickHandler}>Today</Button>
      <Tooltip title="previous Day">
        <Button icon={<CaretLeftOutlined />} onClick={prevDayHandler}></Button>
      </Tooltip>
      <DatePicker onChange={onChangeHandler} value={props.currentDate} />
      <Tooltip title="next Day">
        <Button icon={<CaretRightOutlined />} onClick={nextDayHandler}></Button>
      </Tooltip>
    </div>
  );
};

const MapStateToProps = (state) => {
  const { currentDate } = state.current;
  return { currentDate };
};
const MapDispatchToProps = (dispatch) => {
  return {
    changeDate,
    dispatch,
  };
};

export default connect(MapStateToProps, MapDispatchToProps)(NavBar);
