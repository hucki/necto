import styled from '@emotion/styled/macro';
import React from 'react';

interface CounterOfDoneWrapperProps {
  allDone: boolean;
  isWide: boolean;
}
const CounterOfDoneWrapper = styled.div(
  ({ allDone = false, isWide = false }: CounterOfDoneWrapperProps) => ({
    backgroundColor: allDone ? 'mediumseagreen' : 'orange',
    color: 'white',
    fontSize: 'x-small',
    fontWeight: 'bold',
    borderRadius: '0.25rem',
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: isWide ? '2.5rem' : '1.5rem',
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
  console.log({ done, total });
  const allDone = done === total;
  return (
    <CounterOfDoneWrapper
      allDone={allDone}
      isWide={Boolean(!allDone && total > 10)}
    >
      {allDone ? done : done + ' / ' + total}
    </CounterOfDoneWrapper>
  );
};
