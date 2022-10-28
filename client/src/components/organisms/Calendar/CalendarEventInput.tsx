import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { ErrorMessage } from '../../Library';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/de';
import utc from 'dayjs/plugin/utc';
import { useDaysEvents } from '../../../hooks/events';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useCreateEvent } from '../../../hooks/events';
import { Event } from '../../../types/Event';
import { EmployeeRessource, Room } from '../../../types/Ressource';
import { FaCommentMedical, FaHouseUser, FaLink, FaTimes } from 'react-icons/fa';
import de from 'date-fns/locale/de';
import CalendarEventForm from './CalendarEventForm';
import { checkOverlap } from '../../../helpers/eventChecker';
import { rrulestr } from 'rrule';
import { useViewport } from '../../../hooks/useViewport';
import { useHolidays } from '../../../hooks/useHolidays';
import CalendarItemModal from './CalendarItemModal';
import { ModalFooterControls } from './ModalFooterControls';
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
  const { isWeekend, isPublicHoliday } = useHolidays();
  const { isMobile } = useViewport();
  const getIsNote = (dateTime: Dayjs) => {
    return (
      dayjs(dateTime).hour() < 7 ||
      isWeekend({ date: dayjs(dateTime) }) ||
      Boolean(isPublicHoliday({ date: dayjs(dateTime) }))
    );
  };
  const [isNote, setIsNote] = useState(() => getIsNote(dateTime));
  const initialStartTime = getIsNote(dateTime)
    ? dayjs(dateTime).minute(0)
    : dateTime;
  const defaultEvent: Event = {
    userId: uuid.toString(),
    ressourceId: uuid,
    title: '',
    startTime: initialStartTime,
    endTime: dayjs(initialStartTime).add(
      getIsNote(dateTime) ? 60 : 45,
      'minute'
    ),
    isRecurring: false,
    isHomeVisit: false,
    isDiagnostic: false,
    isDone: false,
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

  const { mutateAsync: createEvent, error: savingError } = useCreateEvent();
  const [message, setMessage] = useState<string | undefined>();

  useEffect(() => {
    // reset event State if new incoming datetime or uuid
    setIsNote(getIsNote(dateTime));
    setNewEvent(defaultEvent);
    setMessage(undefined);
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
      isDone: changedEvent.isDone,
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
      setMessage(t('error.event.overlapping') || undefined);
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

  const ModalHeaderContent = () => {
    return (
      <>
        <div>
          <div className="modal-title">
            {t(
              `calendar.event.${
                newEvent.type === 'note' ? 'noteTitle' : 'newAppointmentTitle'
              }`
            )}{' '}
            {ressource?.displayName
              ? t('dict.for') + ' ' + ressource.displayName
              : ''}
          </div>
          <div
            className="modal-subtitle"
            style={{
              fontSize: '0.8rem',
            }}
          >
            {newEvent.startTime.format('llll')}
          </div>
        </div>
        {newEvent.isHomeVisit && (
          <FaHouseUser
            style={{
              width: '2rem',
              height: '2rem',
            }}
          />
        )}
        {newEvent.isRecurring && (
          <FaLink
            style={{
              width: '2rem',
              height: '2rem',
            }}
          />
        )}
        {newEvent.isDiagnostic && (
          <FaCommentMedical
            style={{
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
      </>
    );
  };

  return (
    <CalendarItemModal
      isOpen={isOpen}
      onClose={onClose}
      modalHeader={<ModalHeaderContent />}
      headerBgColor={
        newEvent.type === 'note' ? 'note' : newEvent?.bgColor || 'green'
      }
      modalBody={
        <>
          <CalendarEventForm
            event={newEvent}
            setMessage={setMessage}
            handleChangedEvent={handleChangedEvent}
          />
          {message && <ErrorMessage error={{ message }} />}
        </>
      }
      bodyBgColor={newEvent.type === 'note' ? 'note' : undefined}
      modalFooter={
        <ModalFooterControls onClose={onClose} onSubmit={handleSubmit} />
      }
      size={isMobile ? 'full' : undefined}
    />
  );
}

export default CalendarEventInput;
