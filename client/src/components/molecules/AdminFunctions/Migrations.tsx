import { Button } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useCreateAddpayFreedom } from '../../../hooks/addpay';
import { useAllPatients } from '../../../hooks/patient';

export const Migrations = (): JSX.Element => {
  const { patients } = useAllPatients();
  const { mutateAsync: createAddpayFreedom, isSuccess } =
    useCreateAddpayFreedom();
  const [message, setMessage] = useState('');
  interface ConverterProps {
    targetYear: number;
  }
  useEffect(() => {
    setMessage(
      'no of Patients: ' + patients.length + ', updateSuccess: ' + isSuccess
    );
  }, [patients, isSuccess]);
  const convertIsAddPayFreedToAddpayFreedom = ({
    targetYear,
  }: ConverterProps) => {
    if (!patients) return;
    console.log('we have patients');
    for (let i = 0; i < patients.length; i++) {
      console.log('patient ', i);
      if (patients[i].isAddpayFreed) {
        console.log('patient ', i, patients[i].isAddpayFreed);
        if (
          !patients[i].addpayFreedom?.find(
            (freedom) =>
              new Date(freedom.freedUntil).getFullYear() === targetYear
          )
        ) {
          const newAddpayFreedom = {
            pid: patients[i].uuid || '',
            freedFrom: new Date(`01-01-${targetYear}`),
            freedUntil: new Date(`12-31-${targetYear}`),
          };
          if (newAddpayFreedom.pid.length) {
            createAddpayFreedom({
              addpayFreedom: newAddpayFreedom,
            });
          }
        }
      }
    }
  };
  return (
    <>
      <Button
        onClick={() =>
          convertIsAddPayFreedToAddpayFreedom({ targetYear: 2022 })
        }
      >
        convert isAddPayFreed to 2022
      </Button>
      <pre>{message}</pre>
    </>
  );
};
