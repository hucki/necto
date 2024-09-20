import React from 'react';
import { useAccounts, useCreateAccount } from '../../../hooks/accounts';
import dayjs from 'dayjs';

export const Accounts = () => {
  const { rawAccounts: accounts } = useAccounts();
  const { mutateAsync: createAccount, isIdle } = useCreateAccount();
  const handleSubmit = async () => {
    try {
      await createAccount({
        account: {
          description: 'test',
          timeTypeId: '1', // FIXME: get uuid for timetype
          unit: 'minutes',
          validFrom: dayjs().toISOString(),
          validUntil: dayjs('2999-12-31').toISOString(),
        },
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      {' '}
      Konten
      {accounts.length ? accounts.map((a) => a.description) : null}
    </>
  );
};
