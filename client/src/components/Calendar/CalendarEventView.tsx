import React from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { FaCheck } from 'react-icons/fa';
import styled from '@emotion/styled';

const DataWrapper = styled.div({
  display: 'grid',
  gridTemplateColumns: '1fr 3fr',
});
const DataDisplay = styled.div({fontWeight: 'bold'});

const CalendarEventView = ({
  eventTitle,
  isHomeVisit,
  isRecurring,
  isDiagnostic,
  eventStartTime,
  eventEndTime,
  eventPatient,
  isNote
}:CalenderEventViewProps) => {

  const {t} = useTranslation();
  return <DataWrapper>
    {!isNote && <><div>{t('calendar.event.patient') + ': '}</div><DataDisplay>{eventPatient ? eventPatient.lastName + ', ' +  eventPatient.firstName : 'no Patient'}</DataDisplay></>}
    <div>{t(`calendar.event.${isNote ? 'text' : 'title'}`) + ': '}</div><DataDisplay>{ eventTitle}</DataDisplay>
    {!isNote && <>
      <div>{t('calendar.event.diagnostic') + ': '}</div><DataDisplay>{isDiagnostic && <FaCheck /> }</DataDisplay>
      <div>{t('calendar.event.homeVisit') + ': '}</div><DataDisplay>{isHomeVisit && <FaCheck /> }</DataDisplay>
      <div>{t('calendar.event.recurringAppointment') + ': '}</div><DataDisplay>{isRecurring && <FaCheck /> }</DataDisplay>
      <div>{t('calendar.event.start') + ': ' }</div><DataDisplay>{ dayjs(eventStartTime).format('llll')}</DataDisplay>
      <div>{t('calendar.event.end') + ': ' }</div><DataDisplay>{ dayjs(eventEndTime).format('llll')}</DataDisplay>
    </>}
  </DataWrapper>;
};

export default CalendarEventView;