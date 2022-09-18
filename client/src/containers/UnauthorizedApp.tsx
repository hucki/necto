import React from 'react';
import { AppContainer, ContentContainer } from '../components/Library';
import { Box, Heading, Stack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import LogoIcon from '../components/Logo/LogoIcon';
import { useViewport } from '../hooks/useViewport';
import LogoutButton from '../components/Auth/LogoutButton';

function UnauthorizedApp(): JSX.Element {
  const { t } = useTranslation();
  const { isMobile } = useViewport();

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
            <div>{t('auth.notYetAuthorized')}</div>
            <LogoutButton />
          </Stack>
        </Box>
      </ContentContainer>
    </AppContainer>
  );
}

export default UnauthorizedApp;
