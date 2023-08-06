import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import React from 'react';
import AppLogo from '../../../assets/AppLogo.svg';
const wiggle = keyframes({
  '0%,100%': { transform: 'rotate(0deg)' },
  '25%': { transform: 'rotate(-10deg)' },
  '75%': { transform: 'rotate(10deg)' },
});

const IconWrapper = styled.div({
  backgroundColor: 'linen',
  width: '4rem',
  height: '4rem',
  margin: '2rem',
  borderRadius: '0.5rem',
  boxShadow: '0 5px 15px #3333',
  '&:hover': {
    animation: `${wiggle} 0.3s ease-out`,
  },
});

const Icon = styled.img({
  padding: '0.5rem',
});

const LogoIcon = () => {
  return (
    <>
      <IconWrapper>
        <Icon src={AppLogo} />
      </IconWrapper>
    </>
  );
};

export default LogoIcon;
