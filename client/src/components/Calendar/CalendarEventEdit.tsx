/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from '@chakra-ui/react';
import { useState } from 'react';
import {
  Button,
  CircleButton,
  ControlWrapper,
  ErrorMessage,
  // RadioGroup,
} from '../Library';
import * as mq from '../../styles/media-queries';
import dayjs from 'dayjs';
import 'dayjs/locale/de';
import { useDaysEvents, useDeleteEvent, useUpdateEvent } from '../../hooks/events';
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
interface FormElements extends HTMLFormControlsCollection {
  eventTitleInput: HTMLInputElement;
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

  const { isLoading, isError, rawEvents } = useDaysEvents(
    event.startTime
  );

  const [updateEvent, { error: savingError }] = useUpdateEvent();
  const [deleteEvent] = useDeleteEvent();

  const [message, setMessage] = useState<string | null>(null);
  const [changedEvent, setChangedEvent] = useState<Event>(event);

  const handleChangedEvent = (changedEvent:Event) => {
    setChangedEvent( {
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
      bgColor: event.bgColor
    });
  };

  function handleSubmit() {
    if (checkOverlap()) {
      setMessage(
        t('error.event.overlapping')
      );
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

  function checkOverlap () {
    if (changedEvent) {
      const checkStart = changedEvent.startTime;
      const checkEnd = changedEvent.endTime;
      const result = rawEvents.filter(
        (checkEvent) =>
          checkEvent.uuid !== event.uuid &&
          checkEvent.ressourceId === event.ressourceId &&
          ((dayjs(checkStart) >= dayjs(checkEvent.startTime) && dayjs(checkStart) <= dayjs(checkEvent.endTime)) ||
          (dayjs(checkEnd) > dayjs(checkEvent.startTime) && dayjs(checkEnd) <= dayjs(checkEvent.endTime)))
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
          <ModalContent
            css={{
              display: 'grid',
              gridTemplateRows: '1fr 6fr 1fr',
              maxWidth: '450px',
              borderRadius: '3px',
              backgroundColor: 'white',
              boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.2)',
              margin: '20vh auto',
              [mq.small]: {
                width: '100%',
                margin: '10vh auto',
              },
            }}
          >
            <ModalHeader
              css={{
                fontSize: '1.1rem',
                fontWeight: 'bold',
                color: 'white',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'cornflowerblue',
                padding: '0.5rem',
              }}
            >
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
              <CircleButton
                type="button"
                className="modal-close"
                onClick={onClose}
              >
                X
              </CircleButton>
            </ModalHeader>
            <ModalBody
              css={{
                padding: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {isReadOnly &&
                <CalendarEventView
                  eventTitle={changedEvent.title}
                  isHomeVisit={changedEvent.isHomeVisit}
                  isRecurring={changedEvent.isRecurring}
                  eventStartTime={changedEvent.startTime}
                  eventEndTime={changedEvent.endTime}
                />
              }
              {!isReadOnly &&
                <CalendarEventForm event={event} setMessage={setMessage} handleChangedEvent={handleChangedEvent}/>
              }
            </ModalBody>

            <ModalFooter
              css={{
                padding: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div className="row" css={{
                width: '100%'
              }}>
                {message && <ErrorMessage error={{message}}/>}
              </div>
              <div className="row" css={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
                <ControlWrapper>
                  <Button type="button"onClick={handleDelete} variant="danger">
                    <FaTrash /> {t('button.delete')}
                  </Button>
                </ControlWrapper>
                <ControlWrapper>
                  <Button type="button" onClick={onClose} variant="secondary">
                    <FaTimes /> {t('button.cancel')}
                  </Button>
                  {
                    isReadOnly
                      ? (<Button type="button" onClick={() => setIsReadOnly(!isReadOnly)} variant="secondary">
                        <FaEdit /> {t('button.edit')}
                      </Button>)
                      : (<Button type="button" disabled={isReadOnly} onClick={handleSubmit}>{t('button.save')}</Button>)
                  }
                </ControlWrapper>
              </div>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </div>
  );
}

export default CalendarEventEdit;
