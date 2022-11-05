import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from '@tanstack/react-query';
import { client } from '../services/ApiClient';
import { Contract, NewContract } from '../types/Employee';

export function useCreateContract(): UseMutationResult<
  NewContract,
  Error,
  { contract: NewContract },
  string
> {
  const queryClient = useQueryClient();
  const createContract = async ({
    contract,
  }: {
    contract: NewContract;
  }): Promise<NewContract> => {
    return client<NewContract>('contracts', {
      data: contract,
    });
  };
  return useMutation(createContract, {
    onSuccess: () => {
      queryClient.invalidateQueries(['employees/all']);
      queryClient.invalidateQueries(['contracts']);
    },
  });
}

export function useUpdateContract(): UseMutationResult<
  Contract,
  Error,
  { contract: Contract },
  string
> {
  const queryClient = useQueryClient();
  const updateContract = async ({
    contract,
  }: {
    contract: Contract;
  }): Promise<Contract> => {
    return client<Contract>(`contracts/${contract.id}`, {
      data: contract,
      method: 'PATCH',
    });
  };
  return useMutation(updateContract, {
    onSuccess: () => {
      queryClient.invalidateQueries(['employees/all']);
      queryClient.invalidateQueries(['contracts']);
    },
  });
}
