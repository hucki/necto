import { useQuery, QueryResult } from 'react-query';
import { client } from '../services/ApiClient';
import { Company } from '../types/Company';

export function useAllCompanies(): QueryResult<Company[]> & {
  companies: Company[];
} {
  const companiesQuery = useQuery('companies', async () => {
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
