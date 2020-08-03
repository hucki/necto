import React from 'react';
import { DesktopOutlined, TeamOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu, Layout } from 'antd';
import classes from './AppMenu.module.css';
import { connect } from 'react-redux';
import { switchView } from '../../actions/actions';

const { Header: AntHeader, Content: AntContent, Footer: AntFooter, Sider: AntSider } = Layout;

const AppMenu = ({currentDate, currentView, dispatch}) => {

  const onClickHandler = (e) => {
    dispatch(switchView(e.key));
  };

  return (
    <AntSider collapsible collapsed={true} theme='light'>
      <h1 className={classes.logo}>necto</h1>
      <Menu theme='light' defaultSelectedKeys={[currentView]} mode="inline">
        <Menu.Item key='Appointments' icon={<DesktopOutlined />} onClick={onClickHandler}> Appointments</Menu.Item>
        <Menu.Item key='Team' icon={<TeamOutlined />} onClick={onClickHandler}> Team </Menu.Item>
        <Menu.Item key='Settings' icon={<SettingOutlined />} onClick={onClickHandler}> Settings </Menu.Item>
      </Menu>
    </AntSider>
  )
}

const MapStateToProps = state => {
  return {
    currentDate: state.current.currentDate,
    currentView: state.settings.currentView
  };
};

const MapDispatchToProps = dispatch => {
  return {
    switchView,
    dispatch
  };
};


export default connect(MapStateToProps, MapDispatchToProps)(AppMenu);