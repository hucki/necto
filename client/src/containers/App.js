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
  events: events
}

function reducer(state=initialState, action) {
  switch(ActionButton.type) {
    case 'ADD_APPOINTMENT':
      return {...state, events: [... state.events, action.payload]};
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
