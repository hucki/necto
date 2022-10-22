import React from 'react';
import styled from '@emotion/styled/macro';

const FooterContainer = styled.div({
  width: '100%',
  backgroundColor: 'white',
  color: '#3338',
  marginTop: '15px',
  padding: '10px',
  textAlign: 'right',
  boxShadow: '0 0 15px #3333',
});

function Footer() {
  return (
    <FooterContainer>
      <p>
        made with{' '}
        <span role="img" aria-label="pineapple">
          🍍
        </span>
        <span role="img" aria-label="pizza">
          🍕
        </span>{' '}
        by Hucki
      </p>
    </FooterContainer>
  );
}

export default Footer;
