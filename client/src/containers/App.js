import React from 'react';
import classes from './App.module.css';
import Header from '../components/Header/Header';
import Dashboard from '../components/Dashboard/Dashboard';
import Footer from '../components/Footer/Footer';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import {teamMembers, pureEvents, events} from '../assets/data'
import ActionButton from 'antd/lib/modal/ActionButton';
import dayjs from 'dayjs';

const initialState = {
  events: events(teamMembers, pureEvents),
  maxId: 4,
  currentDate: dayjs(),
  hoursInterval: [ 6, 19 ]
}

function getPersonId(displayName) {
  const foundMember = teamMembers.filter(member => member.firstName === displayName);
  return foundMember[0].id;
}

function reducer(state=initialState, action) {
  const newState = {};
  newState.hoursInterval = [...state.hoursInterval]
  switch(action.type) {
    case 'ADD_APPOINTMENT':
      const personId = getPersonId(action.payload.rowId)
      newState.maxId= state.maxId + 1;
      newState.currentDate= state.currentDate
      pureEvents.push({id: newState.maxId, personId: personId, type: 'custom',...action.payload});
      newState.events= events(teamMembers, pureEvents);
      console.log(newState)
      return newState;
    case 'CHANGE_DATE':
      newState.events= {...state.events};
      newState.maxId= state.maxId;
      newState.currentDate= action.payload
      return newState;
    default:
      return state;
  }
}
const store = createStore(reducer);
store.subscribe(() => console.log("NEW STATE", store.getState()));
function App() {
  return (
    <Provider store={store}>
      <div className={classes.App}>
        <Header />

        <Dashboard />
        <Footer />
      </div>
    </Provider>
  )
}

export default App;
