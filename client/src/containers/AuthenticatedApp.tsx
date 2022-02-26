import React, { Dispatch, useEffect } from 'react';
import Dashboard from '../components/Dashboard/Dashboard';
import { connect } from 'react-redux';
import { useAuth0User } from '../hooks/user';
import UserProfile from '../components/UserProfile/UserProfile';
import { logIn } from '../actions/actions';
import {
  App,
  Header,
  Content,
  Footer,
  ContentContainer,
} from '../components/Library/AppLayout';
import SidebarMenu from '../components/SidebarMenu/SidebarMenu';
import UserInfo from '../components/UserInfo/UserInfo';
import NavBar from '../components/NavBar/NavBar';

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
      <App id="app">
        <SidebarMenu />
        <ContentContainer>
          <Header>
            <UserInfo userName={user?.firstName || 'new User'} />
            <NavBar />
          </Header>
          <Content id="Content" bg="whitesmoke" p={2}>
            {isError ? (
              <div>Error connecting to backend. Please try again later!</div>
            ) : !user ? (
              <UserProfile purpose="new" a0Id={a0Id} />
            ) : (
              <Dashboard style={{ height: '100%' }} a0Id={a0Id} />
            )}
          </Content>
          <Footer>
            <p>
              made with{' '}
              <span role="img" aria-label="pineapple">
                🍍
              </span>
              <span role="img" aria-label="pizza">
                🍕
              </span>{' '}
              by Hucki
            </p>
          </Footer>
        </ContentContainer>
      </App>
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
