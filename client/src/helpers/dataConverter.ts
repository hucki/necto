import { TeamMember } from '../types/User';
import { Event, Appointment } from '../types/Event';
import dayjs, { Dayjs } from 'dayjs';

export function appointment2Event(
  appointment: Appointment,
  userId: string
): Event | undefined {
  const newEvent: Event = {
    userId: userId,
    ressourceId: userId,
    title: appointment.title,
    type: 'custom',
    isHomeVisit: appointment.isHomeVisit,
    isRecurring: appointment.rrule ? true : false,
    isDiagnostic: false,
    isAllDay: false,
    isCancelled: false,
    isDone: false,
    isCancelledReason: '',
    rrule: appointment.rrule,
    startTime: appointment.startTime,
    endTime: appointment.endTime,
    bgColor: appointment.bgColor,
    roomId: appointment.roomId,
  };
  return newEvent;
}

export function events2Appointments(
  events: Event[],
  users: TeamMember[]
): { [k: string]: Appointment[] } | undefined {
  const newAppointments: { [k: string]: Appointment[] } = {};
  if (!events.length || !users.length) return newAppointments;

  for (let i = 0; i < events.length; i++) {
    const current = users.filter((user) => user.uuid === events[i].userId)[0];
    if (current && current.firstName) {
      if (!newAppointments[current.firstName])
        newAppointments[current.firstName] = [];
      newAppointments[current.firstName].push({
        uuid: events[i].uuid,
        rowId: current.firstName,
        title: events[i].title,
        isHomeVisit: events[i].isHomeVisit,
        rrule: events[i].rrule,
        rruleString: events[i].rrule,
        startTime: events[i].startTime,
        bgColor: current.bgColor,
        endTime: events[i].endTime,
        ressourceId: events[i].userId,
        duration: 45,
        isRecurring: events[i].isRecurring,
        frequency: 'WEEKLY',
        count: 10,
      });
    }
  }
  return newAppointments;
}

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
