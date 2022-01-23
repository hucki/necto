import React from 'react';
import {
  TeamOutlined,
  SettingOutlined,
  HomeOutlined,
  LogoutOutlined,
  ProfileOutlined,
  FolderOpenOutlined,
} from '@ant-design/icons';
import { Menu, Layout } from 'antd';
import classes from './AppMenu.module.css';
import { connect } from 'react-redux';
import { switchView } from '../../actions/actions';
import { useHistory, useLocation } from 'react-router';
import { useAuth0 } from '@auth0/auth0-react';
const { Sider: AntSider } = Layout;

const AppMenu = ({ dispatch }) => {
  const { pathname: currentView } = useLocation();
  const history = useHistory();
  const onClickHandler = (e) => {
    history.push(e.key);
    dispatch(switchView(e.key));
  };
  const { logout } = useAuth0();
  // TODO: add route to /personal again
  return (
    <AntSider collapsible theme="dark" breakpoint="lg" collapsedWidth="0">
      <h1 className={classes.menu}>Menu</h1>
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
        {/* <Menu.Item
          disabled
          key="/settings"
          icon={<SettingOutlined />}
          onClick={onClickHandler}
        >
          {' '}
          Settings{' '}
        </Menu.Item> */}
      </Menu>
    </AntSider>
  );
};

const MapStateToProps = (state) => {
  return {
    // currentDate: state.current.currentDate,
    currentView: state.settings.currentView,
    user: state.userData.currentUser,
  };
};

const MapDispatchToProps = (dispatch) => {
  return {
    switchView,
    dispatch,
  };
};

export default connect(MapStateToProps, MapDispatchToProps)(AppMenu);
