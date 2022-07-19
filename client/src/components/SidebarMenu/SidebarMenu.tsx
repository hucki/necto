import React, { Dispatch, useContext } from 'react';
import { useDisclosure, Divider } from '@chakra-ui/react';
import {
  RiCalendarEventFill,
  RiHomeFill,
  RiLogoutBoxFill,
  RiMentalHealthFill,
  RiMenuFoldFill,
  RiMenuUnfoldFill,
  RiSettingsLine,
  RiTeamFill,
  RiUserFill,
  RiZzzFill,
} from 'react-icons/ri';
import { connect } from 'react-redux';
import { switchView } from '../../actions/actions';
import { useHistory, useLocation } from 'react-router';
import { AppState } from '../../types/AppState';
import { IconButton, NavigationButton, Sidebar } from '../Library';
import { useTranslation } from 'react-i18next';
import { FaHandHoldingMedical } from 'react-icons/fa';
import { logout } from '../../services/Auth';
import { AuthContext } from '../../providers/AuthProvider';

interface SidebarProps {
  dispatch: Dispatch<any>;
}

const SidebarMenu = ({ dispatch }: SidebarProps) => {
  const { pathname: currentView } = useLocation();
  const { user, logMeOut } = useContext(AuthContext);
  const history = useHistory();
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  const onClickHandler = (route: string) => {
    history.push(route);
    dispatch(switchView(route));
    onClose();
  };
  const handleLogout = () => {
    logMeOut();
  };
  const { t } = useTranslation();
  return (
    <Sidebar collapsed={!isOpen}>
      {/* Menu Button */}
      <IconButton
        aria-label="Open Menu"
        icon={isOpen ? <RiMenuFoldFill /> : <RiMenuUnfoldFill />}
        onClick={onToggle}
        fontSize="2xl"
      />
      {/* Basics */}
      <NavigationButton
        variant={currentView === '/' ? 'solid' : 'ghost'}
        colorScheme="purple"
        aria-label="Home"
        leftIcon={<RiHomeFill />}
        key="/"
        onClick={() => onClickHandler('/')}
      >
        {isOpen ? t('menu.home') : null}
      </NavigationButton>
      <Divider />
      <NavigationButton
        variant={currentView === '/personalcal' ? 'solid' : 'ghost'}
        colorScheme="teal"
        aria-label="Personal Calendar"
        leftIcon={<RiUserFill />}
        key="/personalcal"
        onClick={() => onClickHandler('/personalcal')}
      >
        {isOpen ? t('menu.personalCalendar') : null}
      </NavigationButton>
      <NavigationButton
        hidden={!user?.isAdmin && !user?.isPlanner}
        variant={currentView === '/teamcal' ? 'solid' : 'ghost'}
        colorScheme="teal"
        aria-label="Team Calendar"
        leftIcon={<RiTeamFill />}
        key="/teamcal"
        onClick={() => onClickHandler('/teamcal')}
      >
        {isOpen ? t('menu.teamCalendar') : null}
      </NavigationButton>
      <NavigationButton
        colorScheme="teal"
        variant={currentView === '/rooms' ? 'solid' : 'ghost'}
        aria-label="Rooms"
        leftIcon={<RiCalendarEventFill />}
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
        leftIcon={<RiMentalHealthFill />}
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
        leftIcon={<RiZzzFill />}
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
        leftIcon={<FaHandHoldingMedical />}
        key="/doctors"
        onClick={() => onClickHandler('/doctors')}
      >
        {isOpen ? t('menu.doctors') : null}
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
        leftIcon={<RiLogoutBoxFill />}
      >
        {isOpen ? t('menu.logout') : null}
      </NavigationButton>
    </Sidebar>
  );
};

const MapStateToProps = (state: AppState) => {
  return {
    currentView: state.settings.currentView,
  };
};

const MapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    switchView,
    dispatch,
  };
};

export default connect(MapStateToProps, MapDispatchToProps)(SidebarMenu);
