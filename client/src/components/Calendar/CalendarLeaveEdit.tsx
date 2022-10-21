import { Icon, Modal, ModalOverlay } from '@chakra-ui/react';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaEdit, FaTimes, FaTrash } from 'react-icons/fa';
import { RiCheckboxBlankLine, RiCheckFill } from 'react-icons/ri';
import { useViewport } from '../../hooks/useViewport';
import { Event } from '../../types/Event';
import {
  Button,
  ControlWrapper,
  IconButton,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '../Library';

interface CalendarLeaveEditProps {
  leave: Event;
  isOpen: boolean;
  readOnly: boolean;
  onOpen: () => void;
  onClose: () => void;
}

function CalendarLeaveEdit({
  leave,
  isOpen,
  readOnly = false,
  onOpen,
  onClose,
}: CalendarLeaveEditProps) {
  const { t } = useTranslation();
  const { isMobile } = useViewport();
  const [isReadOnly, setIsReadOnly] = useState<boolean>(readOnly);

  const [changedLeave, setChangedLeave] = useState<Event>(() => leave);

  const handleAppprove = () => {
    console.log('approve');
  };
  const handleDelete = () => {
    console.log('delete');
  };
  const handleSubmit = () => {
    console.log('submit');
  };

  const isApproved = changedLeave.leaveStatus === 'approved';
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior="inside"
        size={isMobile ? 'full' : undefined}
      >
        <ModalOverlay
          css={{
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
          <ModalContent>
            <ModalHeader bgColor={changedLeave?.bgColor || 'green'}>
              {!isApproved ? (
                <IconButton
                  aria-label="set isApproved"
                  disabled={dayjs(changedLeave.endTime).isBefore(dayjs())}
                  icon={<RiCheckboxBlankLine />}
                  onClick={handleAppprove}
                />
              ) : (
                <Icon as={RiCheckFill} w={8} h={8} fill="green" />
              )}
              <div>
                <div className="modal-title">
                  {t(`calendar.leave.type.${changedLeave.leaveType}`)}
                </div>
                <div
                  className="modal-subtitle"
                  style={{
                    fontSize: '0.8rem',
                  }}
                >
                  {dayjs(leave.startTime).format('ll')}
                </div>
              </div>
              <IconButton
                aria-label="close modal"
                icon={<FaTimes />}
                onClick={onClose}
              />
            </ModalHeader>
            <ModalBody>This is the ModalBody</ModalBody>

            <ModalFooter>
              <div
                className="row"
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <ControlWrapper>
                  <Button
                    leftIcon={<FaTrash />}
                    aria-label="delete event"
                    disabled={
                      dayjs(changedLeave.endTime).isBefore(dayjs()) ||
                      isApproved
                    }
                    colorScheme="red"
                    size="sm"
                    type="button"
                    onClick={handleDelete}
                  >
                    {t('button.delete')}
                  </Button>
                </ControlWrapper>
                <ControlWrapper>
                  {isReadOnly ? (
                    <Button
                      leftIcon={<FaEdit />}
                      aria-label="edit event"
                      type="button"
                      onClick={() => setIsReadOnly(!isReadOnly)}
                      colorScheme="blue"
                      size="sm"
                    >
                      {t('button.edit')}
                    </Button>
                  ) : (
                    <Button
                      aria-label="save changes"
                      type="button"
                      disabled={isReadOnly}
                      onClick={handleSubmit}
                      size="sm"
                      colorScheme="blue"
                    >
                      {t('button.save')}
                    </Button>
                  )}
                </ControlWrapper>
              </div>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
}

export default CalendarLeaveEdit;
