import { SET_HOURS } from '../actions/actions';

export default function settings(
  state = { hoursInterval: [6, 18] },
  { type, payload }
) {
  const newState = {};
  switch (type) {
    case SET_HOURS:
      newState.hoursInterval = payload;
      return newState;
    default:
      return state;
  }
}
