import React from 'react';
import { Tag } from '@chakra-ui/react';

interface CounterOfDoneProps {
  done: number;
  total: number;
}
export const CounterOfDone = ({ done, total }: CounterOfDoneProps) => {
  const allDone = done === total;
  return (
    <>
      <Tag size="sm" colorScheme={allDone ? 'green' : 'orange'}>
        {allDone ? done : done + ' / ' + total}
      </Tag>
    </>
  );
};
