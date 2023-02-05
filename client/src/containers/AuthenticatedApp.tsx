import React, { useContext, useEffect, useState } from 'react';
import Dashboard from '../components/organisms/Dashboard/Dashboard';
import { useUser } from '../hooks/user';
import { logIn } from '../actions/actions';
import {
  AppContainer,
  Header,
  Content,
  Footer,
  ContentContainer,
} from '../components/Library/AppLayout';
import { logout } from '../services/Auth';
import { AuthContext } from '../providers/AuthProvider';
import ErrorBoundary from '../components/molecules/Error/ErrorBoundary';
import SideNav from '../components/organisms/SideNav/SideNav';
import HeaderBar from '../components/organisms/HeaderBar/HeaderBar';
import { useDispatch } from 'react-redux';
import { NavToggle } from '../components/molecules/Nav/NavToggle';

interface AuthenticatedAppInputProps {
  id: string;
}

function AuthenticatedApp({ id }: AuthenticatedAppInputProps): JSX.Element {
  const dispatch = useDispatch();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { setIsAuthenticated, isLoading } = useContext(AuthContext);
  const { user, isError } = useUser(id);
  useEffect(() => {
    if (isError && !isLoading) {
      setIsAuthenticated(false);
      logout({ returnTo: window.location.toString() });
    }
    if (!user) return;
    dispatch(logIn(user));
  }, [user, dispatch, isError, isLoading]);

  return (
    <>
      <AppContainer id="app">
        <NavToggle
          isOpen={isNavOpen}
          onClose={() => setIsNavOpen(false)}
          onOpen={() => setIsNavOpen(true)}
        />
        <SideNav isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
        <ErrorBoundary>
          <ContentContainer>
            <Header>
              <HeaderBar />
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

export default AuthenticatedApp;
