import { CHANGE_DATE } from "../actions/actions";
import { initialState } from '../assets/data';

export default function currentDate(state = initialState.current, {type, payload}) {
  const newState = {};
  switch(type) {
    case CHANGE_DATE:
      newState.currentDate = payload;
      return newState;
    default:
      return state;
  }
}

