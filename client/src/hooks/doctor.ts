import {
  useQuery,
  QueryResult,
  useMutation,
  MutationResultPair,
  queryCache,
} from 'react-query';
import { client } from '../services/ApiClient';
import { Doctor } from '../types/Doctor';

export function useCreateDoctor(): MutationResultPair<
Doctor,
  Error,
  { doctor: Doctor },
  string
  > {
  const createDoctor = async ({
    doctor,
  }: {
    doctor: Doctor;
  }): Promise<Doctor> => {
    return client<Doctor>('doctors', { data: doctor });
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
  { doctor: Doctor },
  string
  > {
  const updateDoctor = async ({
    doctor,
  }: {
    doctor: Doctor;
  }): Promise<Doctor> => {
    return client<Doctor>(`doctors/${doctor.uuid}`, { data: doctor, method: 'PATCH' });
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

  const doctorsQuery = useQuery('doctors', async () => {
    return client<Doctor[]>('doctors');
  });

  const doctors = doctorsQuery.data ?? [];

  return {
    doctors,
    ...doctorsQuery,
  };
}

