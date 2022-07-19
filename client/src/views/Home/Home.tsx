import React from 'react';
import TodoList from '../../components/Todo/TodoList';

const Home = () => {
  return <>
    <div className="home-wrapper" style={{padding: '0 0.25rem 0 0.25rem'}}>
      <TodoList />
    </div>
  </>;
};

export default Home;