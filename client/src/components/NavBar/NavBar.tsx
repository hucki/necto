import React, { Dispatch } from 'react';
import { connect } from 'react-redux';
import { DatePicker } from '../../elements';
import { changeDate } from '../../actions/actions';
import { AppState } from '../../types/AppState';
import classes from './NavBar.module.css';
import dayjs, { Dayjs } from 'dayjs';
import { Button, IconButton } from '../Library';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';

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
      <IconButton
        aria-label="previous day"
        leftIcon={<FaCaretLeft />}
        onClick={prevDayHandler}
      ></IconButton>
      <DatePicker onChange={onChangeHandler} value={currentDate} />
      <IconButton
        aria-label="next day"
        icon={<FaCaretRight />}
        onClick={nextDayHandler}
      ></IconButton>
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
