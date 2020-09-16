import { combineReducers } from 'redux';
import newAppointment from './newAppointment';
import currentDate from './currentDate';
import settings from './settings';
import userData from './userData';
import teamtable from './teamtable';

export default combineReducers({
  current: currentDate,
  settings,
  newAppointment,
  userData,
  teamtable,
});
