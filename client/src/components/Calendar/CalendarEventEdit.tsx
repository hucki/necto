/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useTranslation } from 'react-i18next';
import { Modal, ModalOverlay, IconButton, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { BaseSyntheticEvent, useState } from 'react';
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
  useAllCancellationReasons,
  useDaysEvents,
  useDeleteEvent,
  useUpdateEvent,
} from '../../hooks/events';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CancellationReason, Event } from '../../types/Event';
import { FaHouseUser, FaLink, FaEdit, FaTimes, FaTrash, FaCommentMedical } from 'react-icons/fa';

import CalendarEventView from './CalendarEventView';
import CalendarEventForm from './CalendarEventForm';
import de from 'date-fns/locale/de';
import { checkOverlap } from '../../helpers/eventChecker';
import { useViewport } from '../../hooks/useViewport';
import { EventModalFooter } from '../Library/Modal';
import { RiCheckboxBlankLine, RiCheckboxLine } from 'react-icons/ri';
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
  const { isMobile } = useViewport();
  const [isReadOnly, setIsReadOnly] = useState<boolean>(readOnly);

  const { isLoading, isError, rawEvents } = useDaysEvents(event.startTime);
  const { isLoading: isLoadingCR, error: errorCR, cancellationReasons} = useAllCancellationReasons();

  const [updateEvent, { error: savingError }] = useUpdateEvent();
  const [deleteEvent] = useDeleteEvent();

  const [message, setMessage] = useState<string | null>(null);
  const [changedEvent, setChangedEvent] = useState<Event>(event);
  const isNote = changedEvent.type === 'note';
  const handleChangedEvent = (changedEvent: Event) => {
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
      roomId: event.roomId,
      bgColor: event.bgColor,
    });
  };

  function handleSubmit() {
    if (checkOverlap({ eventToCheck: changedEvent, eventList: rawEvents })) {
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

  function handleCancelEvent(event: BaseSyntheticEvent, id: CancellationReason['id']) {
    updateEvent({
      event: {
        ...changedEvent,
        isCancelled: true,
        cancellationReasonId: id
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
        </MenuList>);
    return (
      <MenuList borderColor="orange.500">
        {cancellationReasons.map((cr: CancellationReason) => <MenuItem onClick={(e) => handleCancelEvent(e, cr.id)} key={cr.id}>{cr.id} | {cr.description}</MenuItem>)}
      </MenuList>);
  };

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" size={isMobile ? 'full': undefined}>
        <ModalOverlay
          css={{
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
          <EventModalContent>
            <EventModalHeader bgColor={isNote ? 'note' : changedEvent?.bgColor || 'green'}>
              <IconButton
                aria-label="set isDone"
                disabled={dayjs(changedEvent.endTime).isAfter(dayjs()) || changedEvent.isDone}
                icon={changedEvent.isDone ? <RiCheckboxLine /> : <RiCheckboxBlankLine />}
                onClick={handleDone}
              />
              <div>
                <div className="modal-title">
                  {t(`calendar.event.${isNote ? 'noteTitle' : 'editAppointmentTitle'}`)}
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
                    width: '1rem',
                    height: '1rem',
                  }}
                />
              )}
              {changedEvent.isRecurring && (
                <FaLink
                  css={{
                    width: '1rem',
                    height: '1rem',
                  }}
                />
              )}
              {changedEvent.isDiagnostic && (
                <FaCommentMedical css={{
                  width: '1rem',
                  height: '1rem',
                }} />
              )}
              <IconButton
                aria-label="close modal"
                icon={<FaTimes />}
                onClick={onClose}
              />
            </EventModalHeader>
            <EventModalBody bgColor={(isNote ? 'note' : undefined)}>
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
            </EventModalBody>

            <EventModalFooter bgColor={(isNote ? 'note' : undefined)}>
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
                  {!isNote &&
                    <Menu>
                      <MenuButton
                        leftIcon={<FaTimes />}
                        aria-label="cancel event"
                        colorScheme="orange"
                        disabled={changedEvent.isDone}
                        size="sm"
                        type="button"
                        as={Button}
                      >
                        {t('button.cancelEvent')}
                      </MenuButton>
                      {CancelMenuItems()}
                    </Menu>
                  }
                  <Button
                    leftIcon={<FaTrash />}
                    aria-label="delete event"
                    disabled={dayjs(changedEvent.endTime).isBefore(dayjs()) || changedEvent.isDone}
                    colorScheme="red"
                    size="sm"
                    type="button"
                    onClick={handleDelete}
                  >
                    {t('button.delete')}
                  </Button>
                </ControlWrapper>
                <ControlWrapper>
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
            </EventModalFooter>
          </EventModalContent>
        </ModalOverlay>
      </Modal>
    </div>
  );
}

export default CalendarEventEdit;
