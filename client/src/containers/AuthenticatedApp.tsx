import React from 'react';
import { Layout } from 'antd';
import AppMenu from '../components/AppMenu/AppMenu';
import Header from '../components/Header/Header';
import Dashboard from '../components/Dashboard/Dashboard';
import Footer from '../components/Footer/Footer';
import { useAuth0 } from '@auth0/auth0-react';
import { useAuth0User } from '../hooks/user';

const { Content: AntContent } = Layout;

function AuthenticatedApp(): JSX.Element {
  const { user: auth0User } = useAuth0();
  const { user } = useAuth0User(auth0User.sub);
  console.log(user);
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
