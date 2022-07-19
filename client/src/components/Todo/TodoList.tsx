import React from 'react';

const todos = [
  {
    id: 1,
    todo: 'do this',
    isCompleted: false,
    isDeleted: false,
    isDue: 'tomorrow'
  },
  {
    id: 2,
    todo: 'do that',
    isCompleted: true,
    isDeleted: false,
    isDue: 'tomorrow'
  }
];

const TodoList = () => {
  const todoItems = todos.map(t => <li key={t.id}>{t.todo}</li>);
  return <>
    <ul>
      {todoItems}
    </ul>
  </>;
};

export default TodoList;