import React, { Dispatch, useEffect } from 'react';
import { Layout } from 'antd';
import AppMenu from '../components/AppMenu/AppMenu';
import Header from '../components/Header/Header';
import Dashboard from '../components/Dashboard/Dashboard';
import Footer from '../components/Footer/Footer';
import { connect } from 'react-redux';
import { User } from '@auth0/auth0-react';
import { useAuth0User } from '../hooks/user';
import UserProfile from '../components/UserProfile/UserProfile';
import { logIn } from '../actions/actions';

const { Content: AntContent } = Layout;

interface AuthenticatedAppInputProps {
  a0Id: string;
  dispatch: Dispatch<any>;
}

function AuthenticatedApp({
  a0Id,
  dispatch,
}: AuthenticatedAppInputProps): JSX.Element {
  const { user, isError } = useAuth0User(a0Id);
  useEffect(() => {
    if (!user) return;
    dispatch(logIn(user));
  }, [user, dispatch]);

  return (
    <>
      <AppMenu />
      <Layout className="site-layout">
        <Header userName={!user ? 'new User' : user.firstName} />
        <AntContent style={{ margin: '0 16px' }}>
          {isError ? (
            <div>Error connecting to backend. Please try again later!</div>
          ) : !user ? (
            <UserProfile purpose="new" a0Id={a0Id} />
          ) : (
            <Dashboard style={{ height: '100%' }} a0Id={a0Id} />
          )}
        </AntContent>
        <Footer />
      </Layout>
    </>
  );
}

const MapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    logIn,
    dispatch,
  };
};

export default connect(null, MapDispatchToProps)(AuthenticatedApp);
