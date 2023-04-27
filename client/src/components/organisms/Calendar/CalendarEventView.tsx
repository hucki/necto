import React from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { LabelledDataDisplay, LabelledInput } from '../../Library';
import { CalendarEventViewWrapper } from '../../atoms/Wrapper';
import { PersonCard } from '../../molecules/Cards/PersonCard';
import { CalenderEventViewProps } from './types';

const CalendarEventView = ({
  eventTitle,
  isHomeVisit,
  isRecurring,
  isDiagnostic,
  eventStartTime,
  eventEndTime,
  eventPatient,
  eventRoom,
  isNote,
}: CalenderEventViewProps) => {
  const { t } = useTranslation();
  return (
    <CalendarEventViewWrapper>
      {!isNote && eventPatient && <PersonCard person={eventPatient} />}
      {eventTitle && (
        <LabelledDataDisplay
          id="eventTitle"
          label={t(`calendar.event.${isNote ? 'text' : 'title'}`)}
          value={eventTitle}
        />
      )}
      {!isNote && (
        <>
          {isDiagnostic && (
            <LabelledDataDisplay
              id="isDiagnostic"
              value={'✅ ' + t('calendar.event.diagnostic')}
            />
          )}
          {isHomeVisit && (
            <LabelledDataDisplay
              id="isHomeVisit"
              value={'✅ ' + t('calendar.event.homeVisit')}
            />
          )}
          {isRecurring && (
            <LabelledDataDisplay
              id="isRecurringAppointment"
              value={'✅ ' + t('calendar.event.recurringAppointment')}
            />
          )}
          <LabelledDataDisplay
            id="eventStartTime"
            label={t('calendar.event.start')}
            value={dayjs(eventStartTime).format('llll')}
          />
          <LabelledDataDisplay
            id="eventEndTime"
            label={t('calendar.event.end')}
            value={dayjs(eventEndTime).format('llll')}
          />

          {eventRoom && (
            <LabelledInput
              disabled
              id="roomId"
              name="roomId"
              label={t('label.room')}
              value={
                eventRoom.displayName +
                ' (' +
                eventRoom.building.displayName +
                ': ' +
                eventRoom.description +
                ')'
              }
              onChangeHandler={() => undefined}
            />
          )}
        </>
      )}
    </CalendarEventViewWrapper>
  );
};

export default CalendarEventView;
