import {
  Button as ChakraButton,
  IconButton as ChakraIconButton,
} from '@chakra-ui/react';
import styled from '@emotion/styled/macro';

const NavigationButton = styled(ChakraButton)({
  width: '100%',
  borderRadius: '0',
  justifyContent: 'flex-start',
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

export { NavigationButton, IconButton };
