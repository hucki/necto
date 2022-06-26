/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { FormEvent, useState } from 'react';
import { FormGroup, Input, Button, Label } from '../../components/Library';
import { resetPassword } from '../../services/Auth';
import { ResetResponse } from '../../types/Auth';

interface RegisterError {
  location: string
  msg: string
  param: string
  value: string
}
interface ErrorResponse {
  errors: RegisterError[]
  message?: string
}

interface ResetPasswordProps {
  onSubmit: () => void
}

const ResetPassword = ({onSubmit}: ResetPasswordProps): JSX.Element => {
  const [ message, setMessage] = useState<string| undefined>(undefined);
  const [pending, setPending] = useState(false);
  const [ resetState, setResetState] = useState({
    email: '',
  });
  const [ response, setResponse] = useState<ResetResponse | undefined>();

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    setResetState((currentState) => ({
      ...currentState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmitHandler = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      setPending(true);
      const resetResponse = await resetPassword({ email: resetState.email});
      setTimeout(() => {
        setMessage(undefined);
        setResponse(undefined);
      }, 2500);
      if (!resetResponse) {
        setMessage('reset failed');
      } else {
        setResponse(resetResponse);
        setMessage('reset successfull');
      }
      setPending(false);
      onSubmit();
    } catch (error) {
      setPending(false);
      const errorResponse = error as ErrorResponse;
      let messages: Array<string> = [];
      if (errorResponse && errorResponse.message) {
        messages = [errorResponse.message];
      } else if (errorResponse && errorResponse.errors?.length) {
        const msgs = errorResponse.errors.map(e => e.msg);
        messages = [...msgs];
      };
      setTimeout(() => setMessage(undefined), 2500);
      setMessage(messages.join());
    }
  };
  const readyToReset = Boolean(resetState.email.length);

  return (
    <div>
      <form
        onSubmit={onSubmitHandler}
        css={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          '> div': {
            margin: '10px auto',
            width: '100%',
            maxWidth: '300px',
          },
        }}
      >
        <FormGroup>
          <Label htmlFor="email">email</Label>
          <Input
            type="text"
            name="email"
            autoComplete="username"
            value={resetState.email}
            onChange={onChangeHandler}
          />
        </FormGroup>
        <Button aria-label="resetPassword" type="submit"
          disabled={!readyToReset || !!response}
          colorScheme={message && response !== 'ok' ? 'red' : 'green'}
        >
          {message || 'Reset'}
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;
