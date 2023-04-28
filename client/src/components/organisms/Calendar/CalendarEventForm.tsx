import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Textarea,
  FormControl,
  Button,
  InputGroup,
  InputLeftElement,
  Stack,
  Radio,
  RadioGroup,
  FormErrorMessage,
} from '@chakra-ui/react';
import { BaseSyntheticEvent, ReactElement, useEffect, useState } from 'react';
import { Event, NewEvent } from '../../../types/Event';
import {
  FormGroup,
  Input,
  Select,
  FormLabel,
  Checkbox,
  LabelledInput,
} from '../../Library';
import { RRule, RRuleSet, rrulestr } from 'rrule';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';
import { useAllPatients } from '../../../hooks/patient';
import { useAllRooms } from '../../../hooks/rooms';
import { getNewUTCDate } from '../../../helpers/dataConverter';
import { RiSearchLine } from 'react-icons/ri';
import { PersonCard } from '../../molecules/Cards/PersonCard';
import { Person } from '../../../types/Person';
import { useRrule } from '../../../hooks/useRrule';
import { RecurringFrequency, RecurringInterval } from './types';
dayjs.extend(LocalizedFormat);
dayjs.extend(utc);
dayjs.locale('de');

interface PersonFilterProps {
  persons: Person[];
  // eslint-disable-next-line no-unused-vars
  handleSelectPerson: ({ person }: { person: Person }) => void;
}

