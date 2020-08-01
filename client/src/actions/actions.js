export const ADD_APPOINTMENT = 'ADD_APPOINTMENT';
export const DELETE_APPOINTMENT = 'DELETE_APPOINTMENT';
export const CHANGE_DATE = 'CHANGE_DATE';

export function addAppointment (newAppointment) {
  return { type: ADD_APPOINTMENT, payload: newAppointment };
}

export function deleteAppointment (appointmentId) {
  return { type: DELETE_APPOINTMENT, payload: appointmentId };
}

export function changeDate (newDate) {
  return { type: CHANGE_DATE, payload: newDate };
}
