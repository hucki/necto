import { Icon, Modal, Button } from '@chakra-ui/react';
import dayjs from 'dayjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaTimes, FaTrash } from 'react-icons/fa';
import { RiCheckFill } from 'react-icons/ri';
import { getEventSeries } from '../../../helpers/dataConverter';
import { useDeleteEventWithChildren } from '../../../hooks/events';
import { useViewport } from '../../../hooks/useViewport';
import { Leave } from '../../../types/Event';
import { IconButton } from '../../atoms/Buttons';
import { ControlWrapper } from '../../atoms/Wrapper';
import {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '../../Library';

interface CalendarLeaveEditProps {
  leave: Leave;
  isOpen: boolean;
  onClose: () => void;
}

function CalendarLeaveEdit({ leave, isOpen, onClose }: CalendarLeaveEditProps) {
  const { t } = useTranslation();
  const { isMobile } = useViewport();

  const { mutateAsync: deleteEventWithChildren } = useDeleteEventWithChildren();
  const { startTime, endTime, parentEventId } = getEventSeries(leave);

  const handleDelete = () => {
    if (!parentEventId) return;
    deleteEventWithChildren({ uuid: parentEventId });
    onClose();
  };

  const isApproved = leave.leaveStatus === 'approved';
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior="inside"
        size={isMobile ? 'full' : undefined}
      >
        <ModalOverlay
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
        >
          <ModalContent>
            <ModalHeader bgColor={leave?.bgColor || 'green'}>
              {!isApproved ? null : (
                <Icon as={RiCheckFill} w={8} h={8} fill="green" />
              )}
              <div>
                <div className="modal-title">
                  {t(`calendar.leave.type.${leave.leaveType}`)}
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
                    disabled={isApproved || !parentEventId}
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
