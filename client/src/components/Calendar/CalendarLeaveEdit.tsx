import { Icon, Modal, Button } from '@chakra-ui/react';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTimes, FaTrash } from 'react-icons/fa';
import { RiCheckFill } from 'react-icons/ri';
import { getEventSeries } from '../../helpers/dataConverter';
import { useDeleteEventWithChildren } from '../../hooks/events';
import { useViewport } from '../../hooks/useViewport';
import { Event } from '../../types/Event';
import { IconButton } from '../atoms/Buttons';
import { ControlWrapper } from '../atoms/ControlWrapper';
import {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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

  const [changedLeave, setChangedLeave] = useState<Event>(() => leave);
  const [deleteEventWithChildren] = useDeleteEventWithChildren();
  const { startTime, endTime, parentEventId } = getEventSeries(changedLeave);

  const handleDelete = () => {
    if (!parentEventId) return;
    deleteEventWithChildren({ uuid: parentEventId });
    onClose();
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
        <ModalOverlay>
          <ModalContent>
            <ModalHeader bgColor={changedLeave?.bgColor || 'green'}>
              {!isApproved ? null : (
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
                  {dayjs(startTime).format('ll') === dayjs(endTime).format('ll')
                    ? dayjs(startTime).format('ll')
                    : dayjs(startTime).format('ll') +
                      ' - ' +
                      dayjs(endTime).format('ll')}
                </div>
              </div>
              <IconButton
                aria-label="close modal"
                icon={<FaTimes />}
                onClick={onClose}
              />
            </ModalHeader>
            <ModalBody></ModalBody>

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
                      isApproved ||
                      !parentEventId ||
                      dayjs(changedLeave.endTime).isBefore(dayjs())
                    }
                    colorScheme="red"
                    size="sm"
                    type="button"
                    onClick={handleDelete}
                  >
                    {t('button.delete')}
                  </Button>
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
