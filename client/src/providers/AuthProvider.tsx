import React, { createContext, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { getToken, login, logout, me, tokenKey } from '../services/Auth';
import { LoginResponse, MinimalUser } from '../types/Auth';

type LogMeInProps = {
  email: string
  password: string
}
interface LoginError {
  location: string
  message: string
  param: string
  value: string
}
interface ErrorResponse {
  errors: LoginError[]
  message?: string
}

type AuthContextType = {
  isAuthenticated: boolean,
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>,
  user: MinimalUser | undefined,
  setUser: Dispatch<SetStateAction<MinimalUser|undefined>>,
  isLoading: boolean,
  isError: boolean,
  errorMessage: string,
  logMeIn: ({email, password}: LogMeInProps) => Promise<void>,
  logMeOut: () => void,
}
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => false,
  user: undefined,
  setUser: () => undefined,
  isLoading: false,
  logMeIn: ({email, password}: LogMeInProps) => new Promise(() => undefined),
  logMeOut: () => undefined,
  isError: false,
  errorMessage: '',
});

function AuthProvider({children}:{children: any}) {
  const history = useHistory();
  const [ userToken, setUserToken ] = useState<string | null>(() => getToken());
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const [ isAuthenticated, setIsAuthenticated ] = useState<boolean>(() => !!userToken);
  const [ isError, setIsError ] = useState<boolean>(false);
  const [ errorMessage, setErrorMessage ] = useState<string>('');
  const [ user, setUser ] = useState<MinimalUser | undefined>(undefined);

  window.addEventListener('storage', () => {
    const newValue = window.localStorage.getItem(tokenKey);
    setUserToken(newValue);
  });

  useEffect(()=>{
    const fetchMe = async () => {
      try {
        const thisIsMe = await me();
        if (!thisIsMe) return setIsAuthenticated(false);
        setUser({
          uuid: thisIsMe.uuid,
          email: thisIsMe.email,
          firstName: thisIsMe.firstName,
          lastName: thisIsMe.lastName,
          isAdmin: thisIsMe.isAdmin,
          isPlanner: thisIsMe.isPlanner,
          isEmployee: thisIsMe.isEmployee
        });
      } catch (error) {
        console.error(error);
        return setIsAuthenticated(false);
      }
    };

    if (!userToken) {
      setIsAuthenticated(false);
      setUser(undefined);
      setIsLoading(false);
      if (window.location.pathname !== '/') {
        window.location.assign('/');
      }
    } else {
      setIsAuthenticated(true);
      if (!user) {
        setIsLoading(true);
        fetchMe().finally(() => setIsLoading(false));
      } else {
        setUser(undefined);
      };
    }
    return () => setUser(undefined);
  }, [userToken]);

  const logMeIn = async ({email, password}: LogMeInProps) => {
    try {
      const loginResponse: LoginResponse = await login({ email, password });
      if (!loginResponse) {
        setErrorMessage('failed');
      } else {
        setIsAuthenticated(true);
      }
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      let msg = '';
      if (errorResponse && errorResponse.message) {
        msg = errorResponse.message;
      } else if (errorResponse && errorResponse.errors?.length) {
        const msgs = errorResponse.errors.map(e => e.message);
        msg = [...msgs].join();
      };
      setErrorMessage(msg);
      throw new Error(msg);
    }
  };

  const logMeOut = () => {
    logout({returnTo: window.location.toString()});
  };

  const value = {
    isAuthenticated,
    setIsAuthenticated,
    user,
    setUser,
    isLoading,
    logMeIn,
    logMeOut,
    isError,
    errorMessage
  };
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );

}

export {AuthProvider, AuthContext};