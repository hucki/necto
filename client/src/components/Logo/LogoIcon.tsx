import styled from '@emotion/styled';
import React from 'react';
import AppLogo from '../../assets/AppLogo.svg';

const IconWrapper = styled.div({
  width: '4rem',
  height: '4rem',
  margin: '2rem',
  borderRadius: '0.5rem',
  boxShadow: '0 5px 15px #3333',
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
