import { Event } from '../types/Event';
import dayjs, { Dayjs } from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';
import { Patient, patientUpdateKeys } from '../types/Patient';
dayjs.extend(LocalizedFormat);
dayjs.extend(utc);
dayjs.locale('de');

export const getNewUTCDate = (dateTime: Dayjs) => {
  const dt = dayjs.utc(dateTime);
  return new Date(
    Date.UTC(dt.year(), dt.month(), dt.date(), dt.hour(), dt.minute(), 0)
  );
};

export const getEventSeries = (event: Event) => {
  const parentEventId = event.parentEventId || event.uuid;
  const startTime = event.parentEvent
    ? event.parentEvent.startTime
    : event.startTime;
  const endTime =
    event.parentEvent && event.parentEvent.childEvents?.length
      ? event.parentEvent.childEvents[event.parentEvent.childEvents.length - 1]
          .endTime
      : event.endTime;
  return {
    parentEventId,
    startTime,
    endTime,
  };
};

export const sanitizePatient = (patient: Patient): Patient => {
  return patientUpdateKeys.reduce((prev, cur) => {
    return { ...prev, [cur]: (patient as Patient)[cur] };
  }, {}) as Patient;
};
