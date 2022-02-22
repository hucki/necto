import React, { Dispatch } from 'react';
import { IconButton, useDisclosure, Divider } from '@chakra-ui/react';
import {
  RiCalendarEventFill,
  RiHomeFill,
  RiLogoutBoxLine,
  RiMenuFoldFill,
  RiMenuUnfoldFill,
  RiProfileLine,
  RiTeamFill,
  RiUserSettingsFill,
  RiUserSettingsLine,
} from 'react-icons/ri';
import { connect } from 'react-redux';
import { switchView } from '../../actions/actions';
import { useHistory, useLocation } from 'react-router';
import { useAuth0 } from '@auth0/auth0-react';
import { AppState } from '../../types/AppState';
import { NavigationButton, Sidebar } from '../Library';

interface SidebarProps {
  dispatch: Dispatch<any>;
}

const SidebarMenu = ({ dispatch }: SidebarProps) => {
  const { pathname: currentView } = useLocation();
  const history = useHistory();
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  const onClickHandler = (route: string) => {
    history.push(route);
    dispatch(switchView(route));
  };
  const { logout } = useAuth0();
  // TODO: add route to /personal again
  return (
    <Sidebar collapsed={!isOpen}>
      <IconButton
        aria-label="Open Menu"
        icon={isOpen ? <RiMenuFoldFill /> : <RiMenuUnfoldFill />}
        onClick={onToggle}
      />
      <NavigationButton
        variant="ghost"
        colorScheme="purple"
        aria-label="Home"
        leftIcon={<RiHomeFill />}
        key="/"
        onClick={() => onClickHandler('/')}
      >
        {isOpen ? 'Home' : null}
      </NavigationButton>
      <Divider />
      <NavigationButton
        variant="ghost"
        colorScheme="teal"
        aria-label="Team Calendar"
        leftIcon={<RiTeamFill />}
        key="/teamcal"
        onClick={() => onClickHandler('/teamcal')}
      >
        {isOpen ? 'Team' : null}
      </NavigationButton>
      <NavigationButton
        colorScheme="teal"
        variant="ghost"
        aria-label="Rooms"
        leftIcon={<RiCalendarEventFill />}
        key="/rooms"
        onClick={() => onClickHandler('/rooms')}
      >
        {isOpen ? 'Rooms' : null}
      </NavigationButton>
      <Divider />
      <NavigationButton
        variant="ghost"
        colorScheme="gray"
        aria-label="Team Settings"
        leftIcon={<RiUserSettingsFill />}
        key="/teamsettings"
        onClick={() => onClickHandler('/teamsettings')}
      >
        {isOpen ? 'Team Settings' : null}
      </NavigationButton>
      <NavigationButton
        colorScheme="gray"
        variant="ghost"
        aria-label="Employee Settings"
        leftIcon={<RiUserSettingsLine />}
        key="/employeesettings"
        onClick={() => onClickHandler('/employeesettings')}
      >
        {isOpen ? 'Employee Settings' : null}
      </NavigationButton>
      <NavigationButton
        colorScheme="gray"
        variant="ghost"
        aria-label="Profile"
        leftIcon={<RiProfileLine />}
        key="/profile"
        onClick={() => onClickHandler('/profile')}
      >
        {isOpen ? 'Profile' : null}
      </NavigationButton>
      <Divider />
      <NavigationButton
        key="/logout"
        colorScheme="orange"
        onClick={() => logout({ returnTo: window.location.origin })}
        variant="ghost"
        aria-label="Logout"
        leftIcon={<RiLogoutBoxLine />}
      >
        {isOpen ? 'Logout' : null}
      </NavigationButton>
    </Sidebar>
  );
};

const MapStateToProps = (state: AppState) => {
  return {
    currentView: state.settings.currentView,
    user: state.userData.currentUser,
  };
};

const MapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    switchView,
    dispatch,
  };
};

export default connect(MapStateToProps, MapDispatchToProps)(SidebarMenu);
