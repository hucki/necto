/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useTranslation } from 'react-i18next';
import { Modal, ModalOverlay, ModalFooter } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import {
  Button,
  CircleButton,
  ErrorMessage,
  EventModalBody,
  EventModalContent,
  EventModalHeader,
} from '../Library';
import classes from './Calendar.module.css';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/de';
import { useDaysEvents } from '../../hooks/events';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useCreateEvent } from '../../hooks/events';
import { Event } from '../../types/Event';
import { EmployeeRessource, Room } from '../../types/Ressource';
import { FaHouseUser, FaLink } from 'react-icons/fa';
import de from 'date-fns/locale/de';
import CalendarEventForm from './CalendarEventForm';
registerLocale('de', de);
dayjs.extend(LocalizedFormat);
dayjs.locale('de');

interface CalendarEventInputProps {
  uuid: string;
  ressource: EmployeeRessource | Room;
  dateTime: Dayjs;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}
interface FormElements extends HTMLFormControlsCollection {
  eventTitleInput: HTMLInputElement;
}

function CalendarEventInput({
  uuid,
  ressource,
  dateTime,
  isOpen,
  onOpen,
  onClose,
}: CalendarEventInputProps): JSX.Element {
  const { t } = useTranslation();
  const defaultEvent: Event = {
    userId: uuid.toString(),
    ressourceId: uuid,
    title: t('calendar.event.newAppointmentTitle'),
    startTime: dateTime,
    endTime: dayjs(dateTime).add(45, 'minute'),
    isRecurring: false,
    isHomeVisit: false,
    rrule: '',
    bgColor: ressource?.bgColor || 'green',
    type: 'Appointment',
    isAllDay: false,
    isCancelled: false,
    isCancelledReason: '',
  };
  const [newEvent, setNewEvent] = useState<Event>(defaultEvent);
  const { isLoading, isError, rawEvents } = useDaysEvents(dateTime);

  const [createEvent, { error: savingError }] = useCreateEvent();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // reset event State if new incoming datetime or uuid
    setNewEvent(defaultEvent);
    setMessage(null);
  }, [dateTime, uuid]);

  const handleChangedEvent = (changedEvent: Event) => {
    setNewEvent({
      userId: defaultEvent.userId,
      ressourceId: defaultEvent.ressourceId,
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
      roomId: defaultEvent.roomId,
      bgColor: defaultEvent.bgColor,
    });
  };

  function handleSubmit() {
    if (checkOverlap()) {
      setMessage(t('error.event.overlapping'));
      return false;
    }
    if (newEvent) {
      createEvent({
        event: newEvent,
      });
    }
    onClose();
  }

  function checkOverlap() {
    const checkStart = newEvent.startTime;
    const checkEnd = newEvent.endTime;
    const result = rawEvents.filter(
      (event) =>
        event.ressourceId === ressource.uuid &&
        ((dayjs(checkStart) >= dayjs(event.startTime) &&
          dayjs(checkStart) <= dayjs(event.endTime)) ||
          (dayjs(checkEnd) >= dayjs(event.startTime) &&
            dayjs(checkEnd) <= dayjs(event.endTime)))
    );
    if (!result.length) return false;
    return true;
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
            <EventModalHeader bgColor={newEvent?.bgColor || 'green'}>
              <div>
                <div className="modal-title">
                  {t('calendar.event.newAppointmentTitle')}{' '}
                  {ressource?.displayName
                    ? t('dict.for') + ' ' + ressource.displayName
                    : ''}
                </div>
                <div
                  className="modal-subtitle"
                  css={{
                    fontSize: '0.8rem',
                  }}
                >
                  {newEvent.startTime.format('llll')}
                </div>
              </div>
              {newEvent.isHomeVisit && (
                <FaHouseUser
                  css={{
                    width: '2rem',
                    height: '2rem',
                  }}
                />
              )}
              {newEvent.isRecurring && (
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
                bgColor={newEvent?.bgColor || 'green'}
              >
                X
              </CircleButton>
            </EventModalHeader>
            <EventModalBody>
              <CalendarEventForm
                event={newEvent}
                setMessage={setMessage}
                handleChangedEvent={handleChangedEvent}
              />
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
                  justifyContent: 'end',
                }}
              >
                <Button type="button" onClick={onClose} variant="secondary">
                  {t('button.close')}
                </Button>
                <Button type="button" onClick={handleSubmit}>
                  {t('button.save')}
                </Button>
              </div>
            </ModalFooter>
          </EventModalContent>
        </ModalOverlay>
      </Modal>
    </div>
  );
}

export default CalendarEventInput;
