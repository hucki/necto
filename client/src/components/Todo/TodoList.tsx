import { Box, Checkbox, VStack } from '@chakra-ui/react';
import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { IconButton } from '../Library';

type Todo = {
  id: string
  todo: string
  isCompleted: boolean
  isDeleted: boolean
  isDue: string
}

const todos: Todo[] = [
  {
    id: '1',
    todo: 'do this',
    isCompleted: false,
    isDeleted: false,
    isDue: 'tomorrow'
  },
  {
    id: '2',
    todo: 'do that',
    isCompleted: true,
    isDeleted: false,
    isDue: 'tomorrow'
  }
];



type TodoItemProps = {
  todo: Todo
}

const TodoItem = ({todo}: TodoItemProps) => {
  return <>
    <Box
      textDecoration={todo.isDeleted ? 'line-through' : undefined}
      alignItems="flex-start"
      p="1"
    >
      <Checkbox isChecked={todo.isCompleted}>{todo.todo}</Checkbox>
      <IconButton
        size="sm"
        aria-label="delete todo"
        icon={<FaTrash />}
      />
    </Box>
  </>;
};

const TodoList = () => {
  const todoItems = todos.map(t => <TodoItem todo={t} key={t.id} />);
  return <>
    <VStack>
      {todoItems}
    </VStack>
  </>;
};

export default TodoList;