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
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useColorModeValue } from '@chakra-ui/react';

interface AuthenticatedAppInputProps {
  id: string;
}

function AuthenticatedApp({ id }: AuthenticatedAppInputProps): JSX.Element {
  const { pathname: currentView } = useLocation();
  // Here's the signature
  const bgHeader = useColorModeValue('linen', 'black');
  const bgMain = useColorModeValue('white', 'gray');
  const { t } = useTranslation();
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
            <Header bg={bgHeader}>
              <HeaderBar />
            </Header>
            <Content id="Content" pr={1} bg={bgMain}>
              {isError ? (
                <div className="error">an error occured</div>
              ) : (
                <Dashboard id={id} style={{ height: '100%' }} />
              )}
            </Content>
            <Footer bg={bgHeader}>
              <p>
                {' '}
                {currentView.length && (
                  <b>/ {t(`menu.${currentView.toString().substring(1)}`)}</b>
                )}
              </p>
              <p>
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
