import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '../Library';

const LoginButton = (): JSX.Element => {
  const [message, setMessage] = useState<string| undefined>(undefined);
  const { loginWithRedirect, error, isAuthenticated, user, isLoading, logout } = useAuth0();
  console.log({isAuthenticated, error, user, isLoading});
  useEffect(() => {
    if (!isLoading && !isAuthenticated && error) {
      setMessage(error.message);
      setTimeout(() => {
        setMessage('logging out');
        logout();
      }, 2000) as unknown as number;
    } else {
      setMessage(undefined);
    };
  }, [isLoading, isAuthenticated, error]);
  return (
    <Button
      aria-label="login"
      onClick={() => loginWithRedirect()}
      isLoading={isLoading}
      loadingText="logging you in"
      disabled={!!message}
      colorScheme={!!message && 'red' || 'green'}
    >
      {message || 'Log In'}
    </Button>
  );
};

export default LoginButton;
