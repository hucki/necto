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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const jsonToCsv = (jsonData: any[]) => {
  if (jsonData.length === 0) {
    return '';
  }

  const headers = Object.keys(jsonData[0]);
  const csvRows = [
    headers.join(';'), // Header row
    ...jsonData.map((row) => headers.map((header) => row[header]).join(';')), // Data rows
  ];

  return csvRows.join('\n');
};

export const flattenJsonRecursively = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  entry: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: any,
  parentKey = ''
) => {
  for (const key in entry) {
    const newKey = parentKey ? `${parentKey}_${key}` : key;
    if (typeof entry[key] === 'object') {
      flattenJsonRecursively(entry[key], result, newKey);
    } else {
      result[newKey] = entry[key];
    }
  }
};
