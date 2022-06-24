/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { FormEvent, useEffect, useState } from 'react';
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
  const [ message, setMessage] = useState<string| undefined>(undefined);
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
      } else {
        setMessage('Registration successfull');
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
    }
  };
  // reset error message upon changes to loginState contents
  useEffect(() => {
    if (message) setMessage(undefined);
    if (registerState.emailConfirmation && registerState.email !== registerState.emailConfirmation) setMessage('email addresses do not match!');
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
          <Label htmlFor="email">email</Label>
          <Input
            type="text"
            name="email"
            autoComplete="username"
            value={registerState.email}
            onChange={onChangeHandler}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="emailConfirmation">confirm email</Label>
          <Input
            type="text"
            name="emailConfirmation"
            autoComplete="username"
            value={registerState.emailConfirmation}
            onChange={onChangeHandler}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">password</Label>
          <Input
            type="password"
            name="password"
            autoComplete="new-password"
            value={registerState.password}
            onChange={onChangeHandler}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="passwordConfirmation">confirm password</Label>
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
          colorScheme={!!message && 'red' || 'green'}
        >
          {message || 'Register'}
        </Button>
      </form>
    </div>
  );
};

export default Register;
