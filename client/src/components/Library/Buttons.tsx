import styled from '@emotion/styled/macro'
import * as colors from '../../styles/colors'

interface ButtonVariants {
  [key: string]: {
    background: string;
    color: string;
  }
}

const buttonVariants: ButtonVariants = {
  primary: {
    background: colors.indigo,
    color: colors.base,
  },
  secondary: {
    background: colors.gray,
    color: colors.text,
  },
}
interface ButtonCallbackProps {
  variant?: string;
  disabled?: boolean;
}
const Button = styled.button(
  {
    padding: '10px 15px',
    border: '0',
    lineHeight: '1',
    borderRadius: '3px',
  },
  ({variant = 'primary'}: ButtonCallbackProps) => buttonVariants[variant],
)

export { Button} ;