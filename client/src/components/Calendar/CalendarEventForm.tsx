/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useTranslation } from 'react-i18next';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Checkbox,
  Switch,
  Textarea,
} from '@chakra-ui/react';
import { BaseSyntheticEvent, ReactElement, useEffect, useState } from 'react';
import { Event } from '../../types/Event';
import {
  FormGroup,
  Label,
  Input,
  DatePicker,
  Select,
  Button,
} from '../Library';
import { RRule, Options } from 'rrule';
import { registerLocale } from 'react-datepicker';
import dayjs, { Dayjs } from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';
import de from 'date-fns/locale/de';
import { useAllPatients } from '../../hooks/patient';
registerLocale('de', de);
dayjs.extend(LocalizedFormat);
dayjs.extend(utc);
dayjs.locale('de');

interface CalendarEventFormProps {
  event: Event;
  handleChangedEvent: (event: Event) => void;
  setMessage: (message: string | null) => void;
}

function CalendarEventForm({
  event,
  setMessage,
  handleChangedEvent,
}: CalendarEventFormProps): JSX.Element {
  const { t } = useTranslation();
  const { isLoading: isLoadingPatients, error, patients } = useAllPatients();

  const getNewUTCDate = (dateTime: Dayjs) => {
    const dt = dayjs.utc(dateTime);
    return new Date(Date.UTC(dt.year(),dt.month(),dt.date(),dt.hour(),dt.minute(),0));
  };

  // Form state
  const [currentEvent, setCurrentEvent] = useState<Event>(() => ({...event}));
  const [rruleOptions, setRruleOptions] = useState<Partial<Options>>({
    freq: RRule.WEEKLY,
    interval: 1,
    tzid: 'Europe/Amsterdam',
    count: 10,
    dtstart: getNewUTCDate(currentEvent.startTime),
  });

  const [eventDuration, setEventDuration] = useState(
    dayjs(event.endTime).diff(dayjs(event.startTime), 'm')
  );
  const [recurringFrequency, setRecurringFrequency] =
    useState<RecurringFrequency>('WEEKLY');
  const [recurringInterval, setRecurringInterval] =
    useState<RecurringInterval>(10);
  const [timeline, setTimeline] = useState<ReactElement<any, any>>();

  function onInputChange(event:React.FormEvent<HTMLInputElement>) {
    event.preventDefault();
    const key = event.currentTarget.name;
    const value = event.currentTarget.value;
    setCurrentEvent(cur => ({...cur, [`${key}`]: value}));
    setMessage(null);
  }

  function onTextareaChange(event:React.FormEvent<HTMLTextAreaElement>) {
    event.preventDefault();
    const key = event.currentTarget.name;
    const value = event.currentTarget.value;
    setCurrentEvent(cur => ({...cur, [`${key}`]: value}));
    setMessage(null);
  }

  function onCheckboxChange(event: React.FormEvent<HTMLInputElement>) {
    event.preventDefault();
    setCurrentEvent(cur => ({...cur, [`${event.currentTarget.name}`]: event.currentTarget.checked}));
    setMessage(null);
  }

  function onIsNoteChange(event: React.FormEvent<HTMLInputElement>) {
    event.preventDefault();
    setCurrentEvent(cur => ({...cur, type: event.currentTarget.checked ? 'note' : 'Appointment'}));
    setMessage(null);
  }

  type TimeChangeProps = {
    date: ReactDatePickerReturnType
    key: 'startTime' | 'endTime'
  }

  function handleTimeChange({date, key}: TimeChangeProps) {
    if (date) {
      setCurrentEvent(cur => ({...cur, [`${key}`]: dayjs(date.toString())}));
      if (key === 'startTime') setCurrentEvent(cur => ({...cur, endTime: dayjs(date.toString()).add(eventDuration, 'm')}));
    }
    setMessage(null);
  }

  function onSelectChange(event: React.FormEvent<HTMLSelectElement>) {
    event.preventDefault();
    if (event.currentTarget.name === 'frequency') {
      setRecurringFrequency(event.currentTarget.value as RecurringFrequency);
    } else {
      setCurrentEvent(cur => ({...cur, [`${event.currentTarget.name}`]: event.currentTarget.value}));
    }
  }

  function handleEventDurationChange(event: BaseSyntheticEvent) {
    setEventDuration(event.target.value);
    setCurrentEvent(cur => ({...cur, endTime: dayjs(cur.startTime.toString()).add(event.target.value, 'm')}));
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

  useEffect(() => {
    if (currentEvent.isRecurring) {
      setRruleOptions(cur => ({
        ...cur,
        freq: recurringFrequency === 'WEEKLY' || recurringFrequency === 'BIWEEKLY' ? RRule.WEEKLY : RRule.MONTHLY,
        interval: recurringFrequency === 'BIWEEKLY' ? 2 : 1,
        count: recurringInterval,
        dtstart: getNewUTCDate(currentEvent.startTime),
      }));
    } else {
      setCurrentEvent(cur => ({...cur, rrule: ''}));
    }
  }, [currentEvent.isRecurring, recurringFrequency, recurringInterval, currentEvent.startTime]);

  useEffect(() => {
    const rrule = new RRule(rruleOptions);
    if (currentEvent.isRecurring) {
      setCurrentEvent(cur => ({...cur, rrule: rrule.toString()}));
    }
  }, [rruleOptions]);

  function onBuildTimelineHandler() {
    const rrule = new RRule(rruleOptions);
    const dt = dayjs.utc(currentEvent.startTime);
    setTimeline(
      <ul>
        {rrule.all().map((date) =>  {
          return (
            <li key={date.toString()}>
              {dayjs.utc(date).hour(dt.local().hour()).format('ddd DD.MM.YYYY HH:mm')}
            </li>
          );})}
      </ul>
    );
  }

  useEffect(() => {
    handleChangedEvent({
      uuid: currentEvent.uuid,
      userId: currentEvent.userId,
      ressourceId: currentEvent.ressourceId,
      title: currentEvent.title,
      type: currentEvent.type,
      isDiagnostic: currentEvent.isDiagnostic,
      isHomeVisit: currentEvent.isHomeVisit,
      isAllDay: currentEvent.isAllDay,
      isRecurring: currentEvent.isRecurring,
      isDone: currentEvent.isDone,
      isCancelled: currentEvent.isCancelled,
      isCancelledReason: currentEvent.isCancelledReason,
      rrule: currentEvent.rrule,
      startTime: currentEvent.startTime,
      endTime: currentEvent.endTime,
      patientId: currentEvent.patientId,
      roomId: currentEvent.roomId,
      bgColor: currentEvent.bgColor,
    });
  }, [
    currentEvent.title,
    currentEvent.type,
    currentEvent.isDiagnostic,
    currentEvent.isHomeVisit,
    currentEvent.isAllDay,
    currentEvent.isRecurring,
    currentEvent.isCancelled,
    currentEvent.isCancelledReason,
    currentEvent.rrule,
    currentEvent.startTime,
    currentEvent.endTime,
    currentEvent.patientId,
  ]);

  const isNote = currentEvent.type === 'note';
  const isDone = currentEvent.isDone;

  return (
    <div>
      <FormGroup gridColsUnit="auto" gridCols={4}>
        <Label htmlFor="isNote">Notiz</Label>
        <Switch
          id="isNote"
          name="isNote"
          isDisabled={isDone}
          colorScheme="yellow"
          isChecked={isNote}
          onChange={onIsNoteChange}
        />
      </FormGroup>
      {!isNote &&<FormGroup gridColsUnit="auto">
        <Label htmlFor="patientId">{t('calendar.event.patient')}</Label>
        <Select
          id="patient"
          name="patientId"
          value={currentEvent.patientId}
          onChange={onSelectChange}
        >
          <option key="noPatient" value="">
            No {t('calendar.event.patient')}
          </option>
          {patients.map((p) => (
            <option key={p.uuid} value={p.uuid}>
              {p.lastName + ', ' + p.firstName}
            </option>
          ))}
        </Select>
      </FormGroup>}
      <FormGroup gridColsUnit="auto">
        <Label htmlFor="title">{t(`calendar.event.${isNote ? 'text' : 'title'}`)}</Label>
        {isNote
          ? <Textarea
            id="eventTitleInput"
            name="title"
            value={currentEvent.title}
            onChange={onTextareaChange}
            style={{background: 'lightyellow'}}
            placeholder={t('calendar.event.noteTitle')}
          />
          :
          <Input
            id="eventTitleInput"
            name="title"
            value={currentEvent.title}
            onChange={onInputChange}
            placeholder={t('calendar.event.newAppointmentTitle')}
          />}
      </FormGroup>
      {!isNote &&
        <div>
          <FormGroup>
            <Checkbox
              id="isHomeVisit"
              name="isHomeVisit"
              size="lg"
              my={2}
              isChecked={currentEvent.isHomeVisit}
              onChange={onCheckboxChange}
            >{t('calendar.event.homeVisit')}</Checkbox>
          </FormGroup>
          <FormGroup>
            <Checkbox
              id="isDiagnostic"
              name="isDiagnostic"
              size="lg"
              my={2}
              isChecked={currentEvent.isDiagnostic}
              onChange={onCheckboxChange}
            >{t('calendar.event.diagnostic')}</Checkbox>
          </FormGroup>
        </div>
      }
      <FormGroup gridColsUnit="auto">
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
          selected={dayjs(currentEvent.startTime).toDate()}
          onChange={(date: ReactDatePickerReturnType) => {
            if (date) handleTimeChange({date, key: 'startTime'});
          }}
        />
      </FormGroup>
      {!isNote &&
        <FormGroup gridColsUnit="auto">
          <Label htmlFor="duration">{t('calendar.event.duration')}</Label>
          <Select
            id="duration"
            name="duration"
            value={eventDuration}
            onChange={handleEventDurationChange}
          >
            <option value={45}>0:45</option>
            <option value={30}>0:30</option>
          </Select>
        </FormGroup>
      }
      <FormGroup gridColsUnit="auto">
        <Label htmlFor="eventEndDatePicker">{t('calendar.event.end')}</Label>
        <DatePicker
          id="eventEndDatePicker"
          name="endDate"
          showTimeSelect
          locale="de"
          timeFormat="p"
          timeIntervals={15}
          dateFormat="Pp"
          selected={dayjs(currentEvent.endTime).toDate()}
          onChange={(date: ReactDatePickerReturnType) => {
            if (date) handleTimeChange({date, key: 'endTime'});
          }}
        />
      </FormGroup>
      {!isNote &&
        <div>
          <hr></hr>
          <FormGroup>
            <Label htmlFor="isRecurring">
              {t('calendar.event.recurringAppointment')}
            </Label>
            <Checkbox
              id="isRecurring"
              name="isRecurring"
              size="lg"
              my={2}
              isChecked={currentEvent.isRecurring}
              onChange={onCheckboxChange}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="frequency">{t('calendar.event.frequency')}</Label>
            <Select
              id="frequency"
              name="frequency"
              value={undefined}
              disabled={!currentEvent.isRecurring}
              onChange={onSelectChange}>
              <option value="WEEKLY">{t('calendar.event.frequencyWeekly')}</option>
              <option value="BIWEEKLY">{t('calendar.event.frequencyBiWeekly')}</option>
              <option value="MONTHLY" disabled>
                {t('calendar.event.frequencyMonthly')}
              </option>
            </Select>
            <Label htmlFor="interval">{t('calendar.event.interval')}</Label>
            <Input
              id="interval"
              name="interval"
              type="number"
              min={1}
              max={20}
              disabled={!currentEvent.isRecurring}
              defaultValue={recurringInterval}
              onChange={handleRecurringIntervalChange}
            />
          </FormGroup>
          <Popover>
            <PopoverTrigger>
              <Button
                aria-label="preview recurring events"
                type="button"
                onClick={onBuildTimelineHandler}
                disabled={!currentEvent.isRecurring}
                css={{
                  alignSelf: 'flex-end',
                }}
              >
                {t('button.preview')}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              css={{
                backgroundColor: 'white',
                border: '1px solid #3333',
                borderRadius: '1rem',
                padding: '0.5rem',
              }}
            >
              <PopoverArrow />
              <PopoverCloseButton
                css={{
                  border: 'none',
                  borderRadius: '50%',
                  width: '1.5rem',
                  height: '1.5rem',
                  alignSelf: 'flex-end',
                  cursor: 'pointer',
                }}
              />
              <PopoverHeader></PopoverHeader>
              <PopoverBody>{timeline}</PopoverBody>
            </PopoverContent>
          </Popover>
        </div>
      }
    </div>
  );
}

export default CalendarEventForm;
