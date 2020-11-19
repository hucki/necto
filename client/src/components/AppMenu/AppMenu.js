import React from 'react';
import {
  TeamOutlined,
  SettingOutlined,
  UserOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { Menu, Layout } from 'antd';
import classes from './AppMenu.module.css';
import { connect } from 'react-redux';
import { switchView } from '../../actions/actions';
import { useHistory, useLocation } from 'react-router';

const { Sider: AntSider } = Layout;

const AppMenu = ({ currentDate, user, dispatch }) => {
  const {pathname: currentView} = useLocation();
  const history = useHistory();
  const onClickHandler = (e) => {
    history.push(e.key)
    dispatch(switchView(e.key));
  };

  return (
    <AntSider collapsible theme="dark" breakpoint="lg" collapsedWidth="0">
      <h1 className={classes.menu}>Menu</h1>
      <Menu theme="dark" defaultSelectedKeys={[currentView]} mode="inline">
        <Menu.Item
          key="/"
          icon={<HomeOutlined />}
          onClick={onClickHandler}
        >
          {' '}
          Home
        </Menu.Item>
        <Menu.Item
          key="/appointments"
          icon={<TeamOutlined />}
          onClick={onClickHandler}
        >
          {' '}
          Team Calendar{' '}
        </Menu.Item>
        {user !== 'Guest' && (
          <Menu.Item
            key="/personal"
            icon={<UserOutlined />}
            onClick={onClickHandler}
          >
            {' '}
            Personal Calendar{' '}
          </Menu.Item>
        )}
        <Menu.Item key="/team" icon={<SettingOutlined />} onClick={onClickHandler}>
          {' '}
          Settings
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
    currentDate: state.current.currentDate,
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
