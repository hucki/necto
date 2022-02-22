import { useQuery, QueryResult } from 'react-query';
import { useAuthenticatedClient } from '../services/ApiClient';
import { Patient } from '../types/Patient';

export function useAllPatients(): QueryResult<Patient[]> & {
  patients: Patient[];
  } {
  const client = useAuthenticatedClient<Patient[]>();

  const patientsQuery = useQuery('patients', async () => {
    return client('patients');
  });

  const patients = patientsQuery.data ?? [];

  return {
    patients,
    ...patientsQuery,
  };
}
