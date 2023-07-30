import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface AlertProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: 'isDone';
}
export const Alert = ({
  isOpen,
  onClose,
  onConfirm,
  type = 'isDone',
}: AlertProps) => {
  const cancelRef = React.useRef(null);
  const { t } = useTranslation();

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {t(`alert.${type}.dialogHeader`)}
          </AlertDialogHeader>

          <AlertDialogBody>{t(`alert.${type}.dialogBody`)}</AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              {t('button.cancel')}
            </Button>
            <Button colorScheme="red" onClick={onConfirm} ml={3}>
              {t(`alert.${type}.dialogConfirm`)}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
