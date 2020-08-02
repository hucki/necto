import React from 'react';
import classes from './App.module.css';
import Header from '../components/Header/Header';
import Dashboard from '../components/Dashboard/Dashboard';
import Footer from '../components/Footer/Footer';
import { createStore } from 'redux';
import reducer from '../reducers/index';
import { Provider } from 'react-redux';

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
