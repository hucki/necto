import React, { useState } from 'react';
import {
  App,
  ContentContainer,
} from '../components/Library';
import { Box, Stack, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import Login from '../views/Auth/Login';
import Register from '../views/Auth/Register';

function UnauthenticatedApp(): JSX.Element {
  const [ registrationActive, setRegistrationActive ] = useState(false);
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
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Login />
                </TabPanel>
                <TabPanel>
                  <Register />
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
