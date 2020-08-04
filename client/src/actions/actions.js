export const ADD_APPOINTMENT = 'ADD_APPOINTMENT';
export const DELETE_APPOINTMENT = 'DELETE_APPOINTMENT';
export const CHANGE_DATE = 'CHANGE_DATE';
export const TOGGLE_VISIBLE = 'TOGGLE_VISIBLE';
export const CLICK_ROW = 'CLICK_ROW';
export const SET_START = 'SET_START';
export const SET_END = 'SET_END';
export const SET_HOURS = 'SET_HOURS';
export const SET_RRULE = 'SET_RRULE';
export const SWITCH_VIEW = 'SWITCH_VIEW';
export const LOG_IN = 'LOG_IN';
export const LOG_OUT = 'LOG_OUT';
export const SET_DIMENSIONS = 'SET_DIMENSIONS';
export const SET_CELL_DIMENSIONS = 'SET_CELL_DIMENSIONS';

export function setHours (newHours) {
  return { type: SET_HOURS, payload: newHours };
}

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

export function clickRow (rowId) {
  return { type: CLICK_ROW, payload: rowId };
}
export function setStart (newDate) {
  return { type: SET_START, payload: newDate };
}
export function setEnd (newDate) {
  return { type: SET_END, payload: newDate };
}
export function setRrule (rruleString) {
  return { type: SET_RRULE, payload: rruleString };
}

export function switchView (newView) {
  return { type: SWITCH_VIEW, payload: newView };
}

export function logIn (user) {
  return { type: LOG_IN, payload: user};
}

export function logOut () {
  return { type: LOG_IN};
}

export function setDimensions (dimensions) {
  return {type: SET_DIMENSIONS, payload: dimensions}
}

export function setCellDimensions (cellDimensions) {
  return {type: SET_CELL_DIMENSIONS, payload: cellDimensions}
}