const PersonFilter = ({ persons, handleSelectPerson }: PersonFilterProps) => {
  const [search, setSearch] = useState('');
  const filteredPersons = persons.filter(
    (person) =>
      person.firstName.toLowerCase().includes(search.toLowerCase()) ||
      person.lastName.toLowerCase().includes(search.toLowerCase())
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const handleSearch = (event: React.FormEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value);
  };
  const onSelectPerson = ({ person }: { person: Person }) => {
    setSearch('');
    handleSelectPerson({ person });
  };
  return (
    <>
      <Popover
        matchWidth={true}
        isOpen={Boolean(search.length)}
        placement="bottom-start"
        initialFocusRef={inputRef}
      >
        <PopoverTrigger>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <RiSearchLine />
            </InputLeftElement>
            <Input
              id="search"
              name="search"
              type="text"
              autoComplete="off"
              value={search}
              onChange={handleSearch}
              pl="2rem"
              ref={inputRef}
            />
          </InputGroup>
        </PopoverTrigger>
        <PopoverContent
          style={{
            paddingLeft: '0.2rem',
            paddingRight: '0.2rem',
            margin: 'auto 0',
            gap: '0.2rem',
            boxShadow: '3px 3px 2px #3333',
            backgroundColor: 'linen',
            width: '100%',
          }}
        >
          {!filteredPersons.length ? (
            <>{`keine Ergebinsse zu "${search}"`}</>
          ) : (
            <ul>
              {filteredPersons.map((p, i) => (
                <li
                  key={p.uuid}
                  style={{
                    borderTop: i > 0 ? '1px solid #3333' : undefined,
                    listStyle: 'none',
                  }}
                >
                  <PersonCard person={p} handleClickPerson={onSelectPerson} />
                </li>
              ))}
            </ul>
          )}
        </PopoverContent>
      </Popover>
    </>
  );
};

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
  const { rooms } = useAllRooms();
  const [recurringFrequency, setRecurringFrequency] =
    useState<RecurringFrequency>(RRule.WEEKLY);
  const [recurringInterval, setRecurringInterval] =
    useState<RecurringInterval>(10);
  const { setRruleOptions, rruleString, skippedHolidays, isPending } =
    useRrule();

  // Form state
  const [currentEvent, setCurrentEvent] = useState<Event | NewEvent>(() => ({
    ...event,
  }));
  const [currentStartTime, setCurrentStartTime] = useState<dayjs.Dayjs>(
    () => currentEvent.startTime
  );

  const [currentEndTime, setCurrentEndTime] = useState<dayjs.Dayjs>(
    () => currentEvent.endTime
  );

  const currentPerson =
    patients.length && currentEvent
      ? patients.find((p) => p.uuid === currentEvent.patientId)
      : undefined;

  const [eventDuration, setEventDuration] = useState(
    dayjs(currentEndTime).diff(dayjs(currentStartTime), 'm')
  );

  // const [skippedHolidays, setSkippedHolidays] = useState<string[]>(() => []);
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

  function onEventTypeSelect(value: Event['type']) {
    setCurrentEvent((cur) => ({
      ...cur,
      type: value,
    }));
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

  function onSelectPerson(patientId: Event['patientId']) {
    setCurrentEvent((cur) => ({
      ...cur,
      patientId,
    }));
  }
  function handleEventDurationChange(event: BaseSyntheticEvent) {
    setEventDuration(event.target.value);
    setCurrentEndTime(
      dayjs(currentStartTime.toString()).add(event.target.value, 'm')
    );
    setMessage(undefined);
  }

  function handleRecurringIntervalChange(event: BaseSyntheticEvent) {
    const value = parseInt(event.target.value);
    const interval = !value || value < 1 ? 1 : value > 20 ? 20 : value;
    setRecurringInterval(interval as RecurringInterval);
    setMessage(undefined);
  }
  // Typeguard
  const isNewEvent = (event: Event | NewEvent): event is NewEvent => {
    return !event.hasOwnProperty('uuid');
  };
  useEffect(() => {
    if (!isNewEvent(currentEvent)) return;
    if (currentEvent.isRecurring) {
      const newRruleOptions = {
        freq: recurringFrequency === 'BIWEEKLY' ? RRule.WEEKLY : RRule.WEEKLY,
        interval: recurringFrequency === 'BIWEEKLY' ? 2 : 1,
        count: recurringInterval,
        dtstart: getNewUTCDate(currentStartTime),
      };
      setRruleOptions(newRruleOptions);
    } else {
      setCurrentEvent((cur) => ({ ...cur, rrule: '' }));
    }
  }, [
    currentEvent.isRecurring,
    recurringFrequency,
    recurringInterval,
    currentStartTime,
  ]);

  useEffect(() => {
    if (isPending) return;
    if (!isNewEvent(currentEvent)) return;
    if (currentEvent.isRecurring) {
      setCurrentEvent((cur) => ({ ...cur, rrule: rruleString }));
    }
  }, [rruleString, isPending]);

  function onBuildTimelineHandler() {
    const rruleSet = rrulestr(rruleString, { forceset: true }) as RRuleSet;
    const rruleList = rruleSet.all();
    const dt = dayjs.utc(currentStartTime);
    setTimeline(
      <ul>
        {rruleList.map((date) => {
          return (
            <li key={date.toString()}>
              {dayjs
                .utc(date)
                .hour(dt.local().hour())
                .format('ddd DD.MM.YYYY HH:mm')}
            </li>
          );
        })}
        {skippedHolidays.length ? (
          <li>
            skipped: <b>{skippedHolidays.join()}</b>
          </li>
        ) : null}
      </ul>
    );
  }

  useEffect(() => {
    if (currentEvent.isHomeVisit && currentEvent.roomId) {
      setCurrentEvent((cur) => ({ ...cur, roomId: '' }));
    }
  }, [currentEvent.isHomeVisit]);
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
      startTime: dayjs(currentStartTime),
      endTime: dayjs(currentEndTime),
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
    currentEvent.patientId,
    currentEvent.roomId,
    currentStartTime,
    currentEndTime,
  ]);
  const handleStartTimeChange = (e: React.FormEvent<HTMLInputElement>) => {
    setCurrentStartTime(dayjs(e.currentTarget.value));
    setCurrentEndTime(dayjs(e.currentTarget.value).add(eventDuration, 'm'));
    setMessage(undefined);
  };
  const handleEndTimeChange = (e: React.FormEvent<HTMLInputElement>) => {
    setCurrentEndTime(dayjs(e.currentTarget.value));
    setMessage(undefined);
  };
  const isNote = currentEvent.type === 'note';

  return (
    <div>
      <FormGroup gridColsUnit="auto" gridCols={4}>
        <RadioGroup onChange={onEventTypeSelect} value={currentEvent.type}>
          <Stack direction="row">
            <Radio value="appointment" style={{ borderColor: 'grey' }}>
              Termin
            </Radio>
            <Radio value="note" style={{ borderColor: 'grey' }}>
              Notiz
            </Radio>
          </Stack>
        </RadioGroup>
      </FormGroup>
      {!isNote && (
        <FormControl id="patient" mb="0.75rem" mt="0.5rem">
          <PersonFilter
            persons={patients}
            handleSelectPerson={({ person }) => onSelectPerson(person.uuid)}
          />
          {currentPerson && <PersonCard person={currentPerson} />}
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
      <FormControl id="roomId">
        <Select
          name="roomId"
          disabled={currentEvent.isHomeVisit}
          style={{
            backgroundColor: currentEvent.roomId ? undefined : 'var(--bgNote)',
          }}
          value={currentEvent.roomId}
          onChange={onSelectChange}
        >
          <option value="">{t('label.noRoom')}</option>
          {rooms.map((room, i) => (
            <option key={i} value={room.uuid}>
              {room.displayName} (
              {room.building.displayName + ': ' + room.description})
            </option>
          ))}
        </Select>
        <FormLabel>{t('label.room')}</FormLabel>
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
      <LabelledInput
        label={t('calendar.event.start')}
        id="startTime"
        autoComplete="off"
        type="datetime-local"
        name="startTime"
        value={dayjs(currentStartTime).format('YYYY-MM-DDTHH:mm:ss')}
        onChangeHandler={handleStartTimeChange}
      />
      {!isNote && (
        <FormControl id="duration" mb="0.75rem" maxWidth="25%">
          <Select
            id="duration"
            name="duration"
            value={eventDuration}
            onChange={handleEventDurationChange}
          >
            <option value={45}>45 min</option>
            <option value={30}>30 min</option>
            <option value={60}>60 min</option>
          </Select>
          <FormLabel>{t('calendar.event.duration')}</FormLabel>
        </FormControl>
      )}
      <LabelledInput
        label={t('calendar.event.end')}
        id="endTime"
        autoComplete="off"
        type="datetime-local"
        name="endTime"
        value={dayjs(currentEndTime).format('YYYY-MM-DDTHH:mm:ss')}
        onChangeHandler={handleEndTimeChange}
        errorMessage={
          dayjs(currentEndTime).isSame(currentStartTime)
            ? t('error.event.endTimeToSmall')
            : undefined
        }
      />
      {!isNote && (
        <div>
          <hr></hr>
          <FormGroup>
            <Checkbox
              id="isRecurring"
              name="isRecurring"
              size="lg"
              my={2}
              isChecked={currentEvent.isRecurring}
              onChange={onCheckboxChange}
              isDisabled={!isNewEvent(currentEvent)}
            >
              {t('calendar.event.recurringAppointment')}
            </Checkbox>
          </FormGroup>
          <div
            style={{
              display: currentEvent.isRecurring ? 'flex' : 'none',
              justifyContent: 'space-between',
            }}
          >
            <FormControl id="frequency" mb="0.75rem" maxWidth="50%">
              <Select
                name="frequency"
                value={undefined}
                disabled={
                  !isNewEvent(currentEvent) || !currentEvent.isRecurring
                }
                onChange={onSelectChange}
              >
                <option value={RRule.WEEKLY}>
                  {t('calendar.event.frequencyWeekly')}
                </option>
                <option value="BIWEEKLY">
                  {t('calendar.event.frequencyBiWeekly')}
                </option>
                <option value={RRule.MONTHLY} disabled>
                  {t('calendar.event.frequencyMonthly')}
                </option>
              </Select>
              <FormLabel>{t('calendar.event.frequency')}</FormLabel>
            </FormControl>
            <FormControl
              id="interval"
              mb="0.75rem"
              maxWidth="25%"
              isInvalid={recurringInterval <= 1}
            >
              <Input
                name="interval"
                type="number"
                min={1}
                max={20}
                disabled={
                  !isNewEvent(currentEvent) || !currentEvent.isRecurring
                }
                defaultValue={recurringInterval || 1}
                onChange={handleRecurringIntervalChange}
              />
              <FormLabel>{t('calendar.event.interval')}</FormLabel>
              {recurringInterval <= 1 && (
                <FormErrorMessage>min 2!</FormErrorMessage>
              )}
            </FormControl>
          </div>
          {isNewEvent(currentEvent) && currentEvent.isRecurring && (
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
