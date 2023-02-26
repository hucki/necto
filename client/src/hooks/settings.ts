import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import { client } from '../services/ApiClient';
import { WaitingPreference, WaitingPreferenceCreate } from '../types/Settings';

const waitingPreferenceRoute = 'settings/wp';

export function useCreateWaitingPreference(): UseMutationResult<
  WaitingPreferenceCreate,
  Error,
  { wp: WaitingPreferenceCreate },
  string
> {
  const queryClient = useQueryClient();
  const createWaitingPreference = async ({
    wp,
  }: {
    wp: WaitingPreferenceCreate;
  }): Promise<WaitingPreferenceCreate> => {
    return client<WaitingPreferenceCreate>(waitingPreferenceRoute, {
      data: wp,
    });
  };
  return useMutation(createWaitingPreference, {
    onSuccess: () => {
      queryClient.invalidateQueries([waitingPreferenceRoute]);
    },
  });
}

export function useUpdateWaitingPreference(): UseMutationResult<
  WaitingPreference,
  Error,
  { cr: WaitingPreference },
  string
> {
  const queryClient = useQueryClient();
  const updateWaitingPreference = async ({
    cr,
  }: {
    cr: WaitingPreference;
  }): Promise<WaitingPreference> => {
    return client<WaitingPreference>(waitingPreferenceRoute, {
      data: cr,
      method: 'PATCH',
    });
  };
  return useMutation(updateWaitingPreference, {
    onSuccess: () => {
      queryClient.invalidateQueries([waitingPreferenceRoute]);
    },
  });
}

export function useAllWaitingPreferences(): UseQueryResult<
  WaitingPreference[]
> & { waitingPreferences: WaitingPreference[] } {
  const usersQuery = useQuery([waitingPreferenceRoute], async () => {
    return client<WaitingPreference[]>(waitingPreferenceRoute);
  });

  const waitingPreferences = usersQuery.data ?? [];

  return {
    waitingPreferences,
    ...usersQuery,
  };
}

export function useDeleteWaitingPreference(): UseMutationResult<
  { message: string },
  Error,
  { key: string },
  string
> {
  const queryClient = useQueryClient();
  const deleteWaitingPreference = async ({
    key,
  }: {
    key: string;
  }): Promise<{ message: string }> => {
    return client<{ message: string }>(`${waitingPreferenceRoute}/${key}`, {
      method: 'DELETE',
    });
  };

  return useMutation(deleteWaitingPreference, {
    onSuccess: () => {
      queryClient.invalidateQueries([waitingPreferenceRoute]);
    },
  });
}
