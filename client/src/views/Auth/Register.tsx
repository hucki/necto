/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormGroup, Input, Button, Label } from '../../components/Library';
import { register } from '../../services/Auth';
import { RegisterResponse } from '../../types/Auth';

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

const Register = (): JSX.Element => {
  const { t } = useTranslation();
  const [ message, setMessage] = useState<string| undefined>(undefined);
  const [ state, setState ] = useState<'error' | 'success'>('success');
  const [ registerState, setRegisterState] = useState({
    email: '',
    emailConfirmation: '',
    password: '',
    passwordConfirmation: '',
  });

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    setRegisterState((currentState) => ({
      ...currentState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmitHandler = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      const registerResponse: RegisterResponse = await register({ email: registerState.email, password: registerState.password });
      if (!registerResponse) {
        setTimeout(() => setMessage(undefined), 2500);
        setMessage('Registration failed');
        setState('error');
      } else {
        setMessage('Registration successfull');
        setState('success');
      }
    } catch (error) {
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
      setState('error');
    }
  };
  // reset error message upon changes to loginState contents
  useEffect(() => {
    if (message) {
      setMessage(undefined);
      setState('success');
    }
    if (registerState.emailConfirmation && registerState.email !== registerState.emailConfirmation) {
      setMessage('email addresses do not match!');
      setState('error');
    }
  }, [registerState.email, registerState.emailConfirmation, registerState.password]);

  const readyToRegister = Boolean(!message && registerState.email.length && registerState.password.length && registerState.email === registerState.emailConfirmation && registerState.password === registerState.passwordConfirmation);

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
          <Label htmlFor="email">{t('auth.email')}</Label>
          <Input
            type="text"
            name="email"
            autoComplete="username"
            value={registerState.email}
            onChange={onChangeHandler}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="emailConfirmation">{t('auth.confirmEmail')}</Label>
          <Input
            type="text"
            name="emailConfirmation"
            autoComplete="username"
            value={registerState.emailConfirmation}
            onChange={onChangeHandler}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">{t('auth.password')}</Label>
          <Input
            type="password"
            name="password"
            autoComplete="new-password"
            value={registerState.password}
            onChange={onChangeHandler}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="passwordConfirmation">{t('auth.confirmPassword')}</Label>
          <Input
            type="password"
            name="passwordConfirmation"
            autoComplete="new-password"
            value={registerState.passwordConfirmation}
            onChange={onChangeHandler}
          />
        </FormGroup>

        <Button aria-label="login" type="submit"
          disabled={!readyToRegister}
          colorScheme={state === 'error' ? 'red' : 'green'}
        >
          {message || t('auth.register')}
        </Button>
      </form>
    </div>
  );
};

export default Register;
