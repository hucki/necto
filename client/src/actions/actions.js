export const ADD_APPOINTMENT = 'ADD_APPOINTMENT';
export const CHANGE_DATE = 'CHANGE_DATE';

export function addAppointment(newAppointment) {
  return { type: ADD_APPOINTMENT, payload: newAppointment }
}

export function changeDate(newDate) {
  return { type: CHANGE_DATE, payload: newDate }
}