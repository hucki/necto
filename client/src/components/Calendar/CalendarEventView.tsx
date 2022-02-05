/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { FaCheck } from 'react-icons/fa';

export function CalendarEventView({
  eventTitle,
  isHomeVisit,
  isRecurring,
  eventStartTime,
  eventEndTime,
}:CalenderEventViewProps) {

  const {t} = useTranslation();
  return <div css={{
    display: 'grid',
    gridTemplateColumns: '1fr 3fr'
  }}>
    <div>{t('calendar.event.title') + ': '}</div><div css={{fontWeight: 'bold'}}>{ eventTitle}</div>
    <div>{t('calendar.event.homeVisit') + ': '}</div><div css={{fontWeight: 'bold'}}>{isHomeVisit && <FaCheck /> }</div>
    <div>{t('calendar.event.recurringAppointment') + ': '}</div><div css={{fontWeight: 'bold'}}>{isRecurring && <FaCheck /> }</div>
    <div>{t('calendar.event.start') + ': ' }</div><div css={{fontWeight: 'bold'}}>{ dayjs(eventStartTime).format('llll')}</div>
    <div>{t('calendar.event.end') + ': ' }</div><div css={{fontWeight: 'bold'}}>{ dayjs(eventEndTime).format('llll')}</div>
  </div>;
}