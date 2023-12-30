import React, { FormEvent, useContext, useEffect, useState } from 'react';
import { Button } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { LabelledInput } from '../../Library';
import { AuthContext } from '../../../providers/AuthProvider';
import styled from '@emotion/styled/macro';

const Message = styled.pre({
  color: 'red',
  textWrap: 'wrap',
  fontSize: 'small',
});

const LoginForm = (): JSX.Element => {
  const { t } = useTranslation();
  const [message, setMessage] = useState<string | undefined>(undefined);
  const { isAuthenticated, logMeIn, errorMessage } = useContext(AuthContext);
  const [loginState, setLoginState] = useState({
    email: '',
    password: '',
  });

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const value =
      e.target.name === 'email' ? e.target.value.toLowerCase() : e.target.value;
    setLoginState((currentState) => ({
      ...currentState,
      [e.target.name]: value,
    }));
  };

  const onSubmitHandler = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      await logMeIn({ email: loginState.email, password: loginState.password });
    } catch (e) {
      const error = e as Error;
      setMessage(error.message);
    }
  };
  useEffect(() => {
    if (errorMessage) setMessage(errorMessage);
  }, [errorMessage]);
  // reset error message upon changes to loginState contents
  useEffect(() => {
    if (message) setMessage(undefined);
  }, [loginState.email, loginState.password]);

  return (
    <div>
      <form
        onSubmit={onSubmitHandler}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          marginTop: '10px',
        }}
      >
        <LabelledInput
          label={t('auth.email')}
          type="email"
          name="email"
          id="email"
          autoComplete="username"
          value={loginState.email}
          onChangeHandler={onChangeHandler}
        />
        <LabelledInput
          label={t('auth.password')}
          type="password"
          name="password"
          id="password"
          autoComplete="current-password"
          value={loginState.password}
          onChangeHandler={onChangeHandler}
        />
        {message && <Message>{message}</Message>}
        <Button
          aria-label="login"
          type="submit"
          isDisabled={!!message || isAuthenticated}
          colorScheme="green"
        >
          {t('auth.login')}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
