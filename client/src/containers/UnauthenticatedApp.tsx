import React, { useState } from 'react';
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
  const [ resetActive, setResetActive ] = useState(false);
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
            <Tabs>
              <TabList>
                <Tab>
                  Login
                </Tab>
                <Tab>
                  Register
                </Tab>
                <Tab>
                  Reset Password
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Login />
                  <Button type='reset' onClick={() => setResetActive(true)}>Forgot Password? Click here!</Button>
                </TabPanel>
                <TabPanel>
                  <Register />
                </TabPanel>
                <TabPanel>
                  <ResetPassword />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Stack>
        </Box>
      </ContentContainer>
    </App>
  );
}

export default UnauthenticatedApp;
