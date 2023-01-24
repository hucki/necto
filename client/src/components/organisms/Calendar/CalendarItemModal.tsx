import { Modal, ModalOverlay } from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import { useViewport } from '../../../hooks/useViewport';
import { ModalBody, ModalContent, ModalHeader } from '../../Library';
import { ModalFooter } from '../../Library/Modal';

interface CalendarItemModalProps {
  isOpen: boolean;
  modalHeader: ReactElement;
  modalBody: ReactElement;
  modalFooter: ReactElement;
  onClose: () => void;
  headerBgColor?: string;
  bodyBgColor?: string;
  footerBgColor?: string;
  scrollBehavior?: 'inside' | 'outside';
  size?: string;
}

const CalendarItemModal = ({
  isOpen,
  onClose,
  modalHeader,
  modalBody,
  modalFooter,
  headerBgColor,
  bodyBgColor,
  footerBgColor,
  scrollBehavior = 'inside',
  size,
}: CalendarItemModalProps) => {
  const { isMobile } = useViewport();
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior={scrollBehavior}
        size={size}
      >
        <ModalOverlay
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
        >
          <ModalContent>
            <ModalHeader bgColor={headerBgColor}>{modalHeader}</ModalHeader>
            <ModalBody bgColor={bodyBgColor}>{modalBody}</ModalBody>
            <ModalFooter
              mb={isMobile ? '1rem' : undefined}
              bgColor={footerBgColor}
            >
              {modalFooter}
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
};

export default CalendarItemModal;
