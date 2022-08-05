import {
  useQuery,
  QueryResult,
  useMutation,
  MutationResultPair,
  queryCache,
} from 'react-query';
import { client } from '../services/ApiClient';
import { Patient } from '../types/Patient';

export function useCreatePatient(): MutationResultPair<
  Patient,
  Error,
  { patient: Patient },
  string
  > {
  const createPatient = async ({
    patient,
  }: {
    patient: Patient;
  }): Promise<Patient> => {
    return client<Patient>('patients', { data: patient });
  };
  return useMutation(createPatient, {
    onSuccess: () => {
      queryCache.invalidateQueries('patients');
    },
  });
}

export function useUpdatePatient(): MutationResultPair<
  Patient,
  Error,
  { patient: Patient },
  string
  > {
  const updatePatient = async ({
    patient,
  }: {
    patient: Patient;
  }): Promise<Patient> => {
    return client<Patient>(`patients/${patient.uuid}`, { data: patient, method: 'PATCH' });
  };
  return useMutation(updatePatient, {
    onSuccess: () => {
      queryCache.invalidateQueries('patients');
      queryCache.invalidateQueries('waiting');
    },
  });
}

export function useAllPatients(): QueryResult<Patient[]> & {
  patients: Patient[];
  } {
  const patientsQuery = useQuery('patients', async () => {
    return client<Patient[]>('patients');
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
  const patientsQuery = useQuery('waiting', async () => {
    return client<Patient[]>('waiting');
  });

  const patients = patientsQuery.data ?? [];

  return {
    patients,
    ...patientsQuery,
  };
}
