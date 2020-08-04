import React from 'react';
import { DesktopOutlined, TeamOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Menu, Layout } from 'antd';
import classes from './AppMenu.module.css';
import { connect } from 'react-redux';
import { switchView } from '../../actions/actions';

const { Sider: AntSider } = Layout;

const AppMenu = ({currentDate, currentView, user, dispatch}) => {

  const onClickHandler = (e) => {
    dispatch(switchView(e.key));
  };

  return (
    <AntSider
      collapsible
      theme='dark'
      breakpoint='lg'
      collapsedWidth='0'
      >
      <h1 className={classes.menu}>Menu</h1>
      <Menu theme='dark' defaultSelectedKeys={[currentView]} mode="inline">
        <Menu.Item key='Appointments' icon={<DesktopOutlined />} onClick={onClickHandler}> Appointments</Menu.Item>
        {user !== 'Guest' && <Menu.Item key='Personal' icon={<UserOutlined />} onClick={onClickHandler}> Personal Calendar </Menu.Item>}
        <Menu.Item key='Team' icon={<TeamOutlined />} onClick={onClickHandler}> Team Member</Menu.Item>
        <Menu.Item disabled key='Settings' icon={<SettingOutlined />} onClick={onClickHandler}> Settings </Menu.Item>
      </Menu>
    </AntSider>
  )
}

const MapStateToProps = state => {
  return {
    currentDate: state.current.currentDate,
    currentView: state.settings.currentView,
    user: state.userData.currentUser
  };
};

const MapDispatchToProps = dispatch => {
  return {
    switchView,
    dispatch
  };
};


export default connect(MapStateToProps, MapDispatchToProps)(AppMenu);