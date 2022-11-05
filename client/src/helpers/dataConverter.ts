import { Event } from '../types/Event';
import dayjs, { Dayjs } from 'dayjs';

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
