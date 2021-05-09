import React, { Dispatch, useEffect } from 'react';
import { Layout } from 'antd';
import AppMenu from '../components/AppMenu/AppMenu';
import Header from '../components/Header/Header';
import Dashboard from '../components/Dashboard/Dashboard';
import Footer from '../components/Footer/Footer';
import { connect } from 'react-redux';
import { useAuth0 } from '@auth0/auth0-react';
import { useAuth0User } from '../hooks/user';
import UserProfile from '../components/UserProfile/UserProfile';
import { logIn } from '../actions/actions';

const { Content: AntContent } = Layout;

interface AuthenticatedAppInputProps {
  userData: ()=>{};
  dispatch: Dispatch<any>;
}

function AuthenticatedApp ({ userData, dispatch }: AuthenticatedAppInputProps): JSX.Element {
  const { user: auth0User, isLoading } = useAuth0();
  const a0Id = auth0User.sub;
  const { user, isError } = useAuth0User(auth0User.sub);
  useEffect(() => {
    if (!user) return;
    dispatch(logIn(user));
  }, [user, dispatch]);
  if (isLoading) return <div>fetching Data</div>;

  return (
    <>
      <AppMenu />
      <Layout className="site-layout">
        <Header userName={!user ? 'new User' : user.firstName}/>
        <AntContent style={{ margin: '0 16px' }}>
          {isError ? <div>Error connecting to backend. Please try again later!</div> : !user ? <UserProfile purpose="new" a0Id={a0Id}/>: <Dashboard style={{ height: '100%' }} a0Id={a0Id} />}
        </AntContent>
        <Footer />
      </Layout>
    </>
  );
}

const MapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    logIn,
    dispatch
  };
};

export default connect(null,MapDispatchToProps)(AuthenticatedApp);
