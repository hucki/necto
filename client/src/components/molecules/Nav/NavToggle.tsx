import React from 'react';
import styled from '@emotion/styled/macro';
import { RiCloseFill, RiMenuFill } from 'react-icons/ri';
import { IconButton } from '../../atoms/Buttons';

const NavToggleWrapper = styled.div({
  position: 'absolute',
  zIndex: 15,
  top: 10,
  left: 10,
  transition: '0.5s',
  borderRadius: '0.5rem',
  '&:hover': {
    boxShadow: '0 0 15px #3339',
  },
});

interface NavToggleProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export const NavToggle = ({ isOpen, onOpen, onClose }: NavToggleProps) => {
  return (
    <NavToggleWrapper>
      <IconButton
        aria-label={isOpen ? 'close-nav' : 'open-nav'}
        w={10}
        h={10}
        colorScheme={isOpen ? 'orange' : 'leave'}
        onClick={isOpen ? onClose : onOpen}
        icon={isOpen ? <RiCloseFill size="2rem" /> : <RiMenuFill size="2rem" />}
      />
    </NavToggleWrapper>
  );
};
