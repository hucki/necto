import { Button } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../providers/AuthProvider';

const LogoutButton = () => {
  const { t } = useTranslation();
  const { user, logMeOut } = useContext(AuthContext);

  return <>
    <Button
      aria-label="logout"
      type="button"
      colorScheme="red"
      onClick={logMeOut}
    >
      {t('menu.logout')}
    </Button>
  </>;
};

export default LogoutButton;