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
import { useState, useEffect } from 'react';
import {
  Button,
  CircleButton,
  ErrorMessage,
} from '../Library';
import * as mq from '../../styles/media-queries';
import { RRule, rrulestr } from 'rrule';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/de';
import { useDaysEvents } from '../../hooks/events';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
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
interface eventTitleFormElement extends HTMLFormElement {
  elements: FormElements;
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
  const { isLoading, isError, rawEvents } = useDaysEvents(
    dateTime
  );

  const [createEvent, { error: savingError }] = useCreateEvent();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // reset event State if new incoming datetime or uuid
    setNewEvent(defaultEvent);
    setMessage(null);
  }, [dateTime, uuid]);

  const handleChangedEvent = (changedEvent:Event) => {
    setNewEvent( {
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
      bgColor: defaultEvent.bgColor
    });
  };

  function handleSubmit() {
    if (checkOverlap()) {
      setMessage(
        t('error.event.overlapping')
      );
      return false;
    }
    if (newEvent) {
      createEvent({
        event: newEvent,
      });
    }
    onClose();
  }

  function checkOverlap () {
    const checkStart = newEvent.startTime;
    const checkEnd = newEvent.endTime;
    const result = rawEvents.filter(
      (event) =>
        event.ressourceId === ressource.uuid &&
        ((dayjs(checkStart) >= dayjs(event.startTime) && dayjs(checkStart) <= dayjs(event.endTime)) ||
        (dayjs(checkEnd) >= dayjs(event.startTime) && dayjs(checkEnd) <= dayjs(event.endTime)))
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
                  {t('calendar.event.newAppointmentTitle')} {ressource?.displayName ? t('dict.for') + ' ' + ressource.displayName : ''}
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
              >
                X
              </CircleButton>
            </ModalHeader>
            <ModalBody
              css={{
                padding: '0.5rem',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <CalendarEventForm event={newEvent} setMessage={setMessage} handleChangedEvent={handleChangedEvent}/>

              {/* <FormGroup>
                <Label htmlFor="eventTitleInput">{t('calendar.event.title')}</Label>
                <Input
                  id="eventTitleInput"
                  name="title"
                  value={eventTitle}
                  onChange={handleTitleChange}
                />
              </FormGroup>
              <FormGroup>

                <Label htmlFor="homevisit">{t('calendar.event.homeVisit')}</Label>
                <Input
                  type="checkbox"
                  id="isHomeVisit"
                  name="Home Visit?"
                  checked={isHomeVisit}
                  onChange={onSwitchHomeVisit}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="eventStartDatePicker">
                  {t('calendar.event.start')}
                </Label>
                <DatePicker
                  id="eventStartDatePicker"
                  name="startDate"
                  showTimeSelect
                  locale="de"
                  timeFormat="p"
                  timeIntervals={15}
                  dateFormat="Pp"
                  selected={eventStartTime.toDate()}
                  onChange={(date: ReactDatePickerReturnType) => {
                    if (date) handleStartTimeChange(date);
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="duration">{t('calendar.event.duration')}</Label>
                <Select id="duration" name="duration" value={eventDuration} onChange={handleEventDurationChange}>
                  <option value={45}>0:45</option>
                  <option value={30}>0:30</option>
                </Select>

              </FormGroup>
              <FormGroup>
                <Label htmlFor="eventEndDatePicker">
                  {t('calendar.event.end')}
                </Label>
                <DatePicker
                  id="eventEndDatePicker"
                  name="endDate"
                  showTimeSelect
                  locale="de"
                  timeFormat="p"
                  timeIntervals={15}
                  dateFormat="Pp"
                  selected={eventEndTime.toDate()}
                  onChange={(date) => {
                    if (date) handleEndTimeChange(date);
                  }}
                />
              </FormGroup>
              <hr></hr>
              <FormGroup>
                <Label htmlFor="isRecurring">{t('calendar.event.recurringAppointment')}</Label>
                <Input
                  type="checkbox"
                  id="isRecurring"
                  name="isRecurring"
                  checked={isRecurring}
                  onChange={onSwitchRecurring}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="frequency">{t('calendar.event.frequency')}</Label>
                <Select
                  id="frequency"
                  name="frequency"
                  disabled={!isRecurring}
                >
                  <option value="WEEKLY">{t('calendar.event.frequencyWeekly')}</option>
                  <option value="MONTHLY" disabled>{t('calendar.event.frequencyMonthly')}
                  </option>
                </Select>
                <Label htmlFor="interval">{t('calendar.event.interval')}</Label>
                <Input
                  id="interval"
                  name="interval"
                  type="number"
                  min={1}
                  max={20}
                  disabled={!isRecurring}
                  defaultValue={recurringInterval}
                  onChange={handleRecurringIntervalChange}
                />
              </FormGroup>
              <Popover>
                <PopoverTrigger>
                  <Button
                    type="button"
                    onClick={onBuildTimelineHandler}
                    disabled={!isRecurring}
                    css={{
                      alignSelf: 'flex-end'
                    }}
                  >
                    {t('button.preview')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent css={{
                  backgroundColor: 'white',
                  border: '1px solid #3333',
                  borderRadius: '1rem',
                  padding: '0.5rem'
                }}>
                  <PopoverArrow />
                  <PopoverCloseButton css={{
                    border: 'none',
                    borderRadius: '50%',
                    width: '1.5rem',
                    height: '1.5rem',
                    alignSelf: 'flex-end',
                    cursor: 'pointer'
                  }} />
                  <PopoverHeader></PopoverHeader>
                  <PopoverBody>{timeline}</PopoverBody>
                </PopoverContent>
              </Popover> */}
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
                justifyContent: 'end',
              }}>
                <Button type="button" onClick={onClose} variant="secondary">
                  {t('button.close')}
                </Button>
                <Button type="button" onClick={handleSubmit}>{t('button.save')}</Button>
              </div>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </div>
  );
}

export default CalendarEventInput;
