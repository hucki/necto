import React, { useContext } from 'react';
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
  useDisclosure,
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
  useDeleteEvent,
  useDeleteCurrentAndFutureEvents,
  useUpdateEvent,
  useUpdateCurrentAndFutureEvent,
  useEvents,
} from '../../../hooks/events';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { CancellationReason, Event, NewEvent } from '../../../types/Event';
import { FaEdit, FaSave, FaTimes, FaTrash } from 'react-icons/fa';

import CalendarEventView from './CalendarEventView';
import CalendarEventForm from './CalendarEventForm';
import { checkOverlap } from '../../../helpers/event';
import { useViewport } from '../../../hooks/useViewport';
import { ModalFooter } from '../../Library/Modal';
import {
  RiCheckboxBlankLine,
  RiCheckboxLine,
  RiCheckFill,
} from 'react-icons/ri';
import { ControlWrapper } from '../../atoms/Wrapper';
import { EventIcon } from '../../molecules/DataDisplay/Icons';
import { isAuthorized } from '../../../config/eventHandling';
import { AuthContext } from '../../../providers/AuthProvider';
import { Alert } from '../../molecules/Error/Alert';
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
  const {
    isOpen: isOpenAlert,
    onOpen: onOpenAlert,
    onClose: onCloseAlert,
  } = useDisclosure();
  const { user } = useContext(AuthContext);
  const { isMobile } = useViewport();
  const [isReadOnly, setIsReadOnly] = useState<boolean>(readOnly);

  const { rawEvents } = useEvents({
    employeeId: event.ressourceId,
    date: event.startTime,
    includes: 'patient,parentEvent,childEvents,room,employee',
  });
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
    const { conflicts } = checkOverlap({
      eventToCheck: changedEvent,
      eventList: rawEvents,
    });
    if (conflicts.length) {
      setMessage(t('error.event.overlapping') + conflicts.join() || undefined);
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
    const { conflicts } = checkOverlap({
      eventToCheck: changedEvent,
      eventList: rawEvents,
    });
    if (conflicts.length) {
      setMessage(t('error.event.overlapping') + conflicts.join() || undefined);
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
  const handleConfirmAlert = () => {
    updateEvent({
      event: {
        ...changedEvent,
        isDone: !changedEvent.isDone,
      },
    });
    onCloseAlert();
    onClose();
  };
  const isFutureEvent = dayjs(changedEvent.endTime).isAfter(dayjs());
  const userCanChangeIsDone =
    !isFutureEvent && user && isAuthorized(user, 'removeIsDone');
  const disableDone =
    !userCanChangeIsDone &&
    (isFutureEvent || patientIsArchived || changedEvent.isDone);
  const disableCancel = patientIsArchived || changedEvent.isDone;
  const disableDelete =
    patientIsArchived ||
    dayjs(changedEvent.endTime).isBefore(dayjs().hour(0).subtract(3, 'days')) ||
    changedEvent.isDone;
  const isSameTime = dayjs(changedEvent.endTime).isSame(
    dayjs(dayjs(changedEvent.startTime))
  );
  const endBeforeStart = dayjs(changedEvent.endTime).isBefore(
    dayjs(dayjs(changedEvent.startTime))
  );
  const isInvalid = isSameTime || endBeforeStart;
  const disableSubmit = isInvalid || isReadOnly;
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
              {!disableDone ? (
                <IconButton
                  aria-label="set isDone"
                  isDisabled={disableDone}
                  icon={
                    changedEvent.isDone ? (
                      <RiCheckboxLine />
                    ) : (
                      <RiCheckboxBlankLine />
                    )
                  }
                  onClick={changedEvent.isDone ? onOpenAlert : handleDone}
                />
              ) : (
                <Icon
                  as={changedEvent.isDone ? RiCheckFill : RiCheckboxBlankLine}
                  w={8}
                  h={8}
                  fill={changedEvent.isDone ? 'green' : 'gray'}
                />
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
              {message && <ErrorMessage error={{ message }} />}
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
            </ModalBody>

            <ModalFooter
              mb={isMobile ? '1rem' : undefined}
              bgColor={isNote ? 'note' : undefined}
            >
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
                  {!isNote && isReadOnly && (
                    <Menu>
                      <MenuButton
                        leftIcon={<FaTimes />}
                        aria-label="cancel event"
                        colorScheme="orange"
                        isDisabled={disableCancel}
                        size="sm"
                        type="button"
                        as={Button}
                      >
                        {t('button.cancelEvent')}
                      </MenuButton>
                      {CancelMenuItems()}
                    </Menu>
                  )}
                  {!isNote && !isReadOnly && changedEvent.isRecurring ? (
                    <Menu>
                      <MenuButton
                        leftIcon={<FaTimes />}
                        aria-label="delete event"
                        colorScheme="red"
                        isDisabled={disableDelete}
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
                    !isReadOnly && (
                      <Button
                        leftIcon={<FaTrash />}
                        aria-label="delete event"
                        isDisabled={disableDelete}
                        colorScheme="red"
                        size="sm"
                        type="button"
                        onClick={handleDelete}
                      >
                        {t('button.delete')}
                      </Button>
                    )
                  )}
                </ControlWrapper>
                <ControlWrapper>
                  {isReadOnly ? (
                    <Button
                      leftIcon={<FaEdit />}
                      aria-label="edit event"
                      type="button"
                      isDisabled={patientIsArchived}
                      onClick={() => setIsReadOnly(!isReadOnly)}
                      colorScheme="blue"
                      size="sm"
                    >
                      {t('button.edit')}
                    </Button>
                  ) : changedEvent.isRecurring ? (
                    <Menu>
                      <Button
                        leftIcon={<FaTimes />}
                        aria-label="cancel modal"
                        type="button"
                        isDisabled={isReadOnly}
                        onClick={onClose}
                        size="sm"
                      >
                        {t('button.cancel')}
                      </Button>
                      <MenuButton
                        leftIcon={<FaSave />}
                        aria-label="save changes"
                        colorScheme="blue"
                        isDisabled={isReadOnly}
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
                    <>
                      <Button
                        leftIcon={<FaTimes />}
                        aria-label="cancel modal"
                        type="button"
                        isDisabled={isReadOnly}
                        onClick={onClose}
                        size="sm"
                      >
                        {t('button.cancel')}
                      </Button>
                      <Button
                        leftIcon={<FaSave />}
                        aria-label="save changes"
                        type="button"
                        isDisabled={disableSubmit}
                        onClick={handleSubmit}
                        size="sm"
                        colorScheme="blue"
                      >
                        {t('button.save')}
                      </Button>
                    </>
                  )}
                </ControlWrapper>
              </div>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
      <Alert
        onClose={onCloseAlert}
        isOpen={isOpenAlert}
        onConfirm={handleConfirmAlert}
        type="isDone"
      />
    </>
  );
}

export default CalendarEventEdit;
