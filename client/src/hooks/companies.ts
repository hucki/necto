import { useQuery, UseQueryResult, QueryClient } from '@tanstack/react-query';
import { client } from '../services/ApiClient';
import { Company } from '../types/Company';

export function useAllCompanies(): UseQueryResult<Company[]> & {
  companies: Company[];
} {
  const queryClient = new QueryClient();
  const companiesQuery = useQuery(['companies'], async () => {
    return client<Company[]>('companies');
  });

  const companies =
    companiesQuery.data?.sort((a, b) => parseInt(a.name) - parseInt(b.name)) ??
    [];

  return {
    companies,
    ...companiesQuery,
  };
}
