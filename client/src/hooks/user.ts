import {
  useQuery,
  QueryResult,
  useMutation,
  MutationResultPair,
  queryCache,
} from 'react-query';
import { client } from '../services/ApiClient';
import { TeamMember, User } from '../types/User';
import { UserSettings } from '../types/UserSettings';

export function useUser(
  id: string
): QueryResult<User> & { user: User | undefined } {
  const userQuery = useQuery(['user', id], async () => {
    return client<User>(`users/${id}`);
  });
  const user = userQuery.data;
  return {
    user,
    ...userQuery,
  };
}

export function useAddUser(): MutationResultPair<
  User,
  Error,
  { user: User },
  string
  > {
  const createUser = async ({ user }: { user: User }): Promise<User> => {
    return client<User>('users', { data: user });
  };
  return useMutation(createUser, {
    onSuccess: () => {
      queryCache.invalidateQueries('users');
    },
  });
}

export function useAllUsers(): QueryResult<User[]> & { users: User[] } {
  const usersQuery = useQuery('users', async () => {
    return client<User[]>('users');
  });

  const users = usersQuery.data ?? [];

  return {
    users,
    ...usersQuery,
  };
}

export function useAllTeamMembers(): QueryResult<TeamMember[]> & {
  teamMembers: TeamMember[];
  } {
  const teamMembersQuery = useQuery('teamMembers', async () => {
    return client<TeamMember[]>('teamMembers');
  });

  const teamMembers = teamMembersQuery.data ?? [];

  return {
    teamMembers,
    ...teamMembersQuery,
  };
}

export function useCreateUserSettings(): MutationResultPair<
  UserSettings,
  Error,
  { userSettings: UserSettings },
  string
  > {
  const createUserSettings = async ({
    userSettings,
  }: {
    userSettings: UserSettings;
  }): Promise<UserSettings> => {
    return client<UserSettings>('settings/user', { data: userSettings });
  };
  return useMutation(createUserSettings, {
    onSuccess: () => {
      queryCache.invalidateQueries('settings/user');
    },
  });
}

export function useUpdateUserSettings(): MutationResultPair<
  UserSettings,
  Error,
  { userSettings: UserSettings },
  string
  > {
  const updateUserSettings = async ({
    userSettings,
  }: {
    userSettings: UserSettings;
  }): Promise<UserSettings> => {
    return client<UserSettings>('settings/user', { data: userSettings, method: 'PATCH' });
  };
  return useMutation(updateUserSettings, {
    onSuccess: () => {
      queryCache.invalidateQueries('settings/user');
    },
  });
}

export function useUpdateUser(): MutationResultPair<
  User,
  Error,
  { user: User },
  string
  > {
  const updateUser = async ({ user }: { user: User }): Promise<User> => {
    return client<User>('users', { data: user, method: 'PATCH' });
  };
  return useMutation(updateUser, {
    onSuccess: () => {
      queryCache.invalidateQueries('users');
    },
  });
}
