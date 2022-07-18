import React, { Dispatch, useContext, useEffect } from 'react';
import Dashboard from '../components/Dashboard/Dashboard';
import { connect } from 'react-redux';
import { useUser } from '../hooks/user';
import { logIn } from '../actions/actions';
import {
  AppContainer,
  Header,
  Content,
  Footer,
  ContentContainer,
} from '../components/Library/AppLayout';
import SidebarMenu from '../components/SidebarMenu/SidebarMenu';
import NavBar from '../components/NavBar/NavBar';
import { logout } from '../services/Auth';
import { AuthContext } from '../providers/Auth';

interface AuthenticatedAppInputProps {
  id: string;
  dispatch: Dispatch<any>;
}

function AuthenticatedApp({
  id,
  dispatch,
}: AuthenticatedAppInputProps): JSX.Element {
  const { setIsAuthenticated, isLoading } = useContext(AuthContext);
  const { user, isError, error} = useUser(id);
  useEffect(() => {
    if (isError && !isLoading) {
      setIsAuthenticated(false);
      logout({returnTo: window.location.toString()});
    }
    if (!user) return;
    dispatch(logIn(user));
  }, [user, dispatch, isError, isLoading]);

  return (
    <>
      <AppContainer id="app">
        <SidebarMenu />
        <ContentContainer>
          <Header>
            <NavBar />
          </Header>
          <Content id="Content" pr={1}>
            {isError ? (
              <div className="error">an error occured</div>
            ) : (
              <Dashboard id={id} style={{ height: '100%' }} />
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
      </AppContainer>
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
