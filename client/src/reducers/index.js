import { combineReducers } from 'redux';
import newAppointment from './newAppointment';
import currentTeam from './currentTeam';
import currentCompany from './currentCompany';
import settings from './settings';
import userData from './userData';
import teamtable from './teamtable';

export default combineReducers({
  currentTeam,
  currentCompany,
  settings,
  newAppointment,
  userData,
  teamtable,
});
