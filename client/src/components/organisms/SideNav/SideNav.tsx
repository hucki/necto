import React, { useContext } from 'react';
import { Divider } from '@chakra-ui/react';
import {
  RiLogoutBoxLine,
  RiMentalHealthLine,
  RiSettingsLine,
  RiTeamLine,
  RiZzzLine,
} from 'react-icons/ri';
import { useNavigate, useLocation } from 'react-router';
import { AppState } from '../../../types/AppState';
import { SideNavContainer } from '../../Library';
import { useTranslation } from 'react-i18next';
import { FaClinicMedical, FaRegBuilding } from 'react-icons/fa';
import { AuthContext } from '../../../providers/AuthProvider';
import { CgCalendarDates, CgClose, CgHome, CgUser } from 'react-icons/cg';
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
        aria-label="Open Menu"
        icon={<CgClose />}
        onClick={onClose}
        fontSize="2xl"
      />
      {/* Basics */}
      <NavigationButton
        variant={currentView === '/' ? 'solid' : 'ghost'}
        colorScheme="purple"
        aria-label="Home"
        leftIcon={<CgHome />}
        key="/"
        onClick={() => onClickHandler('/')}
      >
        {t('menu.home')}
      </NavigationButton>
      <Divider />
      <NavigationButton
        variant={currentView === '/personalcal' ? 'solid' : 'ghost'}
        colorScheme="teal"
        aria-label="Personal Calendar"
        leftIcon={<CgUser />}
        key="/personalcal"
        onClick={() => onClickHandler('/personalcal')}
      >
        {t('menu.personalCalendar')}
      </NavigationButton>
      <NavigationButton
        hidden={!user?.isAdmin && !user?.isPlanner}
        variant={currentView === '/teamcal' ? 'solid' : 'ghost'}
        colorScheme="teal"
        aria-label="Team Calendar"
        leftIcon={<RiTeamLine />}
        key="/teamcal"
        onClick={() => onClickHandler('/teamcal')}
      >
        {t('menu.teamCalendar')}
      </NavigationButton>
      <NavigationButton
        colorScheme="teal"
        variant={currentView === '/rooms' ? 'solid' : 'ghost'}
        aria-label="Rooms"
        leftIcon={<CgCalendarDates />}
        key="/rooms"
        onClick={() => onClickHandler('/rooms')}
      >
        {isOpen ? t('menu.roomCalendar') : null}
      </NavigationButton>
      <NavigationButton
        hidden={!user?.isAdmin && !user?.isPlanner}
        colorScheme="teal"
        variant={currentView === '/patients' ? 'solid' : 'ghost'}
        aria-label="Patients"
        leftIcon={<RiMentalHealthLine />}
        key="/patients"
        onClick={() => onClickHandler('/patients')}
      >
        {isOpen ? t('menu.patients') : null}
      </NavigationButton>
      <NavigationButton
        hidden={!user?.isAdmin && !user?.isPlanner && !user?.isEmployee}
        colorScheme="teal"
        variant={currentView === '/waiting' ? 'solid' : 'ghost'}
        aria-label="WaitingList"
        leftIcon={<RiZzzLine />}
        key="/waiting"
        onClick={() => onClickHandler('/waiting')}
      >
        {isOpen ? t('menu.waitingList') : null}
      </NavigationButton>
      <NavigationButton
        hidden={!user?.isAdmin && !user?.isPlanner}
        colorScheme="teal"
        variant={currentView === '/doctors' ? 'solid' : 'ghost'}
        aria-label="Doctors"
        leftIcon={<FaClinicMedical />}
        key="/doctors"
        onClick={() => onClickHandler('/doctors')}
      >
        {isOpen ? t('menu.doctors') : null}
      </NavigationButton>
      <NavigationButton
        hidden={!user?.isAdmin && !user?.isPlanner}
        colorScheme="teal"
        variant={currentView === '/institutions' ? 'solid' : 'ghost'}
        aria-label="institutions"
        leftIcon={<FaRegBuilding />}
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
        leftIcon={<RiSettingsLine />}
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
        leftIcon={<RiLogoutBoxLine />}
      >
        {isOpen ? t('menu.logout') : null}
      </NavigationButton>
    </SideNavContainer>
  );
};

const MapStateToProps = (state: AppState) => {
  return {
    currentView: state.settings.currentView,
  };
};

export default SideNav;
