import { SET_CURRENT_TEAM } from '../actions/actions';
import { initialState } from '../assets/data';
import { Team } from '../types/Employee';

interface CurrentTeamProps {
  type: typeof SET_CURRENT_TEAM;
  payload: Team;
}
export default function currentTeam(
  state = initialState.current,
  { type, payload }: CurrentTeamProps
) {
  const newState = {
    currentDate: state.currentDate,
    currentTeam: payload,
  };
  switch (type) {
    case SET_CURRENT_TEAM:
      return newState;
    default:
      return state;
  }
}
