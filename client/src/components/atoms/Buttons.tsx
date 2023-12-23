import {
  Button as ChakraButton,
  IconButton as ChakraIconButton,
} from '@chakra-ui/react';
import styled from '@emotion/styled/macro';

const NavigationButton = styled(ChakraButton)({
  width: '100%',
  borderRadius: '0',
  marginLeft: '0.2rem',
  borderBottomLeftRadius: '1rem',
  borderTopLeftRadius: '1rem',
  justifyContent: 'flex-start',
  ':focus': {
    boxShadow: 'none',
  },
});

const PaginationButton = styled(ChakraButton)({
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

export { NavigationButton, PaginationButton, IconButton };
