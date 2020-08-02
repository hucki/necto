import { combineReducers } from 'redux'
import { teamMembers, pureEvents, events} from '../assets/data';
import newAppointment from './newAppointment';
import appointments from './appointments';
import currentDate from './currentDate';
import settings from './settings';
import dayjs from 'dayjs';

export default combineReducers({
  appointments,
  current: currentDate,
  settings,
  newAppointment
})

