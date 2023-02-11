import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { getToken, login, logout, me, tokenKey } from '../services/Auth';
import { LoginResponse, MinimalUser } from '../types/Auth';

type LogMeInProps = {
  email: string;
  password: string;
};
interface LoginError {
  location: string;
  message: string;
  param: string;
  value: string;
}
interface ErrorResponse {
  errors: LoginError[];
  message?: string;
}

type AuthContextType = {
  isAuthenticated: boolean;
  isAuthorized: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  user: MinimalUser | undefined;
  setUser: Dispatch<SetStateAction<MinimalUser | undefined>>;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  // eslint-disable-next-line no-unused-vars
  logMeIn: ({ email, password }: LogMeInProps) => Promise<void>;
  logMeOut: () => void;
};
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isAuthorized: false,
  setIsAuthenticated: () => false,
  user: undefined,
  setUser: () => undefined,
  isLoading: false,
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  logMeIn: ({ email, password }: LogMeInProps) => new Promise(() => undefined),
  logMeOut: () => undefined,
  isError: false,
  errorMessage: '',
});

function AuthProvider({ children }: { children: ReactNode }) {
  const [userToken, setUserToken] = useState<string | null>(() => getToken());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => !!userToken
  );
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [user, setUser] = useState<MinimalUser | undefined>(undefined);
  const isNotOnlyUser = (user?: MinimalUser) =>
    user?.roles && user.roles.filter((role) => role !== 'user').length > 1;
  const [isAuthorized, setIsAuthorized] = useState<boolean>(() =>
    isNotOnlyUser(user) ? true : false
  );
  window.addEventListener('storage', () => {
    const newValue = window.localStorage.getItem(tokenKey);
    setUserToken(newValue);
  });

  useEffect(() => {
    const fetchMe = async () => {
      if (isError) setIsError(false);
      try {
        const thisIsMe = await me();
        if (!thisIsMe) return setIsAuthenticated(false);
        setUser({
          uuid: thisIsMe.uuid,
          email: thisIsMe.email,
          firstName: thisIsMe.firstName,
          lastName: thisIsMe.lastName,
          roles: thisIsMe.roles,
          employeeId: thisIsMe.employeeId,
        });
        if (isNotOnlyUser(thisIsMe)) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error(error);
        setIsError(true);
        return setIsAuthenticated(false);
      }
    };

    if (!userToken) {
      setIsAuthenticated(false);
      setUser(undefined);
      setIsLoading(false);
    } else {
      setIsAuthenticated(true);
      if (!user) {
        setIsLoading(true);
        fetchMe().finally(() => setIsLoading(false));
      } else {
        setUser(undefined);
      }
    }
    return () => setUser(undefined);
  }, [userToken]);

  const logMeIn = async ({ email, password }: LogMeInProps) => {
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
        const msgs = errorResponse.errors.map((e) => e.message);
        msg = [...msgs].join();
      }
      setErrorMessage(msg);
      throw new Error(msg);
    }
  };

  const logMeOut = () => {
    logout({ returnTo: window.location.toString() });
  };

  const value = {
    isAuthenticated,
    isAuthorized,
    setIsAuthenticated,
    user,
    setUser,
    isLoading,
    logMeIn,
    logMeOut,
    isError,
    errorMessage,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthProvider, AuthContext };
