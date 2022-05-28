import React, { createContext, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { getToken, me } from '../services/Auth';
import { MinimalUser } from '../types/Auth';

type AuthContextType = {
  isAuthenticated: boolean,
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>,
  user: MinimalUser | undefined,
  setUser: Dispatch<SetStateAction<MinimalUser|undefined>>,
  isLoading: boolean,
}
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => false,
  user: undefined,
  setUser: () => undefined,
  isLoading: false,
});

function AuthProvider({children}:{children: any}) {
  const userToken = getToken();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!getToken());
  const [user, setUser] = useState<MinimalUser | undefined>(undefined);
  const value = { isAuthenticated, setIsAuthenticated, user, setUser, isLoading};

  useEffect(()=>{
    if (!userToken) {
      setIsAuthenticated(false);
      setUser(undefined);
      setIsLoading(false);
    }
    const fetchMe = async () => {
      try {
        const thisIsMe = await me();
        if (!thisIsMe) return setIsAuthenticated(false);
        setUser({
          uuid: thisIsMe.uuid,
          email: thisIsMe.email,
          firstName: thisIsMe.firstName,
          lastName: thisIsMe.lastName
        });
      } catch (error) {
        console.error(error);
        return setIsAuthenticated(false);
      }
    };
    if (isAuthenticated && !user) {
      setIsLoading(true);
      fetchMe().finally(() => setIsLoading(false));
    } else {
      setUser(undefined);
    };
    return setUser(undefined);
  }, [isAuthenticated, userToken]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );

}

export {AuthProvider, AuthContext};