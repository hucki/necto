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
import LoginForm from '../views/Auth/LoginForm';
import Register from '../views/Auth/Register';
import ResetPassword from '../views/Auth/ResetPassword';
import { useTranslation } from 'react-i18next';
import LogoIcon from '../components/molecules/Logo/LogoIcon';
import { useViewport } from '../hooks/useViewport';
import ErrorBoundary from '../components/molecules/Error/ErrorBoundary';

function UnauthenticatedApp(): JSX.Element {
  const { t } = useTranslation();
  const { isMobile } = useViewport();
  const [registrationActive, setRegistrationActive] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [resetActive, setResetActive] = useState(false);
  const resetTabIndex = 2;

  const handleResetPassword = () => {
    setResetActive(true);
    setTabIndex(resetTabIndex);
  };
  const hasResetPassword = () => {
    setTabIndex(0);
    setResetActive(false);
  };
  useEffect(() => {
    if (tabIndex !== resetTabIndex) {
      setResetActive(false);
    }
  }, [tabIndex]);
  return (
    <AppContainer id="App">
      <ContentContainer alignItems="center" justifyContent="center">
        <Box
          rounded="lg"
          boxShadow="lg"
          p="8"
          w={isMobile ? 'full' : undefined}
          h={isMobile ? 'full' : undefined}
        >
          <Stack spacing="4" alignItems="center">
            <LogoIcon />
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
                  <Button w="100%" type="reset" onClick={handleResetPassword}>
                    {t('auth.forgotPassword')}
                  </Button>
                </TabPanel>
                <TabPanel p="0">
                  <Register onHasRegistered={() => setTabIndex(0)} />
                </TabPanel>
                {resetActive && (
                  <TabPanel p="0">
                    <ResetPassword onSubmit={hasResetPassword} />
                  </TabPanel>
                )}
              </TabPanels>
            </Tabs>
          </Stack>
        </Box>
      </ContentContainer>
    </AppContainer>
  );
}

export default UnauthenticatedApp;
