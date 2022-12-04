import React, { useContext } from 'react';
import { Divider } from '@chakra-ui/react';
import {
  IoBusinessOutline,
  IoCalendarNumberOutline,
  IoClose,
  IoConstructOutline,
  IoFileTrayFullOutline,
  IoHomeOutline,
  IoLogOutOutline,
  IoManOutline,
  IoMedkitOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoStorefrontOutline,
  IoWomanOutline,
} from 'react-icons/io5';
import { useNavigate, useLocation } from 'react-router';
import { SideNavContainer } from '../../Library';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../../providers/AuthProvider';
import { IconButton, NavigationButton } from '../../atoms/Buttons';

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideNav = ({ isOpen = true, onClose }: SideNavProps) => {
  const { pathname: currentView } = useLocation();
  const { user, logMeOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const onClickHandler = (route: string) => {
    navigate(route);
    onClose();
  };
  const handleLogout = () => {
    logMeOut();
  };

  const { t } = useTranslation();
  return (
    <SideNavContainer isOpen={isOpen}>
      {/* Menu Button */}
      <IconButton
        aria-label="Close Menu"
        icon={<IoClose />}
        onClick={onClose}
        fontSize="2xl"
      />
      {/* Basics */}
      <NavigationButton
        variant={currentView === '/home' ? 'solid' : 'ghost'}
        colorScheme="purple"
        aria-label="Home"
        leftIcon={<IoHomeOutline />}
        key="/home"
        onClick={() => onClickHandler('/home')}
      >
        {t('menu.home')}
      </NavigationButton>
      <Divider />
      <NavigationButton
        variant={currentView === '/personalcal' ? 'solid' : 'ghost'}
        colorScheme="teal"
        aria-label="Personal Calendar"
        leftIcon={
          <>
            <IoCalendarNumberOutline />
            <IoPersonOutline />
          </>
        }
        key="/personalcal"
        onClick={() => onClickHandler('/personalcal')}
      >
        {t('menu.personalCalendar')}
      </NavigationButton>
      <NavigationButton
        hidden={!user?.isAdmin && !user?.isPlanner && !user?.isEmployee}
        variant={currentView === '/teamcal' ? 'solid' : 'ghost'}
        colorScheme="teal"
        aria-label="Team Calendar"
        leftIcon={
          <>
            <IoCalendarNumberOutline />
            <IoPeopleOutline />
          </>
        }
        key="/teamcal"
        onClick={() => onClickHandler('/teamcal')}
      >
        {t('menu.teamCalendar')}
      </NavigationButton>
      <NavigationButton
        colorScheme="teal"
        variant={currentView === '/rooms' ? 'solid' : 'ghost'}
        aria-label="Rooms"
        leftIcon={
          <>
            <IoCalendarNumberOutline />
            <IoStorefrontOutline />
          </>
        }
        key="/rooms"
        onClick={() => onClickHandler('/rooms')}
      >
        {isOpen ? t('menu.roomCalendar') : null}
      </NavigationButton>
      <Divider />
      <NavigationButton
        hidden={!user?.isAdmin && !user?.isPlanner && !user?.isEmployee}
        colorScheme="blue"
        variant={currentView === '/patients' ? 'solid' : 'ghost'}
        aria-label="Patients"
        leftIcon={
          <>
            <IoWomanOutline />
            <IoManOutline />
          </>
        }
        key="/patients"
        onClick={() => onClickHandler('/patients')}
      >
        {isOpen ? t('menu.patients') : null}
      </NavigationButton>
      <NavigationButton
        hidden={!user?.isAdmin && !user?.isPlanner}
        colorScheme="blue"
        variant={currentView === '/waiting' ? 'solid' : 'ghost'}
        aria-label="WaitingList"
        leftIcon={<IoFileTrayFullOutline />}
        key="/waiting"
        onClick={() => onClickHandler('/waiting')}
      >
        {isOpen ? t('menu.waitingList') : null}
      </NavigationButton>
      <NavigationButton
        hidden={!user?.isAdmin && !user?.isPlanner}
        colorScheme="blue"
        variant={currentView === '/doctors' ? 'solid' : 'ghost'}
        aria-label="Doctors"
        leftIcon={<IoMedkitOutline />}
        key="/doctors"
        onClick={() => onClickHandler('/doctors')}
      >
        {isOpen ? t('menu.doctors') : null}
      </NavigationButton>
      <NavigationButton
        hidden={!user?.isAdmin && !user?.isPlanner}
        colorScheme="blue"
        variant={currentView === '/institutions' ? 'solid' : 'ghost'}
        aria-label="institutions"
        leftIcon={<IoBusinessOutline />}
        key="/institutions"
        onClick={() => onClickHandler('/institutions')}
      >
        {isOpen ? t('menu.institutions') : null}
      </NavigationButton>
      <Divider />
      {/* Settings */}
      <NavigationButton
        colorScheme="gray"
        variant={currentView === '/settings' ? 'solid' : 'ghost'}
        aria-label="Settings"
        leftIcon={<IoConstructOutline />}
        key="/settings"
        onClick={() => onClickHandler('/settings')}
      >
        {isOpen ? t('menu.settings') : null}
      </NavigationButton>
      <Divider />
      {/* Logout */}
      <NavigationButton
        key="/logout"
        colorScheme="orange"
        onClick={handleLogout}
        variant="ghost"
        aria-label="Logout"
        leftIcon={<IoLogOutOutline />}
      >
        {isOpen ? t('menu.logout') : null}
      </NavigationButton>
    </SideNavContainer>
  );
};

export default SideNav;
