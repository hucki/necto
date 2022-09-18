import { Box, Checkbox, Heading, IconButton, VStack } from '@chakra-ui/react';
import React from 'react';
import { FaTrash } from 'react-icons/fa';
import Drag from '../DragDrop/Drag';
import DropTarget from '../DragDrop/DropTarget';
// import { IconButton } from '../Library';

type Todo = {
  id: string;
  todo: string;
  sort: number;
  isCompleted: boolean;
  isDeleted: boolean;
  isDue: string;
};

const todos: Todo[] = [
  {
    id: '1',
    sort: 0,
    todo: '1 do this',
    isCompleted: false,
    isDeleted: false,
    isDue: 'tomorrow',
  },
  {
    id: '2',
    sort: 1,
    todo: '2 do that',
    isCompleted: true,
    isDeleted: false,
    isDue: 'tomorrow',
  },
  {
    id: '3',
    sort: 2,
    todo: '3 do another thingy',
    isCompleted: true,
    isDeleted: true,
    isDue: 'tomorrow',
  },
];

type TodoItemProps = {
  todo: Todo;
};

const TodoItem = ({ todo }: TodoItemProps) => {
  return (
    <>
      <Drag dataItem={todo.id}>
        <Box
          textDecoration={todo.isDeleted ? 'line-through' : undefined}
          display="grid"
          gridTemplateColumns="auto 42px"
          gridTemplateAreas="checkbox delete"
          justifyItems="stretch"
          p="1"
          width="100%"
          border="1px solid #3333"
          borderRadius="0.5rem"
          paddingLeft="0.5rem"
          onDrop={() => console.log('dropped on ', todo.id)}
        >
          <Checkbox isChecked={todo.isCompleted}>{todo.todo}</Checkbox>
          <IconButton
            size="sm"
            disabled={todo.isDeleted}
            aria-label="delete todo"
            colorScheme="orange"
            icon={<FaTrash />}
          />
        </Box>
      </Drag>
    </>
  );
};

const TodoList = () => {
  const todoItems = todos
    .sort((a, b) => (a.sort > b.sort ? 1 : -1))
    .map((t) => <TodoItem todo={t} key={t.id} />);
  return (
    <>
      <div className="todo-wrapper">
        <Heading as="h2" size="md" mb="2">
          Was steht an?
        </Heading>
        <DropTarget
          onItemDropped={(item) => console.log(item)}
          dropEffect="link"
        >
          <VStack>{todoItems}</VStack>
        </DropTarget>
      </div>
    </>
  );
};

export default TodoList;
