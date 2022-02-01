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
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
} from '@chakra-ui/react';
import { useState, useEffect, BaseSyntheticEvent, ReactElement } from 'react';
import {
  Button,
  CircleButton,
  FormGroup,
  Input,
  Label,
  DatePicker,
  Select,
  ErrorMessage,
  // RadioGroup,
} from '../Library';
import * as mq from '../../styles/media-queries';
import { RRule, rrulestr } from 'rrule';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/de';
import { useDaysEvents, useUpdateEvent } from '../../hooks/events';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useCreateEvent } from '../../hooks/events';
import { Event } from '../../types/Event';
import { EmployeeRessource, Room } from '../../types/Ressource';
import { FaHouseUser, FaLink } from 'react-icons/fa';
import de from 'date-fns/locale/de';
registerLocale('de', de);
dayjs.extend(LocalizedFormat);
dayjs.locale('de');

interface CalendarEventEditProps {
  event: Event;
  isOpen: boolean;
  isReadOnly: boolean;
  onOpen: () => void;
  onClose: () => void;
}
interface FormElements extends HTMLFormControlsCollection {
  eventTitleInput: HTMLInputElement;
}
interface eventTitleFormElement extends HTMLFormElement {
  elements: FormElements;
}

function CalendarEventEdit({
  event,
  isOpen,
  isReadOnly = false,
  onOpen,
  onClose,
}: CalendarEventEditProps): JSX.Element {
  const { t } = useTranslation();
  console.log({isReadOnly});

  const { isLoading, isError, rawEvents } = useDaysEvents(
    event.startTime
  );

  const [updateEvent, { error: savingError }] = useUpdateEvent();

  const [timeline, setTimeline] = useState<ReactElement<any, any>>();
  const [eventTitle, setEventTitle] = useState(event.title);
  const [eventDuration, setEventDuration] = useState(dayjs(event.endTime).diff(dayjs(event.startTime),'m'));
  const [eventStartTime, setEventStartTime] = useState(event.startTime);
  const [eventEndTime, setEventEndTime] = useState(event.endTime);
  const [eventType, setEventType] = useState(event.type);
  const [isHomeVisit, setIsHomeVisit] = useState(event.isHomeVisit);
  const [isRecurring, setIsRecurring] = useState(event.isRecurring);
  const [isAllDay, setIsAllDay] = useState(event.isAllDay);
  const [isCancelled, setIsCancelled] = useState(event.isCancelled);
  const [isCancelledReason, setIsCancelledReason] = useState(event.isCancelledReason);
  const [recurringFrequency, setRecurringFrequency] =
  useState<RecurringFrequency>('WEEKLY');
  const [recurringInterval, setRecurringInterval] = useState<RecurringInterval>(10);
  const [recurringRule, setRecurringRule] = useState(event.rrule);
  const [message, setMessage] = useState<string | null>(null);

  const createUpdateEvent = () => {
    const updatedEvent: Event = {
      uuid: event.uuid,
      userId: event.userId,
      ressourceId: event.ressourceId,
      title: eventTitle,
      type: eventType,
      isHomeVisit: isHomeVisit,
      isAllDay: isAllDay,
      isRecurring: isRecurring,
      isCancelled: isCancelled,
      isCancelledReason: isCancelledReason,
      rrule: recurringRule,
      startTime: eventStartTime,
      endTime: eventEndTime,
      roomId: event.roomId,
      bgColor: event.bgColor
    };
    return updatedEvent;
  };

  function handleTitleChange(event: React.FormEvent<HTMLInputElement>) {
    event.preventDefault();
    setEventTitle(event.currentTarget.value);
    setMessage(null);
  }

  function handleStartTimeChange(date: ReactDatePickerReturnType) {
    if (date) {
      setEventStartTime(dayjs(date.toString()));
      setEventEndTime(dayjs(date.toString()).add(eventDuration, 'm'));
    }
    setMessage(null);
  }

  function handleEndTimeChange(date: ReactDatePickerReturnType) {
    if (date) {
      setEventEndTime(dayjs(date.toString()));
    }
    setMessage(null);
  }

  function onSwitchHomeVisit(event: BaseSyntheticEvent) {
    setIsHomeVisit(event.target.checked);
    setMessage(null);
  }

  useEffect(()=> {
    if (isRecurring) {
      const rrule = new RRule({
        freq: recurringFrequency === 'WEEKLY' ? RRule.WEEKLY : RRule.MONTHLY,
        tzid: 'Europe/Brussels',
        count: recurringInterval,
        dtstart: eventStartTime.toDate(),
      });
      setRecurringRule(rrule.toString());
    } else {
      setRecurringRule('');
    }

  }, [isRecurring]);

  function onSwitchRecurring(event: BaseSyntheticEvent) {
    checkOverlap();
    setIsRecurring(event.target.checked);
    setMessage(null);
  }

  function handleEventDurationChange(event: BaseSyntheticEvent) {
    setEventDuration(event.target.value);
    setEventEndTime(dayjs(eventStartTime.toString()).add(event.target.value, 'm'));

    setMessage(null);
  }

  function handleRecurringIntervalChange(event: BaseSyntheticEvent) {
    const interval =
      event.target.value < 1
        ? 1
        : event.target.value > 20
          ? 20
          : event.target.value;
    setRecurringInterval(interval);
    setMessage(null);
  }

  function handleSubmit() {
    if (checkOverlap()) {
      setMessage(
        t('error.event.overlapping')
      );
      return false;
    }
    const eventToSubmit = createUpdateEvent();
    if (eventToSubmit) {
      updateEvent({
        event: eventToSubmit,
      });
    }
    onClose();
  }

  function onBuildTimelineHandler() {
    const rrule = new RRule({
      freq: recurringFrequency === 'WEEKLY' ? RRule.WEEKLY : RRule.MONTHLY,
      tzid: 'Europe/Brussels',
      count: recurringInterval,
      dtstart: eventStartTime.toDate(),
    });
    setRecurringRule(rrule.toString());
    setTimeline(
      <ul>
        {rrule.all().map((date) => (
          <li key={date.toString()}>
            {dayjs(date).format('ddd DD.MM.YYYY HH:mm')}
          </li>
        ))}
      </ul>
    );
  }

  function checkOverlap () {
    // console.log(rowId, events)
    const checkStart = eventStartTime;
    const checkEnd = eventEndTime;
    const result = rawEvents.filter(
      (checkEvent) =>
        checkEvent.ressourceId === event.ressourceId &&
        ((dayjs(checkStart) >= dayjs(checkEvent.startTime) && dayjs(checkStart) <= dayjs(checkEvent.endTime)) ||
        (dayjs(checkEnd) >= dayjs(checkEvent.startTime) && dayjs(checkEnd) <= dayjs(checkEvent.endTime)))
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
              {isHomeVisit && (
                <FaHouseUser
                  css={{
                    width: '2rem',
                    height: '2rem',
                  }}
                />
              )}
              {isRecurring && (
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
              <FormGroup>
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
                  selected={dayjs(eventStartTime).toDate()}
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
                  selected={dayjs(eventEndTime).toDate()}
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
              </Popover>
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

export default CalendarEventEdit;
