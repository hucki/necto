import React, { useEffect, useState } from 'react';
import { AppContainer, ContentContainer } from '../components/Library';
import {
  Box,
  Button,
  Heading,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import LoginForm from '../components/organisms/Auth/LoginForm';
import Register from '../components/organisms/Auth/Register';
import ForgotPassword from '../components/organisms/Auth/ForgotPassword';
import { useTranslation } from 'react-i18next';
import LogoIcon from '../components/molecules/Logo/LogoIcon';
import { useViewport } from '../hooks/useViewport';
import ErrorBoundary from '../components/molecules/Error/ErrorBoundary';
import { Route, Routes } from 'react-router-dom';
import ResetPassword from '../components/organisms/Auth/ResetPassword';

function UnauthenticatedApp(): JSX.Element {
  const { t } = useTranslation();
  const { isMobile } = useViewport();
  const [tabIndex, setTabIndex] = useState(0);
  const [resetActive, setResetActive] = useState(false);
  const resetTabIndex = 2;

  const handleForgotPassword = () => {
    setResetActive(true);
    setTabIndex(resetTabIndex);
  };
  const hasForgotPassword = () => {
    setTabIndex(0);
    setResetActive(false);
  };
  useEffect(() => {
    if (tabIndex !== resetTabIndex) {
      setResetActive(false);
    }
  }, [tabIndex]);

  const LoginTabs = () => {
    return (
      <>
        <Heading as="h1" size="lg">
          {t('auth.welcome')}
        </Heading>
        <Tabs index={tabIndex} onChange={(index) => setTabIndex(index)}>
          <TabList>
            <Tab>{t('auth.login')}</Tab>
            <Tab>{t('auth.register')}</Tab>
            {resetActive && <Tab>{t('auth.resetPassword')}</Tab>}
          </TabList>
          <TabPanels>
            <TabPanel p="0">
              <ErrorBoundary>
                <LoginForm />
              </ErrorBoundary>
              <Button w="100%" type="reset" onClick={handleForgotPassword}>
                {t('auth.forgotPassword')}
              </Button>
            </TabPanel>
            <TabPanel p="0">
              <Register onHasRegistered={() => setTabIndex(0)} />
            </TabPanel>
            {resetActive && (
              <TabPanel p="0">
                <ForgotPassword onSubmit={hasForgotPassword} />
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </>
    );
  };
  return (
    <AppContainer id="App">
      <ContentContainer alignItems="center" justifyContent="center">
        <Box
          style={{ gridArea: 'content', backgroundColor: 'white' }}
          rounded="lg"
          boxShadow="lg"
          p="8"
          w={isMobile ? 'full' : undefined}
          h={isMobile ? 'full' : undefined}
        >
          <Stack spacing="4" alignItems="center">
            <LogoIcon />
            <Routes>
              <Route path="/resetpassword/:token" element={<ResetPassword />} />
              <Route path="*" element={<LoginTabs />} />
            </Routes>
          </Stack>
        </Box>
      </ContentContainer>
    </AppContainer>
  );
}

export default UnauthenticatedApp;
