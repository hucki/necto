import React from 'react';
import classes from './App.module.css';
import { Layout, Menu, Breadcrumb } from 'antd';
import Header from '../components/Header/Header';
import Dashboard from '../components/Dashboard/Dashboard';
import Footer from '../components/Footer/Footer';
import { createStore } from 'redux';
import reducer from '../reducers/index';
import { Provider } from 'react-redux';
import AppMenu from '../components/AppMenu/AppMenu';

const { Header: AntHeader, Content: AntContent, Footer: AntFooter, Sider: AntSider } = Layout;
const { SubMenu: AntSubMenu } = Menu;

const store = createStore(reducer);
store.subscribe(() => console.log('NEW STATE', store.getState()));
function App () {


  return (
    <Provider store = { store }>
      <Layout style={{ minHeight: '100vh' }}>
        <AppMenu />
        <Layout className="site-layout">
          <Header />
          <AntContent style={{ margin: '0 16px'}}>
            <Dashboard style={{ height: '100%' }}/>
          </AntContent>
          <Footer />
        </Layout>
      </Layout>
    </Provider>
  );
}

export default App;
