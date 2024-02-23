import dayjs from 'dayjs';
import { Event, NewEvent } from '../types/Event';
import { getContractOfCurrentMonth } from './contract';

interface CheckOverlapProps {
  eventToCheck: NewEvent | Event;
  eventList: Event[];
}

interface CheckOverlapResult {
  conflicts: string[];
}

export function checkOverlap({ eventToCheck, eventList }: CheckOverlapProps) {
  const result: CheckOverlapResult = {
    conflicts: [],
  };
  if (eventToCheck) {
    const checkStart = eventToCheck.startTime;
    const checkEnd = eventToCheck.endTime;
    const conflicts = eventList
      .filter(
        (event) =>
          !event.isCancelled &&
          (!eventToCheck.hasOwnProperty('uuid') ||
            (eventToCheck as Event).uuid !== event.uuid) &&
          eventToCheck.ressourceId === event.ressourceId &&
          ((dayjs(checkStart) >= dayjs(event.startTime) &&
            dayjs(checkStart) < dayjs(event.endTime)) ||
            (dayjs(checkEnd) > dayjs(event.startTime) &&
              dayjs(checkEnd) <= dayjs(event.endTime)))
      )
      .map((event) => dayjs(event.startTime).format('lll'));
    if (conflicts.length) {
      result.conflicts = [...conflicts];
    }
  }
  return result;
}

export const getBgColorFromEvent = (event: Event) => {
  if (!event.employee) return;
  return getContractOfCurrentMonth(
    event.employee,
    dayjs(event.startTime).year(),
    dayjs(event.startTime).month()
  ).bgColor;
};
