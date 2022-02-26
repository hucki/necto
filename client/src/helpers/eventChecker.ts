import dayjs from 'dayjs';
import { Event } from '../types/Event';

interface CheckOverlapProps {
  eventToCheck: Event;
  eventList: Event[];
}

export function checkOverlap({ eventToCheck, eventList }: CheckOverlapProps) {
  if (eventToCheck) {
    const newEvent = !eventToCheck.uuid;
    console.log({ newEvent, eventToCheck, eventList });
    const checkStart = eventToCheck.startTime;
    const checkEnd = eventToCheck.endTime;
    const result = eventList.filter(
      (event) =>
        (newEvent || eventToCheck.uuid !== event.uuid) &&
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
