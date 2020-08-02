import { SET_HOURS } from "../actions/actions";
import { initialState } from '../assets/data';

export default function settings(state = initialState.settings, {type, payload}) {
  const newState = {};
  switch(type) {
    case SET_HOURS:
      newState.hoursInterval = payload;
      return newState;
    default:
      return state;
  }
}

