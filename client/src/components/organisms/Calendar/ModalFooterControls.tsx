import { Button } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';
import { IconButton } from '../../atoms/Buttons';

interface ModalFooterControlsProps {
  onSubmit?: () => void;
  onClose?: () => void;
}

export const ModalFooterControls = ({
  onSubmit,
  onClose,
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
          disabled={!onClose}
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
          disabled={!onSubmit}
          onClick={onSubmit ? onSubmit : () => console.log('not implemented')}
        >
          {t('button.save')}
        </Button>
      </div>
    </>
  );
};
