import { combineReducers } from 'redux';
import newAppointment from './newAppointment';
import currentDate from './currentDate';
import currentTeam from './currentTeam';
import currentCompany from './currentCompany';
import settings from './settings';
import userData from './userData';
import teamtable from './teamtable';

export default combineReducers({
  current: currentDate,
  currentTeam,
  currentCompany,
  settings,
  newAppointment,
  userData,
  teamtable,
});
