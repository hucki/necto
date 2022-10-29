import { combineReducers } from 'redux';
import settings from './settings';
import userData from './userData';

export default combineReducers({
  settings,
  userData,
});
