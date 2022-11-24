import React from 'react';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled/macro';

const spin = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

const Spinner = styled.div({
  border: '5px solid rgba(244,121,32,0.7)',
  borderLeftColor: 'rgba(108,110,112,0.1)',
  width: '2.5rem',
  height: '2.5rem',
  borderRadius: '50%',
  animation: `${spin} 1.5s cubic-bezier(0.18, 0.89, 0.32, 1.28) infinite`,
});

Spinner.defaultProps = {
  'aria-label': 'loading',
};

const FullSizeContainer = styled.div({
  fontSize: '4em',
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});
function FullPageSpinner(): JSX.Element {
  return (
    <FullSizeContainer>
      <Spinner />
    </FullSizeContainer>
  );
}

export { FullPageSpinner, Spinner };
