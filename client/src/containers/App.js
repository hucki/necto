import React from 'react';
import classes from './App.module.css';
import Header from '../components/Header/Header';
import Dashboard from '../components/Dashboard/Dashboard';
import Footer from '../components/Footer/Footer';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import {events} from '../assets/data'
import ActionButton from 'antd/lib/modal/ActionButton';

const initialState = {
  events: events,
  maxId: 4
}

function reducer(state=initialState, action) {
  switch(action.type) {
    case 'ADD_APPOINTMENT':
      console.log(action.payload)
      const newState = {
        events: {},
        maxId: state.maxId + 1
      }
      Object.keys(state.events).map(stateKey => {
        if (stateKey === 'Person 1') newState.events['Person 1'] = [...state.events[stateKey], {id: newState.maxId, type: 'custom', style: 'bg_green',...action.payload}];
        else newState.events['Person 2']= [...state.events[stateKey]];
      })
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
