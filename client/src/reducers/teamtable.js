import { SET_DIMENSIONS, SET_CELL_DIMENSIONS } from "../actions/actions";
import { initialState } from '../assets/data';

export default function teamtable(state = initialState.teamtable, {type, payload}) {
  const newState = {...state};
  switch(type) {
    case SET_DIMENSIONS:
      newState.viewportDimensions = {...payload};
      return newState;
    case SET_CELL_DIMENSIONS:
      newState.calculatedDimensions = {...payload};
      return newState;
    default:
      return state;
  }
}



