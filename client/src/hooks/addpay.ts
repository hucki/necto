import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import { client } from '../services/ApiClient';
import { AddpayFreedom, AddpayFreedomInput } from '../types/Patient';

export function useAddpayFreedomOfPatient(patientId: string): UseQueryResult<
  AddpayFreedom[]
> & {
  addpayFreedom: AddpayFreedom[];
} {
  const addpayFreedomQuery = useQuery(['addpay'], async () => {
    return client<AddpayFreedom[]>(`addpay/${patientId}`);
  });

  const addpayFreedom = addpayFreedomQuery.data ?? [];

  return {
    addpayFreedom,
    ...addpayFreedomQuery,
  };
}

export function useCreateAddpayFreedom(): UseMutationResult<
  AddpayFreedom,
  Error,
  { addpayFreedom: AddpayFreedomInput },
  string
> {
  const queryClient = useQueryClient();
  const createAddpayFreedom = async ({
    addpayFreedom,
  }: {
    addpayFreedom: AddpayFreedomInput;
  }): Promise<AddpayFreedom> => {
    return client<AddpayFreedomInput, AddpayFreedom>('addpay', {
      data: addpayFreedom,
    });
  };
  return useMutation(createAddpayFreedom, {
    onSuccess: () => {
      queryClient.invalidateQueries(['addpay']);
    },
  });
}

export function useDeleteAddpayFreedom(): UseMutationResult<
  { message: string },
  Error,
  { uuid: string },
  string
> {
  const queryClient = useQueryClient();
  const deleteAddpayFreedom = async ({
    uuid,
  }: {
    uuid: string;
  }): Promise<{ message: string }> => {
    return client<{ message: string }>(`addpay/${uuid}`, {
      method: 'DELETE',
    });
  };

  return useMutation(deleteAddpayFreedom, {
    onSuccess: () => {
      queryClient.invalidateQueries(['addpay']);
    },
  });
}
