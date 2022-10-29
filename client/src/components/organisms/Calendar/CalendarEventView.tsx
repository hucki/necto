import React from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { LabelledInput } from '../../Library';
import { Icon } from '@chakra-ui/react';
import { RiCheckboxBlankLine, RiCheckLine } from 'react-icons/ri';

const CalendarEventView = ({
  eventTitle,
  isHomeVisit,
  isRecurring,
  isDiagnostic,
  eventStartTime,
  eventEndTime,
  eventPatient,
  isNote,
}: CalenderEventViewProps) => {
  const { t } = useTranslation();
  return (
    <>
      {!isNote && (
        <>
          <LabelledInput
            disabled
            id="patient"
            name="patient"
            label={t('calendar.event.patient')}
            value={
              eventPatient
                ? eventPatient.lastName + ', ' + eventPatient.firstName
                : 'no Patient'
            }
            onChangeHandler={() => undefined}
          />
        </>
      )}
      <LabelledInput
        disabled
        id="eventTitle"
        name="eventTitle"
        label={t(`calendar.event.${isNote ? 'text' : 'title'}`)}
        value={eventTitle}
        onChangeHandler={() => undefined}
      />
      {!isNote && (
        <>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {t('calendar.event.diagnostic') + ': '}
            <Icon
              as={isDiagnostic ? RiCheckLine : RiCheckboxBlankLine}
              w={5}
              h={5}
              color={isDiagnostic ? 'indigo' : 'gray.400'}
            />
          </span>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {t('calendar.event.homeVisit') + ': '}
            <Icon
              as={isHomeVisit ? RiCheckLine : RiCheckboxBlankLine}
              w={5}
              h={5}
              color={isHomeVisit ? 'indigo' : 'gray.400'}
            />
          </span>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {t('calendar.event.recurringAppointment') + ': '}
            <Icon
              as={isRecurring ? RiCheckLine : RiCheckboxBlankLine}
              w={5}
              h={5}
              color={isRecurring ? 'indigo' : 'gray.400'}
            />
          </span>
          <LabelledInput
            disabled
            id="eventStartTime"
            name="eventStartTime"
            label={t('calendar.event.start')}
            type="datetime-local"
            value={dayjs(eventStartTime).format('YYYY-MM-DDThh:mm')}
            onChangeHandler={() => undefined}
          />
          <LabelledInput
            disabled
            id="eventEndTime"
            name="eventEndTime"
            label={t('calendar.event.end')}
            type="datetime-local"
            value={dayjs(eventEndTime).format('YYYY-MM-DDThh:mm')}
            onChangeHandler={() => undefined}
          />
        </>
      )}
    </>
  );
};

export default CalendarEventView;
