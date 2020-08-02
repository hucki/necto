import { ADD_APPOINTMENT, DELETE_APPOINTMENT } from '../actions/actions';
import {events} from '../assets/data';
import { initialState } from '../assets/data';


export default function appointments(state = initialState.appointments, {type, payload}) {
  const personId = {};
  const newState = {};
  newState.teamMembers = [...state.teamMembers];
  function getPersonId (displayName) {
    const foundMember = state.teamMembers.filter(member => member.firstName === displayName);
    return foundMember[0].id;
  }
  switch (type) {
    case ADD_APPOINTMENT:
      personId.id = getPersonId(payload.rowId);
      newState.maxId = state.maxId + 1;
      newState.pureEvents = [...state.pureEvents, {id: newState.maxId, personId: personId.id, type: 'custom',...payload}];
      newState.events = events(newState.teamMembers, newState.pureEvents);
      return newState;
    case DELETE_APPOINTMENT:
      newState.maxId = state.maxId;
      newState.pureEvents = state.pureEvents.filter(event => event.id !== payload);
      newState.events = events(newState.teamMembers, newState.pureEvents);
      return newState;
    default:
      return state;
  }
}