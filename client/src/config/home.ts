import { MinimalUser } from '../types/Auth';

export const authorizedHome = {
  newUsers: {
    rolesWithAccess: ['admin', 'planner'],
  },
  openRequests: {
    rolesWithAccess: ['admin', 'planner'],
  },
  employeeEvents: {
    rolesWithAccess: ['admin', 'planner', 'employee'],
  },
};

export type HomeItem = keyof typeof authorizedHome;

export const isAuthorized = (user: MinimalUser, homeItem: HomeItem) => {
  const { rolesWithAccess } = authorizedHome[homeItem];
  for (let i = 0; i < rolesWithAccess.length; i++) {
    if (user.roles?.find((role) => role === rolesWithAccess[i])) return true;
  }
  return false;
};
