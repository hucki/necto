import { MinimalUser } from '../types/Auth';

export const authorizedNavigation = {
  home: {
    rolesWithAccess: ['user', 'admin', 'planner', 'employee'],
  },
  personalcal: {
    rolesWithAccess: ['admin', 'planner', 'employee'],
  },
  teamcal: {
    rolesWithAccess: ['admin', 'planner', 'employee'],
  },
  rooms: {
    rolesWithAccess: ['admin', 'planner', 'employee'],
  },
  roomCalendar: {
    rolesWithAccess: ['admin', 'planner', 'employee'],
  },
  patients: {
    rolesWithAccess: ['admin', 'planner', 'employee'],
  },
  doctors: {
    rolesWithAccess: ['admin', 'planner', 'employee'],
  },
  waiting: {
    rolesWithAccess: ['admin', 'planner', 'employee'],
  },
  institutions: {
    rolesWithAccess: ['admin', 'planner', 'employee'],
  },
  reports: {
    rolesWithAccess: ['admin'],
  },
  settings: {
    rolesWithAccess: ['admin', 'planner', 'employee'],
  },
};

export type NavigationItem = keyof typeof authorizedNavigation;

export const isAuthorized = (
  user: MinimalUser,
  navigationItem: NavigationItem
) => {
  const { rolesWithAccess } = authorizedNavigation[navigationItem];
  for (let i = 0; i < rolesWithAccess.length; i++) {
    if (user.roles?.find((role) => role === rolesWithAccess[i])) return true;
  }
  return false;
};
