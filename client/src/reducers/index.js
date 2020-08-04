import { combineReducers } from 'redux'
import newAppointment from './newAppointment';
import appointments from './appointments';
import currentDate from './currentDate';
import settings from './settings';
import userData from './userData';
import teamtable from './teamtable';

export default combineReducers({
  appointments,
  current: currentDate,
  settings,
  newAppointment,
  userData,
  teamtable
})

