import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Modal,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  Badge,
} from '@chakra-ui/react';
import { BaseSyntheticEvent, useState } from 'react';
import {
  ErrorMessage,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '../../Library';
import dayjs from 'dayjs';
import 'dayjs/locale/de';
import {
  useAllCancellationReasons,
  useDaysEvents,
  useDeleteEvent,
  useDeleteCurrentAndFutureEvents,
  useUpdateEvent,
  useUpdateCurrentAndFutureEvent,
} from '../../../hooks/events';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CancellationReason, Event, NewEvent } from '../../../types/Event';
import { FaEdit, FaTimes, FaTrash } from 'react-icons/fa';

import CalendarEventView from './CalendarEventView';
import CalendarEventForm from './CalendarEventForm';
import de from 'date-fns/locale/de';
import { checkOverlap } from '../../../helpers/eventChecker';
import { useViewport } from '../../../hooks/useViewport';
import { ModalFooter } from '../../Library/Modal';
import {
  RiCheckboxBlankLine,
  RiCheckboxLine,
  RiCheckFill,
} from 'react-icons/ri';
import { ControlWrapper } from '../../atoms/Wrapper';
import { EventIcon } from '../../molecules/DataDisplay/Icons';
registerLocale('de', de);
dayjs.extend(LocalizedFormat);
dayjs.locale('de');

interface CalendarEventEditProps {
  event: Event;
  isOpen: boolean;
  readOnly: boolean;
  onClose: () => void;
}

