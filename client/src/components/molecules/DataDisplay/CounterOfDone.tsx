import styled from '@emotion/styled/macro';
import React from 'react';

interface CounterOfDoneWrapperProps {
  allDone: boolean;
}
const CounterOfDoneWrapper = styled.div(
  ({ allDone = false }: CounterOfDoneWrapperProps) => ({
    backgroundColor: allDone ? 'mediumseagreen' : 'orange',
    color: 'white',
    fontSize: 'x-small',
    fontWeight: 'bold',
    borderRadius: '0.25rem',
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '2.2rem',
    height: '1rem',
    lineHeight: '1rem',
    zIndex: 1,
  })
);

interface CounterOfDoneProps {
  done: number;
  total: number;
}
export const CounterOfDone = ({ done, total }: CounterOfDoneProps) => {
  const allDone = done === total;
  return (
    <CounterOfDoneWrapper allDone={allDone}>
      {allDone ? done : done + ' / ' + total}
    </CounterOfDoneWrapper>
  );
};
