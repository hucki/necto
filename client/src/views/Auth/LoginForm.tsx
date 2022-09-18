/** @jsxRuntime classic */
/** @jsx jsx */
import { FormControl } from '@chakra-ui/react';
import { jsx } from '@emotion/react';
import React, { FormEvent, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Button, FormLabel } from '../../components/Library';
import { AuthContext } from '../../providers/AuthProvider';

const LoginForm = (): JSX.Element => {
  const { t } = useTranslation();
  const [message, setMessage] = useState<string | undefined>(undefined);
  const { isAuthenticated, user, logMeIn, errorMessage } =
    useContext(AuthContext);
  const [loginState, setLoginState] = useState({
    email: '',
    password: '',
  });

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    setLoginState((currentState) => ({
      ...currentState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmitHandler = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      await logMeIn({ email: loginState.email, password: loginState.password });
    } catch (e) {
      console.log('caught', { e });
      const error = e as Error;
      setMessage(error.message);
    }
  };
  // reset error message upon changes to loginState contents
  useEffect(() => {
    if (message) setMessage(undefined);
  }, [loginState.email, loginState.password]);

  return (
    <div>
      <form
        onSubmit={onSubmitHandler}
        css={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          marginTop: '10px',
          '> div': {
            margin: '10px auto',
            width: '100%',
            maxWidth: '300px',
          },
        }}
      >
        <FormControl id="email">
          <Input
            type="text"
            name="email"
            autoComplete="username"
            value={loginState.email}
            onChange={onChangeHandler}
          />
          <FormLabel>{t('auth.email')}</FormLabel>
        </FormControl>
        <FormControl id="password">
          <Input
            type="password"
            name="password"
            autoComplete="current-password"
            value={loginState.password}
            onChange={onChangeHandler}
          />
          <FormLabel>{t('auth.password')}</FormLabel>
        </FormControl>

        <Button
          aria-label="login"
          type="submit"
          disabled={!!message || isAuthenticated}
          colorScheme={(!!message && 'red') || 'green'}
        >
          {message || t('auth.login')}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
