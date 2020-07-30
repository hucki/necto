export const ADD_APPOINTMENT = 'ADD_APPOINTMENT'

export function addAppointment(newAppointment) {
  return { type: ADD_APPOINTMENT, newAppointment }
}