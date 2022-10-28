import {
  useQuery,
  UseQueryResult,
  useMutation,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { client } from '../services/ApiClient';
import { Institution, InstitutionInput } from '../types/Institution';

export function useCreateInstitution(): UseMutationResult<
  Institution,
  Error,
  { institution: InstitutionInput },
  string
> {
  const queryClient = useQueryClient();
  const createInstitution = async ({
    institution,
  }: {
    institution: InstitutionInput;
  }): Promise<Institution> => {
    return client<InstitutionInput>('institutions', { data: institution });
  };
  return useMutation(createInstitution, {
    onSuccess: () => {
      queryClient.invalidateQueries(['institutions']);
      queryClient.invalidateQueries(['institutions/all']);
      queryClient.invalidateQueries(['institutions/archived']);
    },
  });
}

export function useUpdateInstitution(): UseMutationResult<
  Institution,
  Error,
  { institution: InstitutionInput },
  string
> {
  const queryClient = useQueryClient();
  const updateInstitution = async ({
    institution,
  }: {
    institution: InstitutionInput;
  }): Promise<Institution> => {
    return client<InstitutionInput>(`institutions/${institution.uuid}`, {
      data: institution,
      method: 'PATCH',
    });
  };
  return useMutation(updateInstitution, {
    onSuccess: () => {
      queryClient.invalidateQueries(['institutions/all']);
      queryClient.invalidateQueries(['institutions/archived']);
    },
  });
}

export function useAllInstitutions(): UseQueryResult<Institution[]> & {
  institutions: Institution[];
} {
  const institutionsQuery = useQuery(['institutions/all'], async () => {
    return client<Institution[]>('institutions/all');
  });

  const institutions = institutionsQuery.data ?? [];

  return {
    institutions,
    ...institutionsQuery,
  };
}

export function useAllArchivedInstitutions(): UseQueryResult<Institution[]> & {
  institutions: Institution[];
} {
  const institutionsQuery = useQuery(['institutions/archived'], async () => {
    return client<Institution[]>('institutions/archived');
  });

  const institutions = institutionsQuery.data ?? [];

  return {
    institutions,
    ...institutionsQuery,
  };
}
