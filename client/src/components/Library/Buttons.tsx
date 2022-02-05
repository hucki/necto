import {
  Button as ChakraButton,
  IconButton as ChakraIconButton,
} from '@chakra-ui/react';
import styled from '@emotion/styled/macro';
import * as colors from '../../styles/colors';
import { BgColor } from '../../types/Colors';

interface ButtonVariants {
  [key: string]: {
    background: string;
    color: string;
  };
}

const buttonVariants: ButtonVariants = {
  primary: {
    background: colors.indigoDarken10,
    color: colors.base,
  },
  secondary: {
    background: colors.gray20,
    color: colors.indigoDarken10,
  },
  danger: {
    background: colors.danger,
    color: colors.background,
  },
};

interface CircleButtonProps {
  bgColor: BgColor;
}

const CircleButton = styled.button(
  {
    borderRadius: '30px',
    padding: '0',
    width: '40px',
    height: '40px',
    lineHeight: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: colors.base,
    color: colors.text,
    textShadow: `1px 1px 1px ${colors.text}`,
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer',
  },
  ({ bgColor = 'green' }: CircleButtonProps) => {
    return {
      color: `var(--bg${
        bgColor[0].toUpperCase() + bgColor.substring(1)
      }Border)`,
    };
  }
);

interface ButtonCallbackProps {
  variant?: string;
  disabled?: boolean;
}
const Button = styled(ChakraButton)(
  {
    padding: '10px 15px',
    border: '0',
    lineHeight: '1',
    borderRadius: '3px',
    cursor: 'pointer',
    ':disabled': {
      backgroundColor: colors.gray80,
      fontStyle: 'italic',
      cursor: 'not-allowed',
    },
    display: 'flex',
    alignItems: 'center',
  },
  ({ variant = 'primary' }: ButtonCallbackProps) => buttonVariants[variant]
);

const IconButton = styled(ChakraIconButton)({
  padding: '10px 15px',
  border: '0',
  lineHeight: '1',
  borderRadius: '3px',
  cursor: 'pointer',
  ':disabled': {
    backgroundColor: colors.gray80,
    fontStyle: 'italic',
    cursor: 'not-allowed',
  },
  display: 'flex',
  alignItems: 'center',
});

const ControlWrapper = styled.div({
  display: 'flex',
});

export { Button, IconButton, CircleButton, ControlWrapper };
