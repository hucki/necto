import { combineReducers } from 'redux'
import newAppointment from './newAppointment';
import appointments from './appointments';
import currentDate from './currentDate';
import settings from './settings';

export default combineReducers({
  appointments,
  current: currentDate,
  settings,
  newAppointment
})

