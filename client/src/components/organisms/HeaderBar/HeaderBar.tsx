import React, { useContext } from 'react';
import dayjs from 'dayjs';
import {
  Button,
  Flex,
  Grid,
  Input,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { GoToTarget, UserDateContext } from '../../../providers/UserDate';
import {
  CgChevronDoubleLeft,
  CgChevronDoubleRight,
  CgChevronLeft,
  CgChevronRight,
} from 'react-icons/cg';
import { IconButton } from '../../atoms/Buttons';
import { useFilter } from '../../../hooks/useFilter';
import { FaMoon, FaSun } from 'react-icons/fa';

export const toCapital = (term: string): string => {
  const firstLetterCapital = term.substring(0, 1).toUpperCase();
  const rest = term.substring(1);
  return firstLetterCapital + rest;
};

const HeaderBar = () => {
  const { calendarView } = useFilter();
  const { currentDate, setCurrentDate, goTo } = useContext(UserDateContext);
  const { colorMode, toggleColorMode } = useColorMode();
  const bgInput = useColorModeValue('white', 'gray');
  const colInput = useColorModeValue('black', 'white');

  const dateChangeHandler = (e: React.FormEvent<HTMLInputElement>) => {
    setCurrentDate(dayjs(e.currentTarget.value));
  };

  function todayClickHandler() {
    setCurrentDate(dayjs());
  }

  return (
    <Grid m={2} gridTemplateColumns="auto" w="100%">
      <Flex className="calendar-control" justifySelf="end">
        <Button onClick={toggleColorMode}>
          {colorMode === 'light' ? (
            <FaMoon color="orange" />
          ) : (
            <FaSun color="yellow" />
          )}
        </Button>
        <Button
          marginX={2}
          disabled={dayjs().isSame(dayjs(currentDate), 'day')}
          onClick={todayClickHandler}
          variant="solid"
          bg={bgInput}
          color={colInput}
        >
          <div>
            <div
              style={{
                backgroundColor: 'red',
                height: '0.2rem',
                borderRadius: '1rem',
              }}
            ></div>
            <div>{dayjs().format('DD')}</div>
          </div>
        </Button>
        <IconButton
          colorScheme="leave"
          marginRight={2}
          aria-label={`previous ${calendarView}`}
          leftIcon={
            calendarView === 'week' ? (
              <CgChevronDoubleLeft size="2rem" />
            ) : (
              <CgChevronLeft size="2rem" />
            )
          }
          onClick={() =>
            goTo(`previous${toCapital(calendarView)}` as GoToTarget)
          }
        />
        <div style={{ maxWidth: '150px' }}>
          <Input
            id="startDate"
            autoComplete="off"
            type="date"
            name="startDate"
            value={dayjs(currentDate).format('YYYY-MM-DD')}
            onChange={dateChangeHandler}
            bg={bgInput}
            color={colInput}
          />
        </div>
        <IconButton
          colorScheme="leave"
          marginLeft={2}
          aria-label={`next ${calendarView}`}
          leftIcon={
            calendarView === 'week' ? (
              <CgChevronDoubleRight size="2rem" />
            ) : (
              <CgChevronRight size="2rem" />
            )
          }
          onClick={() => goTo(`next${toCapital(calendarView)}` as GoToTarget)}
        />
      </Flex>
    </Grid>
  );
};

export default HeaderBar;
