import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { AccountsAPIResponse } from '../types/Api';
import { client } from '../services/ApiClient';
import { Account, NewAccount } from '../types/Accounts';

export function useCreateAccount(): UseMutationResult<
  Account,
  Error,
  { account: NewAccount },
  string
> {
  const queryClient = useQueryClient();
  const createTimesheetEntry = async ({
    account,
  }: {
    account: NewAccount;
  }): Promise<Account> => {
    return client<NewAccount, Account>('v2/times', {
      data: account,
    });
  };
  return useMutation(createTimesheetEntry, {
    onSuccess: () => {
      queryClient.invalidateQueries(['times']);
    },
  });
}

/**
 * universal V2 JSON API accounts getter
 */
export function useAccounts(): UseQueryResult<AccountsAPIResponse> & {
  rawAccounts: Account[];
} {
  const accountsQuery = useQuery(['accounts'], async () => {
    return client<AccountsAPIResponse>('v2/accounts');
  });

  const rawAccounts = accountsQuery.data?.data?.map((e) => e.attributes) ?? [];
  return {
    rawAccounts,
    ...accountsQuery,
  };
}
