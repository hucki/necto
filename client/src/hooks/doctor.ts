import {
  useQuery,
  QueryResult,
  useMutation,
  MutationResultPair,
  queryCache,
} from 'react-query';
import { useAuthenticatedClient } from '../services/ApiClient';
import { Doctor, DoctorInput } from '../types/Doctor';

export function useCreateDoctor(): MutationResultPair<
Doctor,
  Error,
  { doctor: DoctorInput },
  string
  > {
  const client = useAuthenticatedClient<DoctorInput>();
  const createDoctor = async ({
    doctor,
  }: {
    doctor: DoctorInput;
  }): Promise<Doctor> => {
    return client('doctors', { data: doctor });
  };
  return useMutation(createDoctor, {
    onSuccess: () => {
      queryCache.invalidateQueries('doctors');
    },
  });
}

export function useUpdateDoctor(): MutationResultPair<
Doctor,
  Error,
  { doctor: DoctorInput },
  string
  > {
  const client = useAuthenticatedClient<DoctorInput>();
  const updateDoctor = async ({
    doctor,
  }: {
    doctor: DoctorInput;
  }): Promise<Doctor> => {
    return client(`doctors/${doctor.uuid}`, { data: doctor, method: 'PATCH' });
  };
  return useMutation(updateDoctor, {
    onSuccess: () => {
      queryCache.invalidateQueries('doctors');
    },
  });
}

export function useAllDoctors(): QueryResult<Doctor[]> & {
  doctors: Doctor[];
  } {
  const client = useAuthenticatedClient<Doctor[]>();

  const doctorsQuery = useQuery('doctors', async () => {
    return client('doctors');
  });

  const doctors = doctorsQuery.data ?? [];

  return {
    doctors,
    ...doctorsQuery,
  };
}

