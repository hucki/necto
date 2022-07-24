import React, { Dispatch, useContext, useEffect, useState } from 'react';
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
import NavBar from '../components/NavBar/NavBar';
import { logout } from '../services/Auth';
import { AuthContext } from '../providers/AuthProvider';
import ErrorBoundary from '../components/Error/ErrorBoundary';
import SideNav from '../components/SideNav/SideNav';

interface AuthenticatedAppInputProps {
  id: string;
  dispatch: Dispatch<any>;
}

function AuthenticatedApp({
  id,
  dispatch,
}: AuthenticatedAppInputProps): JSX.Element {
  const [isNavOpen, setIsNavOpen] = useState(true);
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
        <SideNav isOpen={isNavOpen} onClose={() => setIsNavOpen(false)}/>
        <ErrorBoundary>
          <ContentContainer>
            <Header>
              <NavBar isSideNavOpen={isNavOpen} onSideNavOpen={() => setIsNavOpen(true)}/>
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
        </ErrorBoundary>
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
