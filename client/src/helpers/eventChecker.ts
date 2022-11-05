import dayjs from 'dayjs';
import { Event, NewEvent } from '../types/Event';

interface CheckOverlapProps {
  eventToCheck: NewEvent | Event;
  eventList: Event[];
}

export function checkOverlap({ eventToCheck, eventList }: CheckOverlapProps) {
  if (eventToCheck) {
    const checkStart = eventToCheck.startTime;
    const checkEnd = eventToCheck.endTime;
    const result = eventList.filter(
      (event) =>
        !event.isCancelled &&
        (!eventToCheck.hasOwnProperty('uuid') ||
          (eventToCheck as Event).uuid !== event.uuid) &&
        eventToCheck.ressourceId === event.ressourceId &&
        ((dayjs(checkStart) >= dayjs(event.startTime) &&
          dayjs(checkStart) < dayjs(event.endTime)) ||
          (dayjs(checkEnd) > dayjs(event.startTime) &&
            dayjs(checkEnd) <= dayjs(event.endTime)))
    );
    if (!result.length) return false;
    return true;
  }
  return false;
}
