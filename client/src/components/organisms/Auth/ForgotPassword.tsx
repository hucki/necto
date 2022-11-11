import React, { FormEvent, useState } from 'react';
import { Button } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Input, FormControl, FormLabel } from '../../Library';
import { requestResetPassword } from '../../../services/Auth';
import { ResetResponse } from '../../../types/Auth';

interface RegisterError {
  location: string;
  msg: string;
  param: string;
  value: string;
}
interface ErrorResponse {
  errors: RegisterError[];
  message?: string;
}

interface ResetPasswordProps {
  onSubmit: () => void;
}

const ForgotPassword = ({ onSubmit }: ResetPasswordProps): JSX.Element => {
  const { t } = useTranslation();
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [, setPending] = useState(false);
  const [resetState, setResetState] = useState({
    email: '',
  });
  const [response, setResponse] = useState<ResetResponse | undefined>();

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
      const resetResponse = await requestResetPassword({
        email: resetState.email,
      });
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
        const msgs = errorResponse.errors.map((e) => e.msg);
        messages = [...msgs];
      }
      setTimeout(() => setMessage(undefined), 2500);
      setMessage(messages.join());
    }
  };
  const readyToReset = Boolean(resetState.email.length);

  return (
    <div>
      <form
        onSubmit={onSubmitHandler}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
      >
        <FormControl id="email">
          <Input
            type="text"
            name="email"
            autoComplete="username"
            value={resetState.email}
            onChange={onChangeHandler}
          />
          <FormLabel>{t('auth.email')}</FormLabel>
        </FormControl>
        <Button
          aria-label="resetPassword"
          type="submit"
          disabled={!readyToReset || !!response}
          colorScheme={message && response !== 'ok' ? 'red' : 'green'}
        >
          {message || t('auth.reset')}
        </Button>
      </form>
    </div>
  );
};

export default ForgotPassword;
