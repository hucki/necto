import React, { useContext } from 'react';
import dayjs from 'dayjs';
import { Button, Flex, Grid, Input } from '@chakra-ui/react';
import { UserDateContext } from '../../../providers/UserDate';
import {
  CgChevronDoubleLeft,
  CgChevronDoubleRight,
  CgChevronLeft,
  CgChevronRight,
} from 'react-icons/cg';
import { IconButton } from '../../atoms/Buttons';
import { useFilter } from '../../../hooks/useFilter';

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
        {calendarView === 'week' ? (
          <IconButton
            colorScheme="blackAlpha"
            marginRight={2}
            aria-label="previous week"
            leftIcon={<CgChevronDoubleLeft size="2rem" />}
            onClick={() => goTo('previousWeek')}
          />
        ) : (
          <IconButton
            colorScheme="blackAlpha"
            marginRight={2}
            aria-label="previous day"
            leftIcon={<CgChevronLeft size="2rem" />}
            onClick={() => goTo('previousDay')}
          />
        )}
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
        {calendarView === 'day' ? (
          <IconButton
            colorScheme="blackAlpha"
            marginLeft={2}
            aria-label="next day"
            icon={<CgChevronRight size="2rem" />}
            onClick={() => goTo('nextDay')}
          />
        ) : (
          <IconButton
            colorScheme="blackAlpha"
            marginLeft={2}
            aria-label="next week"
            icon={<CgChevronDoubleRight size="2rem" />}
            onClick={() => goTo('nextWeek')}
          />
        )}
      </Flex>
    </Grid>
  );
};

export default HeaderBar;
