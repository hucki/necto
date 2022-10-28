import {
  useQuery,
  UseQueryResult,
  useMutation,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { client } from '../services/ApiClient';
import { Doctor } from '../types/Doctor';

export function useCreateDoctor(): UseMutationResult<
  Doctor,
  Error,
  { doctor: Doctor },
  string
> {
  const queryClient = useQueryClient();

  const createDoctor = async ({
    doctor,
  }: {
    doctor: Doctor;
  }): Promise<Doctor> => {
    return client<Doctor>('doctors', { data: doctor });
  };
  return useMutation(createDoctor, {
    onSuccess: () => {
      queryClient.invalidateQueries(['doctors']);
    },
  });
}

export function useUpdateDoctor(): UseMutationResult<
  Doctor,
  Error,
  { doctor: Doctor },
  string
> {
  const queryClient = useQueryClient();
  const updateDoctor = async ({
    doctor,
  }: {
    doctor: Doctor;
  }): Promise<Doctor> => {
    return client<Doctor>(`doctors/${doctor.uuid}`, {
      data: doctor,
      method: 'PATCH',
    });
  };
  return useMutation(updateDoctor, {
    onSuccess: () => {
      queryClient.invalidateQueries(['doctors']);
    },
  });
}

export function useAllDoctors(): UseQueryResult<Doctor[]> & {
  doctors: Doctor[];
} {
  const doctorsQuery = useQuery(['doctors'], async () => {
    return client<Doctor[]>('doctors');
  });

  const doctors = doctorsQuery.data ?? [];

  return {
    doctors,
    ...doctorsQuery,
  };
}
