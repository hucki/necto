import { Button } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

const RefreshButton = () => {
  const { t } = useTranslation();
  const refreshPage = () => {
    window.location.reload();
  };
  return (
    <>
      <Button
        aria-label="refresh"
        type="button"
        colorScheme="orange"
        onClick={refreshPage}
      >
        {t('menu.refresh')}
      </Button>
    </>
  );
};

export default RefreshButton;
