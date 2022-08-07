import React from 'react';
import NewUserPanel from '../../components/InfoPanel/NewUserPanel';

const Home = () => {
  return <>
    <div className="home-wrapper" style={{padding: '0 0.25rem 0 0.25rem'}}>
      <NewUserPanel />
    </div>
  </>;
};

export default Home;