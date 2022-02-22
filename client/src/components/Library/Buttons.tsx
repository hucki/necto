import {
  Button as ChakraButton,
  IconButton as ChakraIconButton,
} from '@chakra-ui/react';
import styled from '@emotion/styled/macro';

const Button = styled(ChakraButton)();

const NavigationButton = styled(ChakraButton)({
  width: '100%',
  borderRadius: '0',
  ':focus': {
    boxShadow: 'none',
  },
});

const IconButton = styled(ChakraIconButton)({
  borderRadius: '0',
  ':focus': {
    boxShadow: 'none',
  },
});

const ControlWrapper = styled.div({
  display: 'flex',
});

export { Button, NavigationButton, IconButton, ControlWrapper };
