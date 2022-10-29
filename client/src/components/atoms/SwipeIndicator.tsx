import { keyframes } from '@emotion/react';
import styled from '@emotion/styled/macro';

interface SwipeIndicatorProps {
  direction: 'left' | 'right';
}

const fade = keyframes({
  '0%,100%': { opacity: 0, visibility: 'hidden' },
  '25%': { opacity: 0.5, visibility: 'visible' },
});

const SwipeIndicator = styled.div((p: SwipeIndicatorProps) => ({
  width: '2rem',
  opacity: '0.50',
  visibility: 'hidden',
  height: '2rem',
  borderRadius: '100%',
  backgroundColor: 'teal',
  position: 'absolute',
  top: '50%',
  left: p.direction === 'right' ? '15px' : undefined,
  right: p.direction === 'left' ? '15px' : undefined,
  animation: `${fade} 1s ease-out`,
  '::before': {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 'x-large',
    content: p.direction === 'left' ? '">"' : '"<"',
    position: 'absolute',
    top: '-4px',
    left: '9px',
  },
}));

export { SwipeIndicator };
