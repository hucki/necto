import React, { FormEvent, useState } from 'react';
import {
  Alert,
  AlertIcon,
  Button,
  FormErrorMessage,
  Heading,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { FormControl, LabelledInput } from '../../Library';
import { resetPassword } from '../../../services/Auth';
import { ResetResponse } from '../../../types/Auth';
import { useParams, useNavigate } from 'react-router-dom';

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

const ResetPassword = (): JSX.Element => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resetState, setResetState] = useState({
    email: '',
    newPassword: '',
    newPasswordConfirmation: '',
  });

  const [response, setResponse] = useState<ResetResponse | undefined>();

  const newPasswordConfirmed =
    resetState.newPassword === resetState.newPasswordConfirmation;

  const readyToReset =
    resetState.email.length &&
    resetState.newPassword.length &&
    newPasswordConfirmed;
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    setResetState((currentState) => ({
      ...currentState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmitHandler = async (e: FormEvent): Promise<void> => {
    if (!token) return;
    e.preventDefault();
    try {
      setPending(true);
      const resetResponse = await resetPassword({
        email: resetState.email,
        newPassword: resetState.newPassword,
        token,
      });
      setTimeout(() => {
        setMessage(undefined);
        setResponse(undefined);
        navigate('/');
      }, 2500);
      if (!resetResponse) {
        setMessage('reset failed');
      } else {
        setResponse(resetResponse);
        setMessage('reset successfull');
      }
      setPending(false);
      setSuccess(true);
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

  return (
    <>
      <Heading as="h1" size="lg">
        {t('auth.resetPassword')}
      </Heading>
      {success ? (
        <>
          {message && (
            <Alert status="success">
              <AlertIcon />
              {message}
            </Alert>
          )}
        </>
      ) : (
        <>
          {t('auth.fillResetPasswordForm')}
          <form
            onSubmit={onSubmitHandler}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
            }}
          >
            <LabelledInput
              label={t('auth.email')}
              type="email"
              name="email"
              id="email"
              autoComplete="username"
              value={resetState.email}
              onChangeHandler={onChangeHandler}
            />
            <LabelledInput
              label={t('auth.newPassword')}
              type="password"
              name="newPassword"
              id="newPassword"
              autoComplete="new-password"
              value={resetState.newPassword}
              onChangeHandler={onChangeHandler}
            />
            <FormControl isInvalid={!newPasswordConfirmed}>
              <LabelledInput
                label={t('auth.confirmPassword')}
                type="password"
                name="newPasswordConfirmation"
                id="newPasswordConfirmation"
                autoComplete="new-password"
                value={resetState.newPasswordConfirmation}
                onChangeHandler={onChangeHandler}
              />

              {!newPasswordConfirmed && (
                <FormErrorMessage>new password has to match</FormErrorMessage>
              )}
            </FormControl>
            <Button
              aria-label="resetPassword"
              type="submit"
              disabled={!token || !readyToReset || !!response}
              colorScheme={message && response !== 'ok' ? 'red' : 'green'}
            >
              {message || t('auth.reset')}
            </Button>
          </form>
        </>
      )}
    </>
  );
};

export default ResetPassword;
