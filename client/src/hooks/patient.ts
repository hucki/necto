import {
  useQuery,
  QueryResult,
  useMutation,
  MutationResultPair,
  queryCache,
} from 'react-query';
import { useAuthenticatedClient } from '../services/ApiClient';
import { Patient } from '../types/Patient';

export function useCreatePatient(): MutationResultPair<
  Patient,
  Error,
  { patient: Patient },
  string
  > {
  const client = useAuthenticatedClient<Patient>();
  const createPatient = async ({
    patient,
  }: {
    patient: Patient;
  }): Promise<Patient> => {
    return client('patients', { data: patient });
  };
  return useMutation(createPatient, {
    onSuccess: () => {
      queryCache.invalidateQueries('patients');
    },
  });
}

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
