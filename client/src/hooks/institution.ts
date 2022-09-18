import {
  useQuery,
  QueryResult,
  useMutation,
  MutationResultPair,
  queryCache,
} from 'react-query';
import { client } from '../services/ApiClient';
import { Institution, InstitutionInput } from '../types/Institution';

export function useCreateInstitution(): MutationResultPair<
  Institution,
  Error,
  { institution: InstitutionInput },
  string
> {
  const createInstitution = async ({
    institution,
  }: {
    institution: InstitutionInput;
  }): Promise<Institution> => {
    return client<InstitutionInput>('institutions', { data: institution });
  };
  return useMutation(createInstitution, {
    onSuccess: () => {
      queryCache.invalidateQueries('institutions');
      queryCache.invalidateQueries('institutions/all');
      queryCache.invalidateQueries('institutions/archived');
    },
  });
}

export function useUpdateInstitution(): MutationResultPair<
  Institution,
  Error,
  { institution: InstitutionInput },
  string
> {
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
      queryCache.invalidateQueries('institutions/all');
      queryCache.invalidateQueries('institutions/archived');
    },
  });
}

export function useAllInstitutions(): QueryResult<Institution[]> & {
  institutions: Institution[];
} {
  const institutionsQuery = useQuery('institutions/all', async () => {
    return client<Institution[]>('institutions/all');
  });

  const institutions = institutionsQuery.data ?? [];

  return {
    institutions,
    ...institutionsQuery,
  };
}

export function useAllArchivedInstitutions(): QueryResult<Institution[]> & {
  institutions: Institution[];
} {
  const institutionsQuery = useQuery('institutions/archived', async () => {
    return client<Institution[]>('institutions/archived');
  });

  const institutions = institutionsQuery.data ?? [];

  return {
    institutions,
    ...institutionsQuery,
  };
}
