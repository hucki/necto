import React from 'react';
import classes from './App.module.css';
import Header from '../components/Header/Header';
import Dashboard from '../components/Dashboard/Dashboard';
import Footer from '../components/Footer/Footer';
import { createStore } from 'redux';
import reducer from '../reducers/index';
import { Provider } from 'react-redux';
import { teamMembers, pureEvents, events} from '../assets/data';
import dayjs from 'dayjs';
import { ADD_APPOINTMENT, DELETE_APPOINTMENT, CLICK_ROW, CHANGE_DATE, TOGGLE_VISIBLE, SET_START, SET_END } from '../actions/actions';

const initialState = {
  appointments: {
    pureEvents: pureEvents,
    teamMembers: teamMembers,
    events: events(teamMembers, pureEvents),
    maxId: pureEvents.length
  },
  currentDate: dayjs(),
  setting: { hoursInterval: [ 6, 19 ] },
  newAppointment: {
    inputFormVisible: false,
    clickedRowId: '',
    startTime: dayjs().set('seconds',0),
    endTime: dayjs().add(45, 'm').set('seconds',0)
  }
};


/*
function reducer (state=initialState, {type, payload}) {
  const personId = {};
  const newState = {};
  newState.newAppointment = {}
  newState.hoursInterval = [...state.hoursInterval];
  newState.teamMembers = [...state.teamMembers];
  switch (type) {
    case ADD_APPOINTMENT:
      personId.id = getPersonId(payload.rowId);
      newState.maxId = state.maxId + 1;
      newState.currentDate = state.currentDate;
      newState.pureEvents = [...state.pureEvents, {id: newState.maxId, personId: personId.id, type: 'custom',...payload}];
      newState.events = events(newState.teamMembers, newState.pureEvents);
      newState.newAppointment.inputFormVisible = state.newAppointment.inputFormVisible;
      newState.newAppointment.clickedRowId = state.newAppointment.clickedRowId;
      newState.newAppointment.startTime = state.newAppointment.startTime;
      newState.newAppointment.endTime = state.newAppointment.endTime;
      return newState;
    case DELETE_APPOINTMENT:
      newState.maxId = state.maxId;
      newState.currentDate = state.currentDate;
      newState.pureEvents = state.pureEvents.filter(event => event.id !== payload);
      newState.events = events(newState.teamMembers, newState.pureEvents);
      newState.newAppointment.inputFormVisible = state.newAppointment.inputFormVisible;
      newState.newAppointment.clickedRowId = state.newAppointment.clickedRowId;
      newState.newAppointment.startTime = state.newAppointment.startTime;
      newState.newAppointment.endTime = state.newAppointment.endTime;
      return newState;
    case CHANGE_DATE:
      newState.events = { ...state.events };
      newState.maxId = state.maxId;
      newState.pureEvents = [...state.pureEvents];
      newState.currentDate = payload;
      newState.newAppointment.inputFormVisible = state.newAppointment.inputFormVisible;
      newState.newAppointment.clickedRowId = state.newAppointment.clickedRowId;
      newState.newAppointment.startTime = state.newAppointment.startTime;
      newState.newAppointment.endTime = state.newAppointment.endTime;
      return newState;
    case TOGGLE_VISIBLE:
      newState.events = { ...state.events };
      newState.maxId = state.maxId;
      newState.pureEvents = [...state.pureEvents];
      newState.currentDate = state.currentDate;
      newState.newAppointment.inputFormVisible = !state.newAppointment.inputFormVisible;
      newState.newAppointment.clickedRowId = state.newAppointment.clickedRowId;
      newState.newAppointment.startTime = state.newAppointment.startTime;
      newState.newAppointment.endTime = state.newAppointment.endTime;
      return newState;
    case CLICK_ROW:
      newState.events = { ...state.events };
      newState.maxId = state.maxId;
      newState.pureEvents = [...state.pureEvents];
      newState.currentDate = state.currentDate;
      newState.newAppointment.inputFormVisible = state.newAppointment.inputFormVisible;
      newState.newAppointment.clickedRowId = payload.rowId;
      newState.newAppointment.startTime = payload.startTime;
      newState.newAppointment.endTime = payload.endTime;
      return newState;
    case SET_START:
      newState.events = { ...state.events };
      newState.maxId = state.maxId;
      newState.pureEvents = [...state.pureEvents];
      newState.currentDate = state.currentDate;
      newState.newAppointment.inputFormVisible = state.newAppointment.inputFormVisible;
      newState.newAppointment.clickedRowId = state.newAppointment.clickedRowId;
      newState.newAppointment.startTime = payload;
      newState.newAppointment.endTime = state.newAppointment.endTime;
      return newState;
    case SET_END:
      newState.events = { ...state.events };
      newState.maxId = state.maxId;
      newState.pureEvents = [...state.pureEvents];
      newState.currentDate = state.currentDate;
      newState.newAppointment.inputFormVisible = state.newAppointment.inputFormVisible;
      newState.newAppointment.clickedRowId = state.newAppointment.clickedRowId;
      newState.newAppointment.startTime = state.newAppointment.startTime;
      newState.newAppointment.endTime = payload;
      return newState;
   default:
      return state;
  }
}
*/
const store = createStore(reducer, initialState);
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
