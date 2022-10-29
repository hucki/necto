import { SET_HOURS } from '../actions/actions';
import { SWITCH_VIEW } from '../actions/actions';

export default function settings(
  state = { hoursInterval: [6, 18], currentView: 'Appointments' },
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
