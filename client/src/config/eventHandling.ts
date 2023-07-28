import { MinimalUser } from '../types/Auth';

export const authorizedEventHandling = {
  removeIsDone: {
    rolesWithAccess: ['admin'],
  },
};

export type EventHandlingItem = keyof typeof authorizedEventHandling;

export const isAuthorized = (
  user: MinimalUser,
  eventHandlingItem: EventHandlingItem
) => {
  const { rolesWithAccess } = authorizedEventHandling[eventHandlingItem];

  for (let i = 0; i < rolesWithAccess.length; i++) {
    if (user.roles?.find((role) => role === rolesWithAccess[i])) return true;
  }
  return false;
};
