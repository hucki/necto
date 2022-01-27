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
  // RadioGroup,
} from '../Library';
import * as mq from '../../styles/media-queries';
import { RRule, rrulestr } from 'rrule';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/de';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useCreateEvent } from '../../hooks/events';
import { Appointment, Event } from '../../types/Event';
import { appointment2Event } from '../../helpers/dataConverter';
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
  const [newEvent, setNewEvent] = useState<Appointment>({
    rowId: uuid.toString(),
    ressourceId: uuid,
    title: t('calendar.event.newAppointmentTitle'),
    startTime: dateTime,
    duration: 45,
    endTime: dayjs(dateTime).add(45, 'minute'),
    isRecurring: false,
    isHomeVisit: false,
    frequency: 'WEEKLY',
    count: 10,
    rruleString: '',
    rrule: '',
    bgColor: ressource?.bgColor || 'green',
  });
  const [createEvent, { error: savingError }] = useCreateEvent();
  const [timeline, setTimeline] = useState<ReactElement<any, any>>();
  const [isHomeVisit, setIsHomeVisit] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState('WEEKLY');
  const [recurringCount, setRecurringCount] = useState<RecurringCount>(10);
  // console.log('startEnd', newEvent.startTime, newEvent.endTime);
  useEffect(() => {
    setNewEvent({
      ...newEvent,
      startTime: dateTime,
      endTime: dayjs(dateTime).add(45, 'minute'),
    });
  }, [dateTime]);

  function handleChange(event: React.FormEvent<HTMLInputElement>) {
    event.preventDefault();
    setNewEvent({
      ...newEvent,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  }

  function handleStartTimeChange(date: ReactDatePickerReturnType) {
    if (date && typeof date !== 'object') {
      setNewEvent({
        ...newEvent,
        startTime: dayjs(date),
      });
    }
  }

  function handleEndTimeChange(date: ReactDatePickerReturnType) {
    if (date && typeof date !== 'object') {
      setNewEvent({
        ...newEvent,
        endTime: dayjs(date),
      });
    }
  }

  function onSwitchHomeVisit(event: BaseSyntheticEvent) {
    setIsHomeVisit(event.target.checked);
  }

  function onSwitchRecurring(event: BaseSyntheticEvent) {
    setIsRecurring(event.target.checked);
  }

  function handleRecurringCountChange(event: BaseSyntheticEvent) {
    const count =
      event.target.value < 1
        ? 1
        : event.target.value > 20
          ? 20
          : event.target.value;
    setRecurringCount(count);
  }

  function handleSubmit(event: React.FormEvent<eventTitleFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const fieldValues = Object.fromEntries(formData.entries());
    setNewEvent({ ...newEvent, ...fieldValues });
    const submitEvent: Event | undefined = appointment2Event(
      { ...newEvent, ...fieldValues, bgColor: ressource.bgColor },
      uuid
    );
    if (submitEvent)
      createEvent({
        event: submitEvent,
      });
    onClose();
  }

  function onBuildTimelineHandler() {
    const rrule = new RRule({
      freq: recurringFrequency === 'WEEKLY' ? RRule.WEEKLY : RRule.MONTHLY,
      tzid: 'Europe/Brussels',
      count: recurringCount,
      dtstart: newEvent.startTime.toDate(),
    });
    // console.log(rrule.toString());
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
              // paddingBottom: '3.5em',
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
                    value={newEvent.title}
                    onChange={handleChange}
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
                  {/* <RadioGroup role="radiogroup">
                    <Input
                      type="radio"
                      id="isHomeVisit"
                      value="isHomeVisit"
                      name="homevisit"
                      onChange={onSwitchHomeVisit}
                    />
                    <Label htmlFor="isHomeVisit">Yes</Label>{' '}
                    <Input
                      type="radio"
                      id="isNotHomeVisit"
                      value="isNotHomeVisit"
                      name="homevisit"
                      onChange={onSwitchHomeVisit}
                    />
                    <Label htmlFor="isNotHomeVisit">No</Label>
                  </RadioGroup> */}
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
                    selected={newEvent.startTime.toDate()}
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
                    selected={newEvent.endTime.toDate()}
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
                <Button type="button" onClick={onClose} variant="secondary">
                  {t('button.close')}
                </Button>
                <Button type="submit">{t('button.save')}</Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </div>
  );
}

export default CalendarEventInput;
