import React, { useContext } from 'react';
import dayjs from 'dayjs';
import { Button, IconButton, DatePicker } from '../Library';
import {
  FaBackward,
  FaCaretLeft,
  FaCaretRight,
  FaForward,
  FaHamburger,
} from 'react-icons/fa';
import { Flex, Grid } from '@chakra-ui/react';
import { UserDateContext } from '../../providers/UserDate';
import { useViewport } from '../../hooks/useViewport';
import { registerLocale } from 'react-datepicker';
import de from 'date-fns/locale/de';
import { RiMenu2Fill, RiMenuFill } from 'react-icons/ri';
registerLocale('de', de);

interface NavBarProps {
  isSideNavOpen: boolean
  onSideNavOpen: () => void
}

const NavBar = ({isSideNavOpen, onSideNavOpen}: NavBarProps) => {
  const { currentDate, setCurrentDate, goTo } = useContext(UserDateContext);
  const { isMobile } = useViewport();

  function onChangeHandler(date: ReactDatePickerReturnType) {
    if (date) {
      setCurrentDate(dayjs(date.toString()));
    }
  }
  function todayClickHandler() {
    setCurrentDate(dayjs());
  }

  return (
    <Grid m={2} gridTemplateColumns="auto auto" w="100%">
      <div className="menu-control">
        <IconButton
          aria-label="menu"
          icon={<RiMenuFill />}
          onClick={onSideNavOpen}
        />
      </div>
      <Flex className="calenndar-control" justifySelf="end">
        <Button
          marginX={2}
          disabled={dayjs().isSame(dayjs(currentDate), 'day')}
          onClick={todayClickHandler}
          variant="outline"
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
          marginLeft={2}
          aria-label="previous week"
          leftIcon={<FaBackward />}
          onClick={() => goTo('previousWeek')}
        />
        <IconButton
          marginRight={2}
          aria-label="previous day"
          leftIcon={<FaCaretLeft />}
          onClick={() => goTo('previousDay')}
        />
        <div style={{maxWidth: '100px'}}>
          <DatePicker
            locale="de"
            onChange={onChangeHandler}
            dateFormat={isMobile ? 'dd.MM.' : 'dd.MM.y'}
            selected={currentDate?.toDate()}
          />
        </div>
        <IconButton
          marginLeft={2}
          aria-label="next day"
          icon={<FaCaretRight />}
          onClick={() => goTo('nextDay')}
        />
        <IconButton
          marginRight={2}
          aria-label="next week"
          icon={<FaForward />}
          onClick={() => goTo('nextWeek')}
        />
      </Flex>
    </Grid>
  );
};

export default NavBar;
