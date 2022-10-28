import {
  useQuery,
  UseQueryResult,
  useMutation,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { client } from '../services/ApiClient';
import { Patient } from '../types/Patient';

export function useCreatePatient(): UseMutationResult<
  Patient,
  Error,
  { patient: Patient },
  string
> {
  const queryClient = useQueryClient();
  const createPatient = async ({
    patient,
  }: {
    patient: Patient;
  }): Promise<Patient> => {
    return client<Patient>('patients', { data: patient });
  };
  return useMutation(createPatient, {
    onSuccess: () => {
      queryClient.invalidateQueries(['patients']);
    },
  });
}

export function useUpdatePatient(): UseMutationResult<
  Patient,
  Error,
  { patient: Patient },
  string
> {
  const queryClient = useQueryClient();
  const updatePatient = async ({
    patient,
  }: {
    patient: Patient;
  }): Promise<Patient> => {
    return client<Patient>(`patients/${patient.uuid}`, {
      data: patient,
      method: 'PATCH',
    });
  };
  return useMutation(updatePatient, {
    onSuccess: () => {
      queryClient.invalidateQueries(['patients']);
      queryClient.invalidateQueries(['waiting']);
    },
  });
}

export function useAllPatients(): UseQueryResult<Patient[]> & {
  patients: Patient[];
} {
  const patientsQuery = useQuery(['patients'], async () => {
    return client<Patient[]>('patients');
  });

  const patients = patientsQuery.data ?? [];

  return {
    patients,
    ...patientsQuery,
  };
}

export function useAllWaitingPatients(): UseQueryResult<Patient[]> & {
  patients: Patient[];
} {
  const patientsQuery = useQuery(['waiting'], async () => {
    return client<Patient[]>('waiting');
  });

  const patients = patientsQuery.data ?? [];

  return {
    patients,
    ...patientsQuery,
  };
}
