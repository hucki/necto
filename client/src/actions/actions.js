
export const ADD_APPOINTMENT = 'ADD_APPOINTMENT'

export function addAppointment(text) {
  return { type: ADD_APPOINTMENT, text }
}