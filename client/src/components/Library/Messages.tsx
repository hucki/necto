import React from 'react';
import styled from '@emotion/styled/macro';
import { t } from 'i18next';
import * as colors from '../../styles/colors';

const displayVariant = {
  stack: 'block',
  inline: 'inline-block',
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
      style={{
        color: colors.danger,
        display: displayVariant[variant as 'stack' | 'inline'],
      }}
      {...props}
    >
      <span>{t('error.prefix')}</span>
      <pre
        style={{
          whiteSpace: 'break-spaces',
          margin: '0',
          marginBottom: -5,
          display: variant === 'stack' ? 'block' : 'inline-block',
        }}
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
