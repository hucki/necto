import {
  useQuery,
  UseQueryResult,
  useMutation,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { client } from '../services/ApiClient';
import { TeamMember, User } from '../types/User';
import { UserSettings } from '../types/UserSettings';

export function useUser(
  id: string
): UseQueryResult<User> & { user: User | undefined } {
  const userQuery = useQuery(['user', id], async () => {
    return client<User>(`users/${id}`);
  });
  const user = userQuery.data;
  return {
    user,
    ...userQuery,
  };
}

export function useAddUser(): UseMutationResult<
  User,
  Error,
  { user: User },
  string
> {
  const queryClient = useQueryClient();
  const createUser = async ({ user }: { user: User }): Promise<User> => {
    return client<User>('users', { data: user });
  };
  return useMutation(createUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });
}

export function useAllUsers(): UseQueryResult<User[]> & { users: User[] } {
  const usersQuery = useQuery(['users'], async () => {
    return client<User[]>('users');
  });

  const users = usersQuery.data ?? [];

  return {
    users,
    ...usersQuery,
  };
}

export function useAllTeamMembers(): UseQueryResult<TeamMember[]> & {
  teamMembers: TeamMember[];
} {
  const teamMembersQuery = useQuery(['teamMembers'], async () => {
    return client<TeamMember[]>('teamMembers');
  });

  const teamMembers = teamMembersQuery.data ?? [];

  return {
    teamMembers,
    ...teamMembersQuery,
  };
}

export function useCreateUserSettings(): UseMutationResult<
  UserSettings,
  Error,
  { userSettings: UserSettings },
  string
> {
  const queryClient = useQueryClient();
  const createUserSettings = async ({
    userSettings,
  }: {
    userSettings: UserSettings;
  }): Promise<UserSettings> => {
    return client<UserSettings>('settings/user', { data: userSettings });
  };
  return useMutation(createUserSettings, {
    onSuccess: () => {
      queryClient.invalidateQueries(['settings/user']);
    },
  });
}

export function useUpdateUserSettings(): UseMutationResult<
  UserSettings,
  Error,
  { userSettings: UserSettings },
  string
> {
  const queryClient = useQueryClient();
  const updateUserSettings = async ({
    userSettings,
  }: {
    userSettings: UserSettings;
  }): Promise<UserSettings> => {
    return client<UserSettings>('settings/user', {
      data: userSettings,
      method: 'PATCH',
    });
  };
  return useMutation(updateUserSettings, {
    onSuccess: () => {
      queryClient.invalidateQueries(['settings/user']);
    },
  });
}

export function useUpdateUser(): UseMutationResult<
  User,
  Error,
  { user: User },
  string
> {
  const queryClient = useQueryClient();
  const updateUser = async ({ user }: { user: User }): Promise<User> => {
    return client<User>('users', { data: user, method: 'PATCH' });
  };
  return useMutation(updateUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });
}
