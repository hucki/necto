import { TOGGLE_VISIBLE, CLICK_ROW, SET_END, SET_START, SET_RRULE } from '../actions/actions';
import { initialState } from '../assets/data';

export default function newAppointment (state = initialState.newAppointment, {type, payload}) {
  const newState = {};
  switch (type) {
    case TOGGLE_VISIBLE:
      newState.inputFormVisible = !state.inputFormVisible;
      newState.clickedRowId = state.clickedRowId;
      newState.startTime = state.startTime;
      newState.endTime = state.endTime;
      newState.rrule = state.rrule;
      return newState;
    case CLICK_ROW:
      newState.inputFormVisible = state.inputFormVisible;
      newState.clickedRowId = payload;
      newState.startTime = state.startTime;
      newState.endTime = state.endTime;
      newState.rrule = state.rrule;
      return newState;
    case SET_START:
      newState.inputFormVisible = state.inputFormVisible;
      newState.clickedRowId = state.clickedRowId;
      newState.startTime = payload;
      newState.endTime = state.endTime;
      newState.rrule = state.rrule;
      return newState;
    case SET_END:
      newState.inputFormVisible = state.inputFormVisible;
      newState.clickedRowId = state.clickedRowId;
      newState.startTime = state.startTime;
      newState.endTime = payload;
      newState.rrule = state.rrule;
      return newState;
    case SET_RRULE:
      newState.inputFormVisible = state.inputFormVisible;
      newState.clickedRowId = state.clickedRowId;
      newState.startTime = state.startTime;
      newState.endTime = state.endTime;
      newState.rrule = payload;
      return newState;
    default:
      return state;
  }
}

