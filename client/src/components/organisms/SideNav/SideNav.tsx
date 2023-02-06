import React, { useContext } from 'react';
import { Divider } from '@chakra-ui/react';
import {
  IoBusinessOutline,
  IoCalendarNumberOutline,
  IoConstructOutline,
  IoDocumentText,
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
import { NavigationButton } from '../../atoms/Buttons';
import { SideNavOverlay } from '../../Library/AppLayout';

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
    <>
      <SideNavOverlay isOpen={isOpen} onClick={onClose} />
      <SideNavContainer isOpen={isOpen}>
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
          {t('menu.personalcal')}
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
          {t('menu.teamcal')}
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
          {t('menu.rooms')}
        </NavigationButton>
        <NavigationButton
          colorScheme="teal"
          variant={currentView === '/roomCalendar' ? 'solid' : 'ghost'}
          aria-label="Rooms"
          leftIcon={
            <>
              <IoCalendarNumberOutline />
              <IoStorefrontOutline />
            </>
          }
          key="/roomCalendar"
          onClick={() => onClickHandler('/roomCalendar')}
        >
          {t('menu.roomCalendar')}
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
          {t('menu.patients')}
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
          {t('menu.waiting')}
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
          {t('menu.doctors')}
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
          {t('menu.institutions')}
        </NavigationButton>
        <Divider />
        <NavigationButton
          hidden={!user?.isAdmin}
          colorScheme="whatsapp"
          variant={currentView === '/reports' ? 'solid' : 'ghost'}
          aria-label="Reports"
          leftIcon={<IoDocumentText />}
          key="/reports"
          onClick={() => onClickHandler('/reports')}
        >
          {t('menu.reports')}
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
          {t('menu.settings')}
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
          {t('menu.logout')}
        </NavigationButton>
      </SideNavContainer>
    </>
  );
};

export default SideNav;
