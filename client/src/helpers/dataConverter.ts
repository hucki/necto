import { TeamMember } from '../types/User';
import { Event, Appointment } from '../types/Event';

export function appointment2Event(
  appointment: Appointment,
  userId: number
): Event | undefined {
  const newEvent = {
    userId: userId,
    name: appointment.name,
    type: 'custom',
    homeVisit: appointment.homeVisit,
    rrule: appointment.rrule,
    startTime: appointment.startTime,
    endTime: appointment.endTime,
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
        name: events[i].name,
        homeVisit: events[i].homeVisit,
        rrule: events[i].rrule,
        startTime: events[i].startTime,
        bgColor: current.bgColor,
        endTime: events[i].endTime,
      });
    }
  }
  return newAppointments;
}
