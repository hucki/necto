/** @jsxRuntime classic */
/** @jsx jsx */
import {jsx} from '@emotion/react'
import * as colors from '../../styles/colors'

interface ErrorMessageVariants {
  [key: string]: {display: string}
}
const errorMessageVariants: ErrorMessageVariants= {
  stack: {display: 'block'},
  inline: {display: 'inline-block'},
}

interface ErrorInputProps {
  error: {
    message: string
  };
  variant?: string;
}
function ErrorMessage({error, variant = 'stacked', ...props}: ErrorInputProps): JSX.Element {
  return (
    <div
      role="alert"
      css={[{color: colors.danger}, errorMessageVariants[variant]]}
      {...props}
    >
      <span>There was an error: </span>
      <pre
        css={[
          {whiteSpace: 'break-spaces', margin: '0', marginBottom: -5},
          errorMessageVariants[variant],
        ]}
      >
        {error.message}
      </pre>
    </div>
  )
}

export {ErrorMessage};