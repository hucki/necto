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
import { useDaysEvents } from '../../hooks/events';
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
type ReactDatePickerReturnType = Date | [Date | null, Date | null] | null;

type RecurringFrequency = 'WEEKLY' | 'MONTHLY';
type RecurringCount =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20;

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

  const [timeline, setTimeline] = useState<ReactElement<any, any>>();
  const [eventTitle, setEventTitle] = useState(() => t('calendar.event.newAppointmentTitle'));
  const [eventStartTime, setEventStartTime] = useState(dateTime);
  const [eventEndTime, setEventEndTime] = useState(dayjs(dateTime).add(45, 'minute'));
  const [eventType, setEventType] = useState('Appointment');
  const [isHomeVisit, setIsHomeVisit] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [isAllDay, setIsAllDay] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [isCancelledReason, setIsCancelledReason] = useState('');
  const [recurringFrequency, setRecurringFrequency] =
  useState<RecurringFrequency>('WEEKLY');
  const [recurringCount, setRecurringCount] = useState<RecurringCount>(10);
  const [recurringRule, setRecurringRule] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // reset event State if new incoming datetime or uuid
    setEventTitle(defaultEvent.title);
    setEventStartTime(defaultEvent.startTime);
    setEventEndTime(defaultEvent.endTime);
    setEventType(defaultEvent.type);
    setIsHomeVisit(defaultEvent.isHomeVisit);
    setIsRecurring(defaultEvent.isRecurring);
    setIsAllDay(defaultEvent.isAllDay);
    setIsCancelled(defaultEvent.isCancelled);
    setIsCancelledReason(defaultEvent.isCancelledReason);
    setMessage(null);

  }, [dateTime, uuid]);

  const createSubmitEvent = () => {
    const event: Event = {
      userId: uuid.toString(),
      ressourceId: uuid,
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
      roomId: eventType === 'RoomBooking' ? uuid.toString() : '',
      bgColor: ressource?.bgColor || 'green',
    };
    return event;
  };

  function handleTitleChange(event: React.FormEvent<HTMLInputElement>) {
    event.preventDefault();
    setEventTitle(event.currentTarget.value);
    setMessage(null);
  }

  function handleStartTimeChange(date: ReactDatePickerReturnType) {
    if (date && typeof date !== 'object') {
      setEventStartTime(dayjs(date));
    }
    setMessage(null);
  }

  function handleEndTimeChange(date: ReactDatePickerReturnType) {
    if (date && typeof date !== 'object') {
      setEventEndTime(dayjs(date));
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
        count: recurringCount,
        dtstart: newEvent.startTime.toDate(),
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

  function handleRecurringCountChange(event: BaseSyntheticEvent) {
    const count =
      event.target.value < 1
        ? 1
        : event.target.value > 20
          ? 20
          : event.target.value;
    setRecurringCount(count);
    setMessage(null);
  }

  function handleSubmit(event: React.FormEvent<eventTitleFormElement>) {
    event.preventDefault();
    if (checkOverlap()) {
      setMessage(
        'Overlapping Appointments are not allowed. Please check again'
      );
      return false;
    }
    const eventToSubmit = createSubmitEvent();
    if (eventToSubmit) {
      createEvent({
        event: eventToSubmit,
      });
    }
    onClose();
  }

  function onBuildTimelineHandler() {
    const rrule = new RRule({
      freq: recurringFrequency === 'WEEKLY' ? RRule.WEEKLY : RRule.MONTHLY,
      tzid: 'Europe/Brussels',
      count: recurringCount,
      dtstart: newEvent.startTime.toDate(),
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
            <form
              onSubmit={handleSubmit}
              css={{
                display: 'flex',
                flexDirection: 'column',
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
                    {t('calendar.event.newAppointmentTitle')} {t('dict.for')}{' '}
                    {ressource.displayName}
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
                }}
              >
                <FormGroup>
                  <Label htmlFor="eventTitleInput">Title</Label>
                  <Input
                    id="eventTitleInput"
                    name="title"
                    value={eventTitle}
                    onChange={handleTitleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="duration">Duration</Label>
                  <Select id="duration" name="duration">
                    <option value={45}>0:45</option>
                    <option value={30}>0:30</option>
                  </Select>

                  <Label htmlFor="homevisit">Home visit?</Label>
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
                  <Label htmlFor="isRecurring">recurring Appointment?</Label>
                  <Input
                    type="checkbox"
                    id="isRecurring"
                    name="isRecurring"
                    checked={isRecurring}
                    onChange={onSwitchRecurring}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select
                    id="frequency"
                    name="frequency"
                    disabled={!isRecurring}
                  >
                    <option value="WEEKLY">weekly</option>
                    <option value="MONTHLY" disabled>
                      monthly
                    </option>
                  </Select>
                  <Label htmlFor="count">how often?</Label>
                  <Input
                    id="count"
                    name="count"
                    type="number"
                    min={1}
                    max={20}
                    disabled={!isRecurring}
                    defaultValue={recurringCount}
                    onChange={handleRecurringCountChange}
                  />
                </FormGroup>
                <Button
                  type="button"
                  onClick={onBuildTimelineHandler}
                  disabled={!isRecurring}
                >
                  preview recurring Appointments
                </Button>
                {timeline}
              </ModalBody>

              <ModalFooter
                css={{
                  padding: '0.5rem',
                }}
              >
                <div className="row">
                  {message && <ErrorMessage error={{message}}/>}
                </div>
                <div className="row">
                  <Button type="button" onClick={onClose} variant="secondary">
                    {t('button.close')}
                  </Button>
                  <Button type="submit">{t('button.save')}</Button>
                </div>
              </ModalFooter>
            </form>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </div>
  );
}

export default CalendarEventInput;
