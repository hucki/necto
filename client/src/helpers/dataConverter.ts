import { TeamMember } from '../types/User';
import { Event, Appointment } from '../types/Event';

export function appointment2Event(
  appointment: Appointment,
  userId: number
): Event | undefined {
  const newEvent: Event = {
    userId: userId,
    ressourceId: userId,
    title: appointment.title,
    type: 'custom',
    isHomeVisit: appointment.isHomeVisit,
    isRecurring: appointment.rrule ? true : false,
    isAllDay: false,
    isCancelled: false,
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
    const current = users.filter((user) => user.id === events[i].userId)[0];
    if (current && current.firstName) {
      if (!newAppointments[current.firstName])
        newAppointments[current.firstName] = [];
      newAppointments[current.firstName].push({
        id: events[i].id,
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
