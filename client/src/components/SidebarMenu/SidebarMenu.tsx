import React, { BaseSyntheticEvent, Dispatch } from 'react';
import {
  TeamOutlined,
  SettingOutlined,
  HomeOutlined,
  LogoutOutlined,
  ProfileOutlined,
  FolderOpenOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
// import classes from './AppMenu.module.css';
import { connect } from 'react-redux';
import { switchView } from '../../actions/actions';
import { useHistory, useLocation } from 'react-router';
import { useAuth0 } from '@auth0/auth0-react';
import { AppState } from '../../types/AppState';
import { LocationDescriptor } from 'history';
import { Sidebar } from '../Library';

interface SidebarProps {
  // state: 'fullyVisible' | 'collapsedToIcons' | 'invisible';
  dispatch: Dispatch<any>;
}

const SidebarMenu = ({ dispatch }: SidebarProps) => {
  const { pathname: currentView } = useLocation();
  const history = useHistory();
  const onClickHandler = (e: BaseSyntheticEvent) => {
    console.log(e);
    // history.push(e.key);
    // dispatch(switchView(e.key));
  };
  const { logout } = useAuth0();
  // TODO: add route to /personal again
  return (
    <Sidebar>
      <h1>Menu</h1>
      <ul>
        <li key="/" onClick={onClickHandler}>
          {' '}
          Home
        </li>
        <li key="/teamcal" onClick={onClickHandler}>
          {' '}
          teamcal
        </li>
      </ul>
      {/*
      <Menu theme="dark" defaultSelectedKeys={[currentView]} mode="inline">
        <Menu.Item key="/" icon={<HomeOutlined />} onClick={onClickHandler}>
          {' '}
          Home
        </Menu.Item>
        <Menu.Item
          key="/rooms"
          icon={<FolderOpenOutlined />}
          onClick={onClickHandler}
        >
          {' '}
          Rooms{' '}
        </Menu.Item>
        <Menu.Item
          key="/teamcal"
          icon={<TeamOutlined />}
          onClick={onClickHandler}
        >
          {' '}
          Team Calendar{' '}
        </Menu.Item>
        <Menu.Item
          key="/teamsettings"
          icon={<SettingOutlined />}
          onClick={onClickHandler}
        >
          {' '}
          Team Settings
        </Menu.Item>
        <Menu.Item
          key="/employeesettings"
          icon={<SettingOutlined />}
          onClick={onClickHandler}
        >
          {' '}
          Employee Settings
        </Menu.Item>
        <Menu.Item
          key="/profile"
          icon={<ProfileOutlined />}
          onClick={onClickHandler}
        >
          {' '}
          Profile
        </Menu.Item>
        <Menu.Item
          key="/logout"
          icon={<LogoutOutlined />}
          onClick={() => logout({ returnTo: window.location.origin })}
        >
          {' '}
          LogOut
        </Menu.Item>
      </Menu> */}
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
