import React from 'react';
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
  FormControl,
  Button,
} from '@chakra-ui/react';
import { BaseSyntheticEvent, ReactElement, useEffect, useState } from 'react';
import { Event, NewEvent } from '../../../types/Event';
import {
  FormGroup,
  Label,
  Input,
  DatePicker,
  Select,
  FormLabel,
} from '../../Library';
import { RRule, Options } from 'rrule';
import { registerLocale } from 'react-datepicker';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';
import de from 'date-fns/locale/de';
import { useAllPatients } from '../../../hooks/patient';
import { getNewUTCDate } from '../../../helpers/dataConverter';
registerLocale('de', de);
dayjs.extend(LocalizedFormat);
dayjs.extend(utc);
dayjs.locale('de');

interface CalendarEventFormProps {
  event: Event | NewEvent;
  // eslint-disable-next-line no-unused-vars
  handleChangedEvent: (event: Event | NewEvent) => void;
  // eslint-disable-next-line no-unused-vars
  setMessage: (message: string | undefined) => void;
}

function CalendarEventForm({
  event,
  setMessage,
  handleChangedEvent,
}: CalendarEventFormProps): JSX.Element {
  const { t } = useTranslation();
  const { patients } = useAllPatients();

  // Form state
  const [currentEvent, setCurrentEvent] = useState<Event | NewEvent>(() => ({
    ...event,
  }));
  const [rruleOptions, setRruleOptions] = useState<Partial<Options>>({
    freq: RRule.WEEKLY,
    interval: 1,
    // FIXME: current version of rrule.all() yields invalid dates
    // when tzid is used. Quickfix: comment out tzid
    // https://github.com/jakubroztocil/rrule/issues/523
    // tzid: 'Europe/Amsterdam',
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [timeline, setTimeline] = useState<ReactElement<any, any>>();

  function onInputChange(event: React.FormEvent<HTMLInputElement>) {
    event.preventDefault();
    const key = event.currentTarget.name;
    const value = event.currentTarget.value;
    setCurrentEvent((cur) => ({ ...cur, [`${key}`]: value }));
    setMessage(undefined);
  }

  function onTextareaChange(event: React.FormEvent<HTMLTextAreaElement>) {
    event.preventDefault();
    const key = event.currentTarget.name;
    const value = event.currentTarget.value;
    setCurrentEvent((cur) => ({ ...cur, [`${key}`]: value }));
    setMessage(undefined);
  }

  function onCheckboxChange(event: React.FormEvent<HTMLInputElement>) {
    event.preventDefault();
    setCurrentEvent((cur) => ({
      ...cur,
      [`${event.currentTarget.name}`]: event.currentTarget.checked,
    }));
    setMessage(undefined);
  }

  function onIsNoteChange(event: React.FormEvent<HTMLInputElement>) {
    event.preventDefault();
    setCurrentEvent((cur) => ({
      ...cur,
      type: event.currentTarget.checked ? 'note' : 'appointment',
    }));
    setMessage(undefined);
  }

  type TimeChangeProps = {
    date: ReactDatePickerReturnType;
    key: 'startTime' | 'endTime';
  };

  function handleTimeChange({ date, key }: TimeChangeProps) {
    if (date) {
      setCurrentEvent((cur) => ({
        ...cur,
        [`${key}`]: dayjs(date.toString()),
      }));
      if (key === 'startTime')
        setCurrentEvent((cur) => ({
          ...cur,
          endTime: dayjs(date.toString()).add(eventDuration, 'm'),
        }));
    }
    setMessage(undefined);
  }

  function onSelectChange(event: React.FormEvent<HTMLSelectElement>) {
    event.preventDefault();
    if (event.currentTarget.name === 'frequency') {
      setRecurringFrequency(event.currentTarget.value as RecurringFrequency);
    } else {
      setCurrentEvent((cur) => ({
        ...cur,
        [`${event.currentTarget.name}`]: event.currentTarget.value,
      }));
    }
  }

  function handleEventDurationChange(event: BaseSyntheticEvent) {
    setEventDuration(event.target.value);
    setCurrentEvent((cur) => ({
      ...cur,
      endTime: dayjs(cur.startTime.toString()).add(event.target.value, 'm'),
    }));
    setMessage(undefined);
  }

  function handleRecurringIntervalChange(event: BaseSyntheticEvent) {
    const interval =
      event.target.value < 1
        ? 1
        : event.target.value > 20
        ? 20
        : event.target.value;
    setRecurringInterval(interval);
    setMessage(undefined);
  }

  useEffect(() => {
    if (currentEvent.isRecurring) {
      setRruleOptions((cur) => ({
        ...cur,
        freq:
          recurringFrequency === 'WEEKLY' || recurringFrequency === 'BIWEEKLY'
            ? RRule.WEEKLY
            : RRule.MONTHLY,
        interval: recurringFrequency === 'BIWEEKLY' ? 2 : 1,
        count: recurringInterval,
        dtstart: getNewUTCDate(currentEvent.startTime),
      }));
    } else {
      setCurrentEvent((cur) => ({ ...cur, rrule: '' }));
    }
  }, [
    currentEvent.isRecurring,
    recurringFrequency,
    recurringInterval,
    currentEvent.startTime,
  ]);

  useEffect(() => {
    const rrule = new RRule(rruleOptions);
    if (currentEvent.isRecurring) {
      setCurrentEvent((cur) => ({ ...cur, rrule: rrule.toString() }));
    }
  }, [rruleOptions]);

  function onBuildTimelineHandler() {
    const rrule = new RRule(rruleOptions);
    const dt = dayjs.utc(currentEvent.startTime);
    setTimeline(
      <ul>
        {rrule.all().map((date) => {
          return (
            <li key={date.toString()}>
              {dayjs
                .utc(date)
                .hour(dt.local().hour())
                .format('ddd DD.MM.YYYY HH:mm')}
            </li>
          );
        })}
      </ul>
    );
  }

  useEffect(() => {
    handleChangedEvent({
      uuid: currentEvent.hasOwnProperty('uuid')
        ? (currentEvent as Event).uuid
        : undefined,
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
  const isNewEvent = !currentEvent.hasOwnProperty('uuid');

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
      {!isNote && (
        <FormControl id="patient" mb="0.75rem" mt="0.5rem">
          <Select
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
          <FormLabel>{t('calendar.event.patient')}</FormLabel>
        </FormControl>
      )}
      <FormControl
        id="eventTitleInput"
        mb="0.75rem"
        mt={isNote ? '0.5rem' : undefined}
      >
        {isNote ? (
          <Textarea
            name="title"
            value={currentEvent.title}
            onChange={onTextareaChange}
            style={{ background: 'lightyellow' }}
            placeholder={t('calendar.event.noteTitle')}
          />
        ) : (
          <Input
            name="title"
            value={currentEvent.title}
            onChange={onInputChange}
            placeholder={t('calendar.event.newAppointmentTitle')}
          />
        )}
        <FormLabel
          style={{
            background: isNote ? 'lightyellow' : undefined,
          }}
        >
          {t(`calendar.event.${isNote ? 'text' : 'title'}`)}
        </FormLabel>
      </FormControl>
      {!isNote && (
        <div>
          <FormGroup>
            <Checkbox
              id="isHomeVisit"
              name="isHomeVisit"
              size="lg"
              my={2}
              isChecked={currentEvent.isHomeVisit}
              onChange={onCheckboxChange}
            >
              {t('calendar.event.homeVisit')}
            </Checkbox>
            <Checkbox
              id="isDiagnostic"
              name="isDiagnostic"
              size="lg"
              my={2}
              isChecked={currentEvent.isDiagnostic}
              onChange={onCheckboxChange}
            >
              {t('calendar.event.diagnostic')}
            </Checkbox>
          </FormGroup>
        </div>
      )}
      <FormControl id="eventStartDatePicker" mb="0.75rem">
        <DatePicker
          name="startDate"
          showTimeSelect
          locale="de"
          timeFormat="p"
          timeIntervals={15}
          dateFormat="Pp"
          selected={dayjs(currentEvent.startTime).toDate()}
          onChange={(date: ReactDatePickerReturnType) => {
            if (date) handleTimeChange({ date, key: 'startTime' });
          }}
        />
        <FormLabel
          style={{
            background: isNote ? 'khaki' : undefined,
          }}
        >
          {t('calendar.event.start')}
        </FormLabel>
      </FormControl>
      {!isNote && (
        <FormControl id="duration" mb="0.75rem" maxWidth="25%">
          <Select
            id="duration"
            name="duration"
            value={eventDuration}
            onChange={handleEventDurationChange}
          >
            <option value={45}>0:45</option>
            <option value={30}>0:30</option>
          </Select>
          <FormLabel>{t('calendar.event.duration')}</FormLabel>
        </FormControl>
      )}
      <FormControl id="eventEndDatePicker" mb="0.75rem">
        <DatePicker
          name="endDate"
          showTimeSelect
          locale="de"
          timeFormat="p"
          timeIntervals={15}
          dateFormat="Pp"
          selected={dayjs(currentEvent.endTime).toDate()}
          onChange={(date: ReactDatePickerReturnType) => {
            if (date) handleTimeChange({ date, key: 'endTime' });
          }}
        />
        <FormLabel
          style={{
            background: isNote ? 'khaki' : undefined,
          }}
        >
          {t('calendar.event.end')}
        </FormLabel>
      </FormControl>
      {!isNote && (
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
              isDisabled={!isNewEvent}
            />
          </FormGroup>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <FormControl id="frequency" mb="0.75rem" maxWidth="50%">
              <Select
                name="frequency"
                value={undefined}
                disabled={!isNewEvent || !currentEvent.isRecurring}
                onChange={onSelectChange}
              >
                <option value="WEEKLY">
                  {t('calendar.event.frequencyWeekly')}
                </option>
                <option value="BIWEEKLY">
                  {t('calendar.event.frequencyBiWeekly')}
                </option>
                <option value="MONTHLY" disabled>
                  {t('calendar.event.frequencyMonthly')}
                </option>
              </Select>
              <FormLabel>{t('calendar.event.frequency')}</FormLabel>
            </FormControl>
            <FormControl id="interval" mb="0.75rem" maxWidth="25%">
              <Input
                name="interval"
                type="number"
                min={1}
                max={20}
                disabled={!isNewEvent || !currentEvent.isRecurring}
                defaultValue={recurringInterval}
                onChange={handleRecurringIntervalChange}
              />
              <FormLabel>{t('calendar.event.interval')}</FormLabel>
            </FormControl>
          </div>
          {isNewEvent && (
            <>
              <Popover>
                <PopoverTrigger>
                  <Button
                    aria-label="preview recurring events"
                    type="button"
                    onClick={onBuildTimelineHandler}
                    disabled={!currentEvent.isRecurring}
                    style={{
                      alignSelf: 'flex-end',
                    }}
                  >
                    {t('button.preview')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #3333',
                    borderRadius: '1rem',
                    padding: '0.5rem',
                  }}
                >
                  <PopoverArrow />
                  <PopoverCloseButton
                    style={{
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
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default CalendarEventForm;
