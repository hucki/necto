export const ADD_APPOINTMENT = 'ADD_APPOINTMENT';
export const DELETE_APPOINTMENT = 'DELETE_APPOINTMENT';
export const CHANGE_DATE = 'CHANGE_DATE';
export const TOGGLE_VISIBLE = 'TOGGLE_VISIBLE';
export const CLICK_ROW = 'CLICK_ROW';
export const SET_START = 'SET_START';
export const SET_END = 'SET_END';

export function addAppointment (newAppointment) {
  return { type: ADD_APPOINTMENT, payload: newAppointment };
}

export function deleteAppointment (appointmentId) {
  return { type: DELETE_APPOINTMENT, payload: appointmentId };
}

export function changeDate (newDate) {
  return { type: CHANGE_DATE, payload: newDate };
}

export function toggleVisible () {
  return { type: TOGGLE_VISIBLE };
}

export function clickRow (rowId, startTime, endTime) {
  return { type: CLICK_ROW, payload: {rowId, startTime, endTime} };
}
export function setStart (newDate) {
  return { type: SET_START, payload: newDate };
}
export function setEnd (newDate) {
  return { type: SET_END, payload: newDate };
}