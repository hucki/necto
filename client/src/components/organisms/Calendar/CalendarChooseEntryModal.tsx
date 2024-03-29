import React from 'react';
import {
  Modal,
  ModalOverlay,
  Tag,
  useDisclosure,
  ModalBody,
  ModalContent,
  ModalHeader,
  Button,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useViewport } from '../../../hooks/useViewport';
import { Event, isLeave, Leave } from '../../../types/Event';
import dayjs from 'dayjs';

interface CalendarChooseEntryModalProps {
  events: (Event | Leave)[];
  // eslint-disable-next-line no-unused-vars
  handleChosenEvent: (e: Event) => void;
}

function CalendarChooseEntryModal({
  events,
  handleChosenEvent,
}: CalendarChooseEntryModalProps) {
  const { onClose } = useDisclosure();
  const { t } = useTranslation();
  const { isMobile } = useViewport();

  const eventButtons =
    events &&
    events.map((e) => {
      const startTimeString = `${dayjs(e.startTime).format('HH:mm')}`;
      const entryTitle = isLeave(e)
        ? t(`calendar.leave.type.${e.leaveType}`) +
          (e.leaveStatus === 'requested'
            ? ' (' + t(`calendar.leave.status.${e.leaveStatus}`) + ')'
            : '')
        : e.patient
        ? e.patient.lastName + ', ' + e.patient.firstName
        : e.title;
      return (
        <Button key={e.uuid} onClick={() => handleChosenEvent(e)}>
          {isLeave(e) ? (
            <>
              <Tag
                size="lg"
                variant="solid"
                colorScheme={
                  e.leaveType === 'sick' || e.leaveType === 'sickChild'
                    ? 'orange'
                    : 'teal'
                }
              >
                {t(`calendar.leave.type.${e.leaveType}`)}
              </Tag>
            </>
          ) : (
            <span>{startTimeString + ' - ' + entryTitle}</span>
          )}
        </Button>
      );
    });

  return (
    <>
      <Modal
        isOpen={Boolean(events && events.length > 0)}
        onClose={onClose}
        scrollBehavior="inside"
        size={isMobile ? 'full' : undefined}
      >
        <ModalOverlay
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          css={{
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
          <ModalContent>
            <ModalHeader>choose event</ModalHeader>
            <ModalBody
              style={{
                display: 'grid',
                gridAutoColumns: '1fr 1fr',
                gap: '1rem',
                maxHeight: `${events.length * 4}rem`,
              }}
            >
              {eventButtons}
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
}

export default CalendarChooseEntryModal;
