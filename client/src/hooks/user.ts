import { useQuery,
  QueryResult,
  useMutation,
  MutationResultPair,
  queryCache } from 'react-query';
import { useAuthenticatedClient } from '../services/ApiClient';
import { TeamMember, User } from '../types/User';
import { UserSettings } from '../types/UserSettings';

export function useUser (
  id: number
): QueryResult<User> & { user: User | undefined } {
  const client = useAuthenticatedClient<User>();
  const userQuery = useQuery(['user', id], async () => {
    return client(`users/${id}`);
  });
  const user = userQuery.data;
  return {
    user,
    ...userQuery,
  };
}

export function useAddUser (): MutationResultPair<
  User,
  Error,
  { user: User },
  string
  > {
  const client = useAuthenticatedClient<User>();
  const createUser = async ({ user }: { user: User }): Promise<User> => {
    return client('users', { data: user });
  };
  return useMutation(createUser, {
    onSuccess: () => {
      queryCache.invalidateQueries('users');
    },
  });
}


export function useAuth0User (
  a0Id: string
): QueryResult<User> & { user: User | undefined } {
  const client = useAuthenticatedClient<User>();
  const userQuery = useQuery(['a0user', a0Id], async () => {
    return client(`a0users/${a0Id}`);
  });
  const user = userQuery.data;
  return {
    user,
    ...userQuery,
  };
}

export function useAllUsers (): QueryResult<User[]> & { users: User[] } {
  const client = useAuthenticatedClient<User[]>();

  const usersQuery = useQuery('users', async () => {
    return client('users');
  });

  const users = usersQuery.data ?? [];

  return {
    users,
    ...usersQuery,
  };
}

export function useAllTeamMembers (): QueryResult<TeamMember[]> & {
  teamMembers: TeamMember[];
  } {
  const client = useAuthenticatedClient<TeamMember[]>();

  const teamMembersQuery = useQuery('teamMembers', async () => {
    return client('teamMembers');
  });

  const teamMembers = teamMembersQuery.data ?? [];

  return {
    teamMembers,
    ...teamMembersQuery,
  };
}

export function useCreateUserSettings (): MutationResultPair<
  UserSettings,
  Error,
  { userSettings: UserSettings },
  string
  > {
  const client = useAuthenticatedClient<UserSettings>();
  const createUserSettings = async ({ userSettings }: { userSettings: UserSettings }): Promise<UserSettings> => {
    return client('settings/user', { data: userSettings });
  };
  return useMutation(createUserSettings, {
    onSuccess: () => {
      queryCache.invalidateQueries('settings/user');
    },
  });
}

export function useUpdateUserSettings (): MutationResultPair<
  UserSettings,
  Error,
  { userSettings: UserSettings },
  string
  > {
  const client = useAuthenticatedClient<UserSettings>();
  const updateUserSettings = async ({ userSettings }: { userSettings: UserSettings }): Promise<UserSettings> => {
    return client('settings/user', { data: userSettings, method: 'PATCH' });
  };
  return useMutation(updateUserSettings, {
    onSuccess: () => {
      queryCache.invalidateQueries('settings/user');
    },
  });
}

