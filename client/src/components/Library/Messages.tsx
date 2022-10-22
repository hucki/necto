/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import styled from '@emotion/styled/macro';
import { t } from 'i18next';
import * as colors from '../../styles/colors';

interface ErrorMessageVariants {
  [key: string]: { display: string };
}
const errorMessageVariants: ErrorMessageVariants = {
  stack: { display: 'block' },
  inline: { display: 'inline-block' },
};

interface ErrorInputProps {
  error: {
    message: string;
  };
  variant?: string;
}
function ErrorMessage({
  error,
  variant = 'stacked',
  ...props
}: ErrorInputProps): JSX.Element {
  return (
    <div
      role="alert"
      css={[{ color: colors.danger }, errorMessageVariants[variant]]}
      {...props}
    >
      <span>{t('error.prefix')}</span>
      <pre
        css={[
          { whiteSpace: 'break-spaces', margin: '0', marginBottom: -5 },
          errorMessageVariants[variant],
        ]}
      >
        {error.message}
      </pre>
    </div>
  );
}

interface NotificationCountProps {
  count: number;
}

const NotificationCount = styled.div(({ count }: NotificationCountProps) => ({
  color: 'white',
  fontSize: '0.75rem',
  width: '1.1rem',
  height: '1.1rem',
  backgroundColor: count > 0 ? 'red' : 'grey',
  borderRadius: '50%',
  textAlign: 'center',
}));

const Greeting = styled.div({
  fontWeight: 'bold',
  padding: '1rem',
});

export { ErrorMessage, NotificationCount, Greeting };
