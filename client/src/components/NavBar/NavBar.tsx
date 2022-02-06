import React, { Dispatch } from 'react';
import { connect } from 'react-redux';
import { changeDate } from '../../actions/actions';
import { AppState } from '../../types/AppState';
import dayjs, { Dayjs } from 'dayjs';
import { Button, IconButton, DatePicker } from '../Library';

import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import { Flex } from '@chakra-ui/react';

interface NavBarProps {
  currentDate: Dayjs;
  dispatch: Dispatch<any>;
}

const NavBar = ({ currentDate, dispatch }: NavBarProps) => {
  function onChangeHandler(date: ReactDatePickerReturnType) {
    if (date) dispatch(changeDate(dayjs(date.toString())));
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
    <Flex m={2}>
      <Button
        marginX={2}
        disabled={dayjs().isSame(dayjs(currentDate), 'day')}
        onClick={todayClickHandler}
        variant="outline"
      >
        Today
      </Button>
      <IconButton
        marginX={2}
        aria-label="previous day"
        leftIcon={<FaCaretLeft />}
        onClick={prevDayHandler}
      />
      <DatePicker
        onChange={onChangeHandler}
        dateFormat="dd.MM.y"
        selected={currentDate.toDate()}
      />
      <IconButton
        marginX={2}
        aria-label="next day"
        icon={<FaCaretRight />}
        onClick={nextDayHandler}
      />
    </Flex>
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
