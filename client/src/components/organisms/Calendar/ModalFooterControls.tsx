import { Button } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';

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
          icon={<FaTimes />}
          aria-label="close modal"
          type="button"
          disabled={!onClose}
          onClick={onClose ? onClose : () => {}}
          size="sm"
          colorScheme="blue"
          variant="outline"
        >
          {t('button.close')}
        </Button>
        <Button
          aria-label="save changes"
          type="button"
          size="sm"
          colorScheme="blue"
          disabled={!onSubmit}
          onClick={onSubmit ? onSubmit : () => {}}
        >
          {t('button.save')}
        </Button>
      </div>
    </>
  );
};
