import React, { Dispatch } from 'react';
import { connect } from 'react-redux';
import { Button, Tooltip } from 'antd';
import { CaretRightOutlined, CaretLeftOutlined } from '@ant-design/icons';
import { DatePicker } from '../../elements';
import { changeDate } from '../../actions/actions';
import { AppState } from '../../types/AppState';
import classes from './NavBar.module.css';
import dayjs, { Dayjs } from 'dayjs';

interface NavBarProps {
  currentDate: Dayjs;
  dispatch: Dispatch<any>;
}

const NavBar = ({ currentDate, dispatch }: NavBarProps) => {
  function onChangeHandler(date: Dayjs | null) {
    dispatch(changeDate(date));
  }
  function todayClickHandler() {
    dispatch(changeDate(dayjs()));
  }
  function prevDayHandler() {
    dispatch(changeDate(dayjs(currentDate).subtract(1, 'day')));
  }
  function nextDayHandler() {
    dispatch(changeDate(dayjs(currentDate).add(1, 'day')));
  }

  return (
    <div className={classes.NavBar}>
      <Button
        disabled={dayjs().isSame(dayjs(currentDate), 'day')}
        onClick={todayClickHandler}
      >
        Today
      </Button>
      <Tooltip title="previous Day">
        <Button icon={<CaretLeftOutlined />} onClick={prevDayHandler}></Button>
      </Tooltip>
      <DatePicker onChange={onChangeHandler} value={currentDate} />
      <Tooltip title="next Day">
        <Button icon={<CaretRightOutlined />} onClick={nextDayHandler}></Button>
      </Tooltip>
    </div>
  );
};

const MapStateToProps = (state: AppState) => {
  const { currentDate } = state.current;
  return { currentDate };
};
const MapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    changeDate,
    dispatch,
  };
};

export default connect(MapStateToProps, MapDispatchToProps)(NavBar);
