/** @jsxRuntime classic */
/** @jsx jsx */
import { FormControl } from '@chakra-ui/react';
import { jsx } from '@emotion/react';
import styled from '@emotion/styled/macro';
import React, { FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Button, FormLabel } from '../../components/Library';
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

type RegisterProps = {
  onHasRegistered: () => void
};
const InputWrapper = styled.div({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '0.5rem',
  margin: '10px auto',
  width: '100%',
  maxWidth: '400px',
});

const Register = ({onHasRegistered}: RegisterProps): JSX.Element => {
  const { t } = useTranslation();
  const [ message, setMessage] = useState<string| undefined>(undefined);
  const [ state, setState ] = useState<'error' | 'success'>('success');
  const [ registerState, setRegisterState] = useState({
    email: '',
    emailConfirmation: '',
    password: '',
    passwordConfirmation: '',
    firstName: '',
    lastName: '',
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
      const registerResponse: RegisterResponse = await register({
        email: registerState.email,
        password: registerState.password,
        firstName: registerState.firstName,
        lastName: registerState.lastName,
      });
      if (!registerResponse) {
        setTimeout(() => {
          setMessage(undefined);
          setState('success');
        }, 2500);
        setMessage('Registration failed');
        setState('error');
      } else {
        setMessage('Registration successfull');
        setState('success');
        setTimeout(() => onHasRegistered(), 2500);
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
          marginTop: '10px',
        }}
      >
        <InputWrapper>
          <FormControl id="firstName" isRequired>
            <Input
              type="text"
              name="firstName"
              autoComplete="given-name"
              value={registerState.firstName}
              onChange={onChangeHandler}
            />
            <FormLabel>{t('label.firstName')}</FormLabel>
          </FormControl>
          <FormControl id="lastName" isRequired>
            <Input
              type="text"
              name="lastName"
              autoComplete="family-name"
              value={registerState.lastName}
              onChange={onChangeHandler}
            />
            <FormLabel>{t('label.lastName')}</FormLabel>
          </FormControl>
        </InputWrapper>
        {/* <InputWrapper> */}
        <FormControl id="register-email" style={{margin: '10px auto'}} isRequired>
          <Input
            type="text"
            name="email"
            autoComplete="username"
            value={registerState.email}
            onChange={onChangeHandler}
          />
          <FormLabel>{t('auth.email')}</FormLabel>
        </FormControl>
        <FormControl id="emailConfirmation"  style={{margin: '10px auto'}} isRequired>
          <Input
            type="text"
            name="emailConfirmation"
            autoComplete="username"
            value={registerState.emailConfirmation}
            onChange={onChangeHandler}
          />
          <FormLabel>{t('auth.confirmEmail')}</FormLabel>
        </FormControl>
        {/* </InputWrapper> */}
        {/* <InputWrapper> */}
        <FormControl id="register-password"  style={{margin: '10px auto'}} isRequired>
          <Input
            type="password"
            name="password"
            autoComplete="new-password"
            value={registerState.password}
            onChange={onChangeHandler}
          />
          <FormLabel>{t('auth.password')}</FormLabel>
        </FormControl>
        <FormControl id="passwordConfirmation"  style={{margin: '10px auto'}} isRequired>
          <Input
            type="password"
            name="passwordConfirmation"
            autoComplete="new-password"
            value={registerState.passwordConfirmation}
            onChange={onChangeHandler}
          />
          <FormLabel>{t('auth.confirmPassword')}</FormLabel>
        </FormControl>
        {/* </InputWrapper> */}
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