function CalendarEventEdit({
  event,
  isOpen,
  readOnly = false,
  onClose,
}: CalendarEventEditProps): JSX.Element {
  const { t } = useTranslation();
  const { isMobile } = useViewport();
  const [isReadOnly, setIsReadOnly] = useState<boolean>(readOnly);

  const { rawEvents } = useDaysEvents(event.startTime);
  const { isLoading: isLoadingCR, cancellationReasons } =
    useAllCancellationReasons();

  const { mutateAsync: updateEvent } = useUpdateEvent();
  const { mutateAsync: updateCurrentAndFutureEvent } =
    useUpdateCurrentAndFutureEvent();
  const { mutateAsync: deleteEvent } = useDeleteEvent();
  const { mutateAsync: deleteCurrentAndFutureEvents } =
    useDeleteCurrentAndFutureEvents();

  const [message, setMessage] = useState<string | undefined>();
  const [changedEvent, setChangedEvent] = useState<Event>(event);
  const isNote = changedEvent.type === 'note';
  const handleChangedEvent = (changedEvent: Event | NewEvent) => {
    setChangedEvent({
      uuid: event.uuid,
      userId: event.userId,
      ressourceId: event.ressourceId,
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
      roomId: changedEvent.roomId,
      bgColor: event.bgColor,
    });
  };
  const patientIsArchived = Boolean(changedEvent.patient?.archived);

  function handleSubmit() {
    if (checkOverlap({ eventToCheck: changedEvent, eventList: rawEvents })) {
      setMessage(t('error.event.overlapping') || undefined);
      return false;
    }
    if (changedEvent) {
      updateEvent({
        event: changedEvent,
      });
    }
    onClose();
  }

  function handleSubmitCurrentAndFuture() {
    if (checkOverlap({ eventToCheck: changedEvent, eventList: rawEvents })) {
      setMessage(t('error.event.overlapping') || undefined);
      return false;
    }
    if (changedEvent) {
      updateCurrentAndFutureEvent({
        event: changedEvent,
      });
    }
    onClose();
  }

  function handleDelete() {
    if (event?.uuid) deleteEvent({ uuid: event.uuid });
    onClose();
  }

  function handleDeleteCurrentAndFuture() {
    if (event?.uuid) deleteCurrentAndFutureEvents({ uuid: event.uuid });
    onClose();
  }

  function handleCancelEvent(
    event: BaseSyntheticEvent,
    id: CancellationReason['id']
  ) {
    updateEvent({
      event: {
        ...changedEvent,
        isCancelled: true,
        cancellationReasonId: id,
      },
    });
    onClose();
  }

  function handleDone() {
    updateEvent({
      event: {
        ...changedEvent,
        isDone: true,
      },
    });
    onClose();
  }

  const CancelMenuItems = () => {
    if (isLoadingCR || !cancellationReasons.length)
      return (
        <MenuList borderColor="orange.500">
          <MenuItem>{t('button.cancelEvent')}</MenuItem>
        </MenuList>
      );
    return (
      <MenuList borderColor="orange.500">
        {cancellationReasons.map((cr: CancellationReason) => (
          <MenuItem onClick={(e) => handleCancelEvent(e, cr.id)} key={cr.id}>
            {cr.id} | {cr.description}
          </MenuItem>
        ))}
      </MenuList>
    );
  };

  const disableCancel = patientIsArchived || changedEvent.isDone;
  const disableDelete =
    patientIsArchived ||
    dayjs(changedEvent.endTime).isBefore(dayjs().hour(0).subtract(3, 'days')) ||
    changedEvent.isDone;
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
            <ModalHeader
              bgColor={isNote ? 'note' : changedEvent?.bgColor || 'green'}
            >
              {changedEvent.isDone !== true ? (
                <IconButton
                  aria-label="set isDone"
                  disabled={
                    patientIsArchived ||
                    dayjs(changedEvent.endTime).isAfter(dayjs()) ||
                    changedEvent.isDone
                  }
                  icon={
                    changedEvent.isDone ? (
                      <RiCheckboxLine />
                    ) : (
                      <RiCheckboxBlankLine />
                    )
                  }
                  onClick={handleDone}
                />
              ) : (
                <Icon as={RiCheckFill} w={8} h={8} fill="green" />
              )}
              <div>
                <div className="modal-title">
                  {t(
                    `calendar.event.${
                      isNote ? 'noteTitle' : 'editAppointmentTitle'
                    }`
                  )}
                </div>
                <div
                  className="modal-subtitle"
                  style={{
                    fontSize: '0.8rem',
                  }}
                >
                  {dayjs(event.startTime).format('llll')}
                </div>
              </div>
              {changedEvent.isHomeVisit && (
                <EventIcon type="homeVisit" size="m" />
              )}
              {changedEvent.isRecurring && (
                <EventIcon type="recurring" size="m" />
              )}
              {changedEvent.isDiagnostic && (
                <EventIcon type="diagnostic" size="m" />
              )}
              <IconButton
                aria-label="close modal"
                icon={<FaTimes />}
                onClick={onClose}
              />
            </ModalHeader>
            <ModalBody bgColor={isNote ? 'note' : undefined}>
              {patientIsArchived && (
                <Badge colorScheme="orange">patient archiviert</Badge>
              )}
              {isReadOnly && (
                <CalendarEventView
                  isNote={isNote}
                  eventTitle={changedEvent.title}
                  isHomeVisit={changedEvent.isHomeVisit}
                  isRecurring={changedEvent.isRecurring}
                  isDiagnostic={changedEvent.isDiagnostic}
                  eventStartTime={changedEvent.startTime}
                  eventEndTime={changedEvent.endTime}
                  eventPatient={changedEvent.patient}
                  eventRoom={changedEvent.room}
                />
              )}
              {!isReadOnly && (
                <CalendarEventForm
                  event={event}
                  setMessage={setMessage}
                  handleChangedEvent={handleChangedEvent}
                />
              )}
              {message && <ErrorMessage error={{ message }} />}
            </ModalBody>

            <ModalFooter bgColor={isNote ? 'note' : undefined}>
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
                  {!isNote && (
                    <Menu>
                      <MenuButton
                        leftIcon={<FaTimes />}
                        aria-label="cancel event"
                        colorScheme="orange"
                        disabled={disableCancel}
                        size="sm"
                        type="button"
                        as={Button}
                      >
                        {t('button.cancelEvent')}
                      </MenuButton>
                      {CancelMenuItems()}
                    </Menu>
                  )}
                  {!isNote && changedEvent.isRecurring ? (
                    <Menu>
                      <MenuButton
                        leftIcon={<FaTimes />}
                        aria-label="delete event"
                        colorScheme="red"
                        disabled={disableDelete}
                        size="sm"
                        type="button"
                        as={Button}
                      >
                        {t('button.delete')}
                      </MenuButton>
                      <MenuList borderColor="orange.500">
                        <MenuItem onClick={handleDeleteCurrentAndFuture}>
                          ❌ {t('calendar.event.thisAndAllFutureEvents')}
                        </MenuItem>
                        <MenuItem onClick={handleDelete}>
                          ❌ {t('calendar.event.thisEvent')}
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  ) : (
                    <Button
                      leftIcon={<FaTrash />}
                      aria-label="delete event"
                      disabled={disableDelete}
                      colorScheme="red"
                      size="sm"
                      type="button"
                      onClick={handleDelete}
                    >
                      {t('button.delete')}
                    </Button>
                  )}
                </ControlWrapper>
                <ControlWrapper>
                  {isReadOnly ? (
                    <Button
                      leftIcon={<FaEdit />}
                      aria-label="edit event"
                      type="button"
                      disabled={patientIsArchived}
                      onClick={() => setIsReadOnly(!isReadOnly)}
                      colorScheme="blue"
                      size="sm"
                    >
                      {t('button.edit')}
                    </Button>
                  ) : changedEvent.isRecurring ? (
                    <Menu>
                      <MenuButton
                        leftIcon={<FaTimes />}
                        aria-label="save changes"
                        colorScheme="blue"
                        disabled={isReadOnly}
                        size="sm"
                        type="button"
                        as={Button}
                      >
                        {t('button.save')}
                      </MenuButton>
                      <MenuList borderColor="orange.500">
                        <MenuItem onClick={handleSubmitCurrentAndFuture}>
                          💾 {t('calendar.event.thisAndAllFutureEvents')}
                        </MenuItem>
                        <MenuItem onClick={handleSubmit}>
                          💾 {t('calendar.event.thisEvent')}
                        </MenuItem>
                      </MenuList>
                    </Menu>
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

export default CalendarEventEdit;
