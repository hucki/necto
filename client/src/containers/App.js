import React from 'react';
import classes from './App.module.css';
import Header from '../components/Header/Header';
import Dashboard from '../components/Dashboard/Dashboard';
import Footer from '../components/Footer/Footer';

function App() {
  return (
    <div className={classes.App}>
      <Header />

      <Dashboard />
      <Footer />
    </div>
  )
}

export default App;
