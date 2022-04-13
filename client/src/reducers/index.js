import { combineReducers } from 'redux';
import newAppointment from './newAppointment';
import settings from './settings';
import userData from './userData';
import teamtable from './teamtable';

export default combineReducers({
  settings,
  newAppointment,
  userData,
  teamtable,
});
