import {
  useQuery,
  QueryResult,
  useMutation,
  MutationResultPair,
  queryCache,
} from 'react-query';
import { useAuthenticatedClient } from '../services/ApiClient';
import { Patient, PatientInput } from '../types/Patient';

export function useCreatePatient(): MutationResultPair<
  Patient,
  Error,
  { patient: PatientInput },
  string
  > {
  const client = useAuthenticatedClient<PatientInput>();
  const createPatient = async ({
    patient,
  }: {
    patient: PatientInput;
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

export function useAllWaitingPatients(): QueryResult<Patient[]> & {
  patients: Patient[];
  } {
  const client = useAuthenticatedClient<Patient[]>();

  const patientsQuery = useQuery('waiting', async () => {
    return client('waiting');
  });

  const patients = patientsQuery.data ?? [];

  return {
    patients,
    ...patientsQuery,
  };
}
