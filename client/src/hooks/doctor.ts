import {
  useQuery,
  QueryResult,
  useMutation,
  MutationResultPair,
  queryCache,
} from 'react-query';
import { client } from '../services/ApiClient';
import { Doctor, DoctorInput } from '../types/Doctor';

export function useCreateDoctor(): MutationResultPair<
Doctor,
  Error,
  { doctor: DoctorInput },
  string
  > {
  const createDoctor = async ({
    doctor,
  }: {
    doctor: DoctorInput;
  }): Promise<Doctor> => {
    return client<DoctorInput>('doctors', { data: doctor });
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
  const updateDoctor = async ({
    doctor,
  }: {
    doctor: DoctorInput;
  }): Promise<Doctor> => {
    return client<DoctorInput>(`doctors/${doctor.uuid}`, { data: doctor, method: 'PATCH' });
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

