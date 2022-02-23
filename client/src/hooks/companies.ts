import { useQuery, QueryResult } from 'react-query';
import { useAuthenticatedClient } from '../services/ApiClient';
import { Company } from '../types/Company';

export function useAllCompanies(): QueryResult<Company[]> & {
  companies: Company[];
  } {
  const client = useAuthenticatedClient<Company[]>();

  const companiesQuery = useQuery('companies', async () => {
    return client('companies');
  });

  const companies =
    companiesQuery.data?.sort((a, b) => parseInt(a.name) - parseInt(b.name)) ??
    [];

  return {
    companies,
    ...companiesQuery,
  };
}
