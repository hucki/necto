import { combineReducers } from 'redux';
import newAppointment from './newAppointment';
import currentTeam from './currentTeam';
import settings from './settings';
import userData from './userData';
import teamtable from './teamtable';

export default combineReducers({
  currentTeam,
  settings,
  newAppointment,
  userData,
  teamtable,
});
