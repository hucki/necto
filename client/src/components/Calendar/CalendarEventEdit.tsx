/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useTranslation } from 'react-i18next';
import { Modal, ModalOverlay, ModalFooter, IconButton } from '@chakra-ui/react';
import { useState } from 'react';
import {
  Button,
  ControlWrapper,
  ErrorMessage,
  EventModalBody,
  EventModalContent,
  EventModalHeader,
  // RadioGroup,
} from '../Library';
import dayjs from 'dayjs';
import 'dayjs/locale/de';
import {
  useDaysEvents,
  useDeleteEvent,
  useUpdateEvent,
} from '../../hooks/events';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Event } from '../../types/Event';
import { FaHouseUser, FaLink, FaEdit, FaTimes, FaTrash } from 'react-icons/fa';

import { CalendarEventView } from './CalendarEventView';
import CalendarEventForm from './CalendarEventForm';
import de from 'date-fns/locale/de';
registerLocale('de', de);
dayjs.extend(LocalizedFormat);
dayjs.locale('de');

interface CalendarEventEditProps {
  event: Event;
  isOpen: boolean;
  readOnly: boolean;
  onOpen: () => void;
  onClose: () => void;
}

function CalendarEventEdit({
  event,
  isOpen,
  readOnly = false,
  onOpen,
  onClose,
}: CalendarEventEditProps): JSX.Element {
  const { t } = useTranslation();
  const [isReadOnly, setIsReadOnly] = useState<boolean>(readOnly);

  const { isLoading, isError, rawEvents } = useDaysEvents(event.startTime);

  const [updateEvent, { error: savingError }] = useUpdateEvent();
  const [deleteEvent] = useDeleteEvent();

  const [message, setMessage] = useState<string | null>(null);
  const [changedEvent, setChangedEvent] = useState<Event>(event);

  const handleChangedEvent = (changedEvent: Event) => {
    setChangedEvent({
      uuid: event.uuid,
      userId: event.userId,
      ressourceId: event.ressourceId,
      title: changedEvent.title,
      type: changedEvent.type,
      isHomeVisit: changedEvent.isHomeVisit,
      isAllDay: changedEvent.isAllDay,
      isRecurring: changedEvent.isRecurring,
      isCancelled: changedEvent.isCancelled,
      isCancelledReason: changedEvent.isCancelledReason,
      rrule: changedEvent.rrule,
      startTime: changedEvent.startTime,
      endTime: changedEvent.endTime,
      roomId: event.roomId,
      bgColor: event.bgColor,
    });
  };

  function handleSubmit() {
    if (checkOverlap()) {
      setMessage(t('error.event.overlapping'));
      return false;
    }
    if (changedEvent) {
      updateEvent({
        event: changedEvent,
      });
    }
    onClose();
  }

  function handleDelete() {
    if (event?.uuid) deleteEvent({ uuid: event.uuid });
    onClose();
  }

  function checkOverlap() {
    if (changedEvent) {
      const checkStart = changedEvent.startTime;
      const checkEnd = changedEvent.endTime;
      const result = rawEvents.filter(
        (checkEvent) =>
          checkEvent.uuid !== event.uuid &&
          checkEvent.ressourceId === event.ressourceId &&
          ((dayjs(checkStart) >= dayjs(checkEvent.startTime) &&
            dayjs(checkStart) <= dayjs(checkEvent.endTime)) ||
            (dayjs(checkEnd) > dayjs(checkEvent.startTime) &&
              dayjs(checkEnd) <= dayjs(checkEvent.endTime)))
      );
      if (!result.length) return false;
      return true;
    }
    return false;
  }

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          css={{
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
          <EventModalContent>
            <EventModalHeader bgColor={changedEvent?.bgColor || 'green'}>
              <div>
                <div className="modal-title">
                  {t('calendar.event.editAppointmentTitle')}
                </div>
                <div
                  className="modal-subtitle"
                  css={{
                    fontSize: '0.8rem',
                  }}
                >
                  {dayjs(event.startTime).format('llll')}
                </div>
              </div>
              {changedEvent.isHomeVisit && (
                <FaHouseUser
                  css={{
                    width: '2rem',
                    height: '2rem',
                  }}
                />
              )}
              {changedEvent.isRecurring && (
                <FaLink
                  css={{
                    width: '2rem',
                    height: '2rem',
                  }}
                />
              )}
              <IconButton
                aria-label="close modal"
                icon={<FaTimes />}
                onClick={onClose}
              />
            </EventModalHeader>
            <EventModalBody>
              {isReadOnly && (
                <CalendarEventView
                  eventTitle={changedEvent.title}
                  isHomeVisit={changedEvent.isHomeVisit}
                  isRecurring={changedEvent.isRecurring}
                  eventStartTime={changedEvent.startTime}
                  eventEndTime={changedEvent.endTime}
                />
              )}
              {!isReadOnly && (
                <CalendarEventForm
                  event={event}
                  setMessage={setMessage}
                  handleChangedEvent={handleChangedEvent}
                />
              )}
            </EventModalBody>

            <ModalFooter
              css={{
                padding: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                className="row"
                css={{
                  width: '100%',
                }}
              >
                {message && <ErrorMessage error={{ message }} />}
              </div>
              <div
                className="row"
                css={{
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
                    colorScheme="red"
                    size="sm"
                    type="button"
                    onClick={handleDelete}
                  >
                    {t('button.delete')}
                  </Button>
                </ControlWrapper>
                <ControlWrapper>
                  <Button
                    leftIcon={<FaTimes />}
                    aria-label="cancel edit"
                    type="button"
                    size="sm"
                    onClick={onClose}
                    variant="outline"
                    colorScheme="blue"
                  >
                    {t('button.cancel')}
                  </Button>
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
          </EventModalContent>
        </ModalOverlay>
      </Modal>
    </div>
  );
}

export default CalendarEventEdit;
