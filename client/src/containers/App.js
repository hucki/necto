import React from 'react';
import classes from './App.module.css';
import Header from '../components/Header/Header';
import Dashboard from '../components/Dashboard/Dashboard';
import Footer from '../components/Footer/Footer';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { teamMembers, pureEvents, events} from '../assets/data';
import dayjs from 'dayjs';
import { ADD_APPOINTMENT, DELETE_APPOINTMENT, CHANGE_DATE } from '../actions/actions';

const initialState = {
  pureEvents: pureEvents,
  teamMembers: teamMembers,
  events: events(teamMembers, pureEvents),
  maxId: 4,
  currentDate: dayjs(),
  hoursInterval: [ 6, 19 ]
};

function getPersonId (displayName) {
  const foundMember = teamMembers.filter(member => member.firstName === displayName);
  return foundMember[0].id;
}

function reducer (state=initialState, {type, payload}) {
  const personId = {};
  const newState = {};
  newState.hoursInterval = [...state.hoursInterval];
  newState.teamMembers = [...state.teamMembers];
  switch (type) {
    case ADD_APPOINTMENT:
      personId.id = getPersonId(payload.rowId)
      newState.maxId = state.maxId + 1;
      newState.currentDate = state.currentDate;
      newState.pureEvents = [...state.pureEvents, {id: newState.maxId, personId: personId.id, type: 'custom',...payload}];
      newState.events = events(newState.teamMembers, newState.pureEvents);
      return newState;
    case DELETE_APPOINTMENT:
      newState.maxId = state.maxId;
      newState.currentDate = state.currentDate;
      newState.pureEvents = state.pureEvents.filter(event => event.id !== payload);
      newState.events = events(newState.teamMembers, newState.pureEvents);
      return newState;
    case CHANGE_DATE:
      newState.events = { ...state.events };
      newState.maxId = state.maxId;
      newState.pureEvents = [...state.pureEvents];
      newState.currentDate = payload;
      return newState;
    default:
      return state;
  }
}
const store = createStore(reducer);
store.subscribe(() => console.log('NEW STATE', store.getState()));
function App () {
  return (
    <Provider store = { store }>
      <div className = { classes.App }>
        <Header />

        <Dashboard />
        <Footer />
      </div>
    </Provider>
  );
}

export default App;
