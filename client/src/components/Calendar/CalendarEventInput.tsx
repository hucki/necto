/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useTranslation } from 'react-i18next';
import { Modal, ModalOverlay, ModalFooter, IconButton } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import {
  Button,
  ErrorMessage,
  EventModalBody,
  EventModalContent,
  EventModalHeader,
} from '../Library';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/de';
import utc from 'dayjs/plugin/utc';
import { useDaysEvents } from '../../hooks/events';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useCreateEvent } from '../../hooks/events';
import { Event } from '../../types/Event';
import { EmployeeRessource, Room } from '../../types/Ressource';
import { FaCommentMedical, FaHouseUser, FaLink, FaTimes } from 'react-icons/fa';
import de from 'date-fns/locale/de';
import CalendarEventForm from './CalendarEventForm';
import { checkOverlap } from '../../helpers/eventChecker';
import { rrulestr } from 'rrule';
import { useViewport } from '../../hooks/useViewport';
import { EventModalFooter } from '../Library/Modal';
registerLocale('de', de);
dayjs.extend(LocalizedFormat);
dayjs.extend(utc);
dayjs.locale('de');

interface CalendarEventInputProps {
  uuid: string;
  ressource: EmployeeRessource | Room;
  dateTime: Dayjs;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
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
  const { isMobile } = useViewport();
  const getIsNote = (dateTime: Dayjs) => {
    return dayjs(dateTime).hour() < 7 || dayjs(dateTime).day() === 0 || dayjs(dateTime).day() === 6;
  };
  const [isNote, setIsNote] = useState(() => getIsNote(dateTime));
  const initialStartTime = getIsNote(dateTime) ? dayjs(dateTime).hour(6).minute(0) : dateTime;
  const defaultEvent: Event = {
    userId: uuid.toString(),
    ressourceId: uuid,
    title: t('calendar.event.newAppointmentTitle'),
    startTime: initialStartTime,
    endTime: dayjs(initialStartTime).add(getIsNote(dateTime) ? 60 : 45, 'minute'),
    isRecurring: false,
    isHomeVisit: false,
    isDiagnostic: false,
    rrule: '',
    bgColor: ressource?.bgColor || 'green',
    type: getIsNote(dateTime) ? 'note' : 'Appointment',
    isAllDay: false,
    isCancelled: false,
    isCancelledReason: '',
    roomId: '',
    patientId: '',
  };
  const [newEvent, setNewEvent] = useState<Event>(defaultEvent);
  const { isLoading, isError, rawEvents } = useDaysEvents(dateTime);

  const [createEvent, { error: savingError }] = useCreateEvent();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // reset event State if new incoming datetime or uuid
    setIsNote(getIsNote(dateTime));
    setNewEvent(defaultEvent);
    setMessage(null);
  }, [dateTime, uuid, isNote]);

  const handleChangedEvent = (changedEvent: Event) => {
    setNewEvent({
      userId: defaultEvent.userId,
      ressourceId: defaultEvent.ressourceId,
      title: changedEvent.title,
      type: changedEvent.type,
      isDiagnostic: changedEvent.isDiagnostic,
      isHomeVisit: changedEvent.isHomeVisit,
      isAllDay: changedEvent.isAllDay,
      isRecurring: changedEvent.isRecurring,
      isCancelled: changedEvent.isCancelled,
      isCancelledReason: changedEvent.isCancelledReason,
      rrule: changedEvent.rrule,
      startTime: changedEvent.startTime,
      endTime: changedEvent.endTime,
      patientId: changedEvent.patientId,
      roomId: defaultEvent.roomId,
      bgColor: defaultEvent.bgColor,
    });
  };

  async function handleSubmit() {
    if (checkOverlap({ eventToCheck: newEvent, eventList: rawEvents })) {
      setMessage(t('error.event.overlapping'));
      return false;
    }
    if (newEvent) {
      try {
        const createdEvent = await createEvent({
          event: newEvent,
        });

        // create events from rrule if event was created and it isRecurring and has rrule
        if (!createdEvent || !createdEvent.isRecurring || !createdEvent.rrule) {
          onClose();
          return;
        }

        const rruleObj = rrulestr(createdEvent.rrule);
        const rruleList = rruleObj?.all();
        const eventDuration = dayjs(createdEvent.endTime).diff(
          dayjs(createdEvent.startTime),
          'm'
        );
        if (rruleList && rruleList.length > 1) {
          const currentTZHour = dayjs.utc(rruleList[0]).local().hour();
          for (let i = 1; i < rruleList.length; i++) {
            const dt = dayjs(rruleList[i]).hour(currentTZHour);
            const nextEvent = newEvent;
            nextEvent.parentEventId = createdEvent.uuid;
            nextEvent.startTime = dt;
            nextEvent.endTime = dt.add(eventDuration, 'm');
            await createEvent({
              event: nextEvent,
            });
          }
        }
        onClose();
      } catch (error) {
        console.error('event could not be created', { error });
      }
    }
  }

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" size={isMobile ? 'full': undefined}>
        <ModalOverlay
          css={{
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
          <EventModalContent>
            <EventModalHeader bgColor={newEvent.type === 'note' ? 'yellow' : newEvent?.bgColor || 'green'}>
              <div>
                <div className="modal-title">
                  {t(`calendar.event.${newEvent.type === 'note' ? 'noteTitle' : 'newAppointmentTitle'}`)}{' '}
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
              {newEvent.isDiagnostic && (
                <FaCommentMedical css={{
                  width: '2rem',
                  height: '2rem',
                }} />
              )}
              <IconButton
                aria-label="close modal"
                icon={<FaTimes />}
                onClick={onClose}
              />
            </EventModalHeader>
            <EventModalBody bgColor={newEvent.type === 'note' ? 'yellow' : undefined}>
              <CalendarEventForm
                event={newEvent}
                setMessage={setMessage}
                handleChangedEvent={handleChangedEvent}
              />
              {message && <ErrorMessage error={{ message }} />}
            </EventModalBody>
            <EventModalFooter bgColor={newEvent.type === 'note' ? 'yellow' : undefined}>
              <div
                className="row"
                css={{
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
                  onClick={onClose}
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
                  onClick={handleSubmit}
                >
                  {t('button.save')}
                </Button>
              </div>
            </EventModalFooter>
          </EventModalContent>
        </ModalOverlay>
      </Modal>
    </div>
  );
}

export default CalendarEventInput;
