import { SET_HOURS } from '../actions/actions';
import { SWITCH_VIEW } from '../actions/actions';
import { initialState } from '../assets/data';

export default function settings(
  state = initialState.settings,
  { type, payload }
) {
  const newState = {};
  switch (type) {
    case SET_HOURS:
      newState.hoursInterval = payload;
      newState.currentView = state.currentView;
      return newState;
    case SWITCH_VIEW:
      newState.hoursInterval = state.hoursInterval;
      newState.currentView = payload;
      return newState;
    default:
      return state;
  }
}
