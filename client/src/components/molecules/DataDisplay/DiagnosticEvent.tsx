import React from 'react';
import { Patient } from '../../../types/Patient';
import { useEvents } from '../../../hooks/events';
import dayjs from 'dayjs';
import { Icon } from '@chakra-ui/react';
import { RiCheckLine } from 'react-icons/ri';

interface DiagnosticDisplayProps {
  patientId: Patient['uuid'];
}
export const DiagnosticDisplay = ({ patientId }: DiagnosticDisplayProps) => {
  const { rawEvents: events } = useEvents({
    patientId,
    isDiagnostic: true,
    includes: 'patient,employee',
  });

  const event =
    events?.length &&
    events.filter((event) => !event.isCancelled && event.isDiagnostic).length
      ? events.filter((event) => !event.isCancelled && event.isDiagnostic)[0]
      : null;
  if (event) {
    return (
      <>
        <b>
          {dayjs(event.startTime).format('DD.MM.YY HH:mm')}
          {event.isDone && <Icon as={RiCheckLine} w={5} h={5} color="green" />}
        </b>
        {' @'}
        <i>{event.employee?.alias}</i>
      </>
    );
  }
  return null;
};
