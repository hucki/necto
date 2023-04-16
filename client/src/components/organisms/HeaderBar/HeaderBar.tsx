import React, { useContext } from 'react';
import dayjs from 'dayjs';
import { Button, Flex, Grid, Input } from '@chakra-ui/react';
import { GoToTarget, UserDateContext } from '../../../providers/UserDate';
import {
  CgChevronDoubleLeft,
  CgChevronDoubleRight,
  CgChevronLeft,
  CgChevronRight,
} from 'react-icons/cg';
import { IconButton } from '../../atoms/Buttons';
import { useFilter } from '../../../hooks/useFilter';

export const toCapital = (term: string): string => {
  const firstLetterCapital = term.substring(0, 1).toUpperCase();
  const rest = term.substring(1);
  return firstLetterCapital + rest;
};

const HeaderBar = () => {
  const { calendarView } = useFilter();
  const { currentDate, setCurrentDate, goTo } = useContext(UserDateContext);

  const dateChangeHandler = (e: React.FormEvent<HTMLInputElement>) => {
    setCurrentDate(dayjs(e.currentTarget.value));
  };

  function todayClickHandler() {
    setCurrentDate(dayjs());
  }

  return (
    <Grid m={2} gridTemplateColumns="auto" w="100%">
      <Flex className="calendar-control" justifySelf="end">
        <Button
          marginX={2}
          disabled={dayjs().isSame(dayjs(currentDate), 'day')}
          onClick={todayClickHandler}
          variant="outline"
          backgroundColor="white"
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
          colorScheme="blackAlpha"
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
            backgroundColor="white"
          />
        </div>
        <IconButton
          colorScheme="blackAlpha"
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
