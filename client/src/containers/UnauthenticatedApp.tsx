import React from 'react';
import LoginButton from '../components/Auth/LoginButton';
import { Route, Switch } from 'react-router';
import VerifySignup from '../components/Auth/VerifySignup';
import { useAuth0 } from '@auth0/auth0-react';
import {
  App,
  ContentContainer,
  FullPageSpinner,
  Header,
} from '../components/Library';
import UserInfo from '../components/UserInfo/UserInfo';
import { Box, Stack } from '@chakra-ui/react';

function UnauthenticatedApp(): JSX.Element {
  const { isLoading } = useAuth0();
  return (
    <App id="App">
      <ContentContainer alignItems="center" justifyContent="center">
        <Box
          rounded="lg"
          boxShadow="lg"
          p="8"
        >
          <Stack spacing="4">
            <UserInfo userName="Guest" />
            {isLoading ? (
              <FullPageSpinner />
            ) : (
              <Switch>
                <Route path="/verify">
                  <VerifySignup />
                </Route>
                <Route path="*">
                  <h1>Welcome</h1>
                  <div>Please login</div>
                  <LoginButton />
                </Route>
              </Switch>
            )}
          </Stack>
        </Box>
      </ContentContainer>
    </App>
  );
}

export default UnauthenticatedApp;
