import React from 'react';
import {
  App,
  ContentContainer,
} from '../components/Library';
import { Box, Stack } from '@chakra-ui/react';
import Login from '../views/Auth/Login';

function UnauthenticatedApp(): JSX.Element {
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
            <div>Please login</div>
            <Login />
          </Stack>
        </Box>
      </ContentContainer>
    </App>
  );
}

export default UnauthenticatedApp;
