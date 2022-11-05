export const SET_HOURS = 'SET_HOURS';
export const LOG_IN = 'LOG_IN';
export const LOG_OUT = 'LOG_OUT';
export function setHours(newHours) {
  return { type: SET_HOURS, payload: newHours };
}
export function logIn(user) {
  return { type: LOG_IN, payload: user };
}

export function logOut() {
  return { type: LOG_IN };
}
