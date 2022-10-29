import { LOG_IN } from '../actions/actions';
import { LOG_OUT } from '../actions/actions';

export default function userData(
  state = { currentUser: null, currentUserId: null },
  { type, payload }
) {
  const newState = {};
  switch (type) {
    case LOG_IN:
      newState.currentUser = payload.firstName;
      newState.currentUserId = payload.id;
      return newState;
    case LOG_OUT:
      newState.currentUser = 'Guest';
      newState.currentUserId = null;
      return newState;
    default:
      return state;
  }
}
