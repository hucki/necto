import React from 'react';
import { Layout } from 'antd';
import AppMenu from '../components/AppMenu/AppMenu';
import Header from '../components/Header/Header';
import Dashboard from '../components/Dashboard/Dashboard';
import Footer from '../components/Footer/Footer';

const { Content: AntContent } = Layout;

function AuthenticatedApp(): JSX.Element {
  return (
    <>
    <AppMenu />
      <Layout className="site-layout">
        <Header />
        <AntContent style={{ margin: '0 16px' }}>
          <Dashboard style={{ height: '100%' }} />
        </AntContent>
        <Footer />
      </Layout>
    </>
  );
}

export default AuthenticatedApp;
