import React, { useEffect, useState } from 'react';
import {
  App,
  Button,
  ContentContainer,
} from '../components/Library';
import { Box, Stack, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import Login from '../views/Auth/Login';
import Register from '../views/Auth/Register';
import ResetPassword from '../views/Auth/ResetPassword';

function UnauthenticatedApp(): JSX.Element {
  const [ registrationActive, setRegistrationActive ] = useState(false);
  const [ tabIndex, setTabIndex ] = useState(0);
  const [ resetActive, setResetActive ] = useState(false);

  const handleResetPassword = () => {
    setResetActive(true);
    setTabIndex(2);
  };
  const hasResetPassword = () => {
    setTabIndex(0);
    setResetActive(false);
  };
  return (
    <App id="App">
      <ContentContainer alignItems="center" justifyContent="center">
        <Box
          rounded="lg"
          boxShadow="lg"
          p="8"
        >
          <Stack spacing="4">
            <h1>Welcome</h1>
            <Tabs index={tabIndex} onChange={(index) => setTabIndex(index)}>
              <TabList>
                <Tab>
                  Login
                </Tab>
                <Tab>
                  Register
                </Tab>
                {
                  resetActive &&

                (<Tab>
                  Reset Password
                </Tab>)
                }
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Login />
                  <Button type='reset' onClick={handleResetPassword}>Forgot Password? Click here!</Button>
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
    </App>
  );
}

export default UnauthenticatedApp;
