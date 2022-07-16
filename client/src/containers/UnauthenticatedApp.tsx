import React, { useEffect, useState } from 'react';
import {
  AppContainer,
  Button,
  ContentContainer,
} from '../components/Library';
import { Box, Heading, Stack, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import Login from '../views/Auth/Login';
import Register from '../views/Auth/Register';
import ResetPassword from '../views/Auth/ResetPassword';
import { useTranslation } from 'react-i18next';
import LogoIcon from '../components/Logo/LogoIcon';
import { useViewport } from '../hooks/useViewport';

function UnauthenticatedApp(): JSX.Element {
  const { t } = useTranslation();
  const { isMobile } = useViewport();
  const [ registrationActive, setRegistrationActive ] = useState(false);
  const [ tabIndex, setTabIndex ] = useState(0);
  const [ resetActive, setResetActive ] = useState(false);
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
          w={isMobile ? 'full': undefined}
          h={isMobile ? 'full': undefined}
        >
          <Stack spacing="4">
            <LogoIcon />
            <Heading as="h1" size="lg">{t('auth.welcome')}</Heading>

            <Tabs index={tabIndex} onChange={(index) => setTabIndex(index)}>
              <TabList>
                <Tab>
                  {t('auth.login')}
                </Tab>
                <Tab>
                  {t('auth.register')}
                </Tab>
                {
                  resetActive &&
                (<Tab>
                  {t('auth.resetPassword')}
                </Tab>)
                }
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Login />
                  <Button w="100%" type='reset' onClick={handleResetPassword}>{t('auth.forgotPassword')}</Button>
                </TabPanel>
                <TabPanel>
                  <Register />
                </TabPanel>
                {
                  resetActive &&
                (<TabPanel>
                  <ResetPassword onSubmit={hasResetPassword}/>
                </TabPanel>)
                }
              </TabPanels>
            </Tabs>
          </Stack>
        </Box>
      </ContentContainer>
    </AppContainer>
  );
}

export default UnauthenticatedApp;
