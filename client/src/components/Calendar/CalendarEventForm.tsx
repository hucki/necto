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
import RRule from 'rrule';
import { registerLocale } from 'react-datepicker';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import de from 'date-fns/locale/de';
registerLocale('de', de);
dayjs.extend(LocalizedFormat);
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

  // Form state
  const [eventTitle, setEventTitle] = useState(event.title);
  const [eventDuration, setEventDuration] = useState(
    dayjs(event.endTime).diff(dayjs(event.startTime), 'm')
  );
  const [eventStartTime, setEventStartTime] = useState(event.startTime);
  const [eventEndTime, setEventEndTime] = useState(event.endTime);
  const [eventType, setEventType] = useState(event.type);
  const [isHomeVisit, setIsHomeVisit] = useState(event.isHomeVisit);
  const [isRecurring, setIsRecurring] = useState(event.isRecurring);
  const [isAllDay, setIsAllDay] = useState(event.isAllDay);
  const [isCancelled, setIsCancelled] = useState(event.isCancelled);
  const [isCancelledReason, setIsCancelledReason] = useState(
    event.isCancelledReason
  );
  const [recurringFrequency, setRecurringFrequency] =
    useState<RecurringFrequency>('WEEKLY');
  const [recurringInterval, setRecurringInterval] =
    useState<RecurringInterval>(10);
  const [recurringRule, setRecurringRule] = useState(event.rrule);
  const [timeline, setTimeline] = useState<ReactElement<any, any>>();

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
  function onSwitchRecurring(event: BaseSyntheticEvent) {
    // checkOverlap();
    setIsRecurring(event.target.checked);
    setMessage(null);
  }

  function handleEventDurationChange(event: BaseSyntheticEvent) {
    setEventDuration(event.target.value);
    setEventEndTime(
      dayjs(eventStartTime.toString()).add(event.target.value, 'm')
    );

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
    if (isRecurring) {
      const rrule = new RRule({
        freq: recurringFrequency === 'WEEKLY' ? RRule.WEEKLY : RRule.MONTHLY,
        tzid: 'Europe/Brussels',
        count: recurringInterval,
        dtstart: dayjs(eventStartTime).toDate(),
      });
      setRecurringRule(rrule.toString());
    } else {
      setRecurringRule('');
    }
  }, [isRecurring]);
  function onBuildTimelineHandler() {
    const rrule = new RRule({
      freq: recurringFrequency === 'WEEKLY' ? RRule.WEEKLY : RRule.MONTHLY,
      tzid: 'Europe/Brussels',
      count: recurringInterval,
      dtstart: dayjs(eventStartTime).toDate(),
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

  useEffect(() => {
    handleChangedEvent({
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
      bgColor: event.bgColor,
    });
  }, [
    eventTitle,
    eventType,
    isHomeVisit,
    isAllDay,
    isRecurring,
    isCancelled,
    isCancelledReason,
    recurringRule,
    eventStartTime,
    eventEndTime,
  ]);

  return (
    <div>
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
      <FormGroup>
        <Label htmlFor="eventEndDatePicker">{t('calendar.event.end')}</Label>
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
        <Label htmlFor="isRecurring">
          {t('calendar.event.recurringAppointment')}
        </Label>
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
        <Select id="frequency" name="frequency" disabled={!isRecurring}>
          <option value="WEEKLY">{t('calendar.event.frequencyWeekly')}</option>
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
          disabled={!isRecurring}
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
            disabled={!isRecurring}
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
  );
}

export default CalendarEventForm;
