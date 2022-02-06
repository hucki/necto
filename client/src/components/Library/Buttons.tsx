import {
  Button as ChakraButton,
  IconButton as ChakraIconButton,
} from '@chakra-ui/react';
import styled from '@emotion/styled/macro';

const Button = styled(ChakraButton)();

const IconButton = styled(ChakraIconButton)();

const ControlWrapper = styled.div({
  display: 'flex',
});

export { Button, IconButton, ControlWrapper };
