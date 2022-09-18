import React, { useContext } from 'react';
import { FullPageSpinner } from '../components/Library';
import { AuthContext } from '../providers/AuthProvider';
import { FilterProvider } from '../providers/filter/FilterProvider';
import { UserDateProvider } from '../providers/UserDate';
import AuthenticatedApp from './AuthenticatedApp';
import UnauthenticatedApp from './UnauthenticatedApp';
import UnauthorizedApp from './UnauthorizedApp';

export const AuthChecker = () => {
  const { isAuthenticated, isAuthorized, user, isLoading } =
    useContext(AuthContext);
  return (
    <>
      {isLoading ? (
        <FullPageSpinner />
      ) : isAuthenticated && isAuthorized && user?.uuid ? (
        <UserDateProvider>
          <FilterProvider>
            <AuthenticatedApp id={user?.uuid} />
          </FilterProvider>
        </UserDateProvider>
      ) : isAuthenticated ? (
        <UnauthorizedApp />
      ) : (
        <UnauthenticatedApp />
      )}
    </>
  );
};
