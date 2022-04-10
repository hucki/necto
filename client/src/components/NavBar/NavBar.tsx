import React, { useContext } from 'react';
import dayjs from 'dayjs';
import { Button, IconButton, DatePicker } from '../Library';
import { FaBackward, FaCaretLeft, FaCaretRight, FaForward } from 'react-icons/fa';
import { Flex } from '@chakra-ui/react';
import { UserDateContext } from '../../providers/UserDate';
console.log('NavBar', dayjs().locale());

const NavBar = () => {

  const {currentDate, setCurrentDate} = useContext(UserDateContext);

  function onChangeHandler(date: ReactDatePickerReturnType) {
    if (date) {
      setCurrentDate(dayjs(date.toString()));
    }
  }
  function todayClickHandler() {
    setCurrentDate(dayjs());
  }
  function prevDayHandler() {
    setCurrentDate(dayjs(currentDate).subtract(1, 'day'));
  }
  function nextDayHandler() {
    setCurrentDate(dayjs(currentDate).add(1, 'day'));
  }
  function prevWeekHandler() {
    setCurrentDate(dayjs(currentDate).subtract(1, 'week'));
  }
  function nextWeekHandler() {
    setCurrentDate(dayjs(currentDate).add(1, 'week'));
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
        marginLeft={2}
        aria-label="previous week"
        leftIcon={<FaBackward />}
        onClick={prevWeekHandler}
      />
      <IconButton
        marginRight={2}
        aria-label="previous day"
        leftIcon={<FaCaretLeft />}
        onClick={prevDayHandler}
      />
      <DatePicker
        onChange={onChangeHandler}
        dateFormat="dd.MM.y"
        selected={currentDate?.toDate()}
      />
      <IconButton
        marginLeft={2}
        aria-label="next day"
        icon={<FaCaretRight />}
        onClick={nextDayHandler}
      />
      <IconButton
        marginRight={2}
        aria-label="next week"
        icon={<FaForward />}
        onClick={nextWeekHandler}
      />
    </Flex>
  );
};

export default NavBar;
