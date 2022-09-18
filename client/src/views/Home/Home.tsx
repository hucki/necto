import React, { useContext } from 'react';
import NewUserPanel from '../../components/InfoPanel/NewUserPanel';
import { AuthContext } from '../../providers/AuthProvider';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <div className="home-wrapper" style={{ padding: '0 0.25rem 0 0.25rem' }}>
        {(user?.isAdmin || user?.isPlanner) && <NewUserPanel />}
      </div>
    </>
  );
};

export default Home;
