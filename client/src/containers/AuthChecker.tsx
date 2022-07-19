import React, { useContext } from 'react';
import { FullPageSpinner } from '../components/Library';
import { AuthContext } from '../providers/AuthProvider';
import { FilterProvider } from '../providers/filter/FilterProvider';
import { UserDateProvider } from '../providers/UserDate';
import AuthenticatedApp from './AuthenticatedApp';
import UnauthenticatedApp from './UnauthenticatedApp';

export const AuthChecker = () => {
  const { isAuthenticated, user, isLoading } = useContext(AuthContext);
  return (
    <>
      { isLoading
        ? <FullPageSpinner />
        : isAuthenticated && user?.uuid ? (
          <UserDateProvider>
            <FilterProvider>
              <AuthenticatedApp id={user?.uuid} />
            </FilterProvider>
          </UserDateProvider>
        ) : (
          <UnauthenticatedApp />
        )}
    </>
  );
};
