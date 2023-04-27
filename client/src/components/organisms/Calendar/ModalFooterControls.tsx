import { Button } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';

interface ModalFooterControlsProps {
  isDisabled?: boolean;
  onSubmit?: () => void;
  onClose?: () => void;
}

export const ModalFooterControls = ({
  onSubmit,
  onClose,
  isDisabled = false,
}: ModalFooterControlsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div
        className="row"
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'end',
        }}
      >
        <Button
          leftIcon={<FaTimes />}
          aria-label="cancel modal"
          type="button"
          isDisabled={isDisabled || !onClose}
          onClick={onClose ? onClose : () => console.log('not implemented')}
          size="sm"
        >
          {t('button.cancel')}
        </Button>
        <Button
          aria-label="save changes"
          type="button"
          size="sm"
          colorScheme="blue"
          isDisabled={isDisabled || !onSubmit}
          onClick={onSubmit ? onSubmit : () => console.log('not implemented')}
        >
          {t('button.save')}
        </Button>
      </div>
    </>
  );
};
