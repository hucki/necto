import React from 'react';
import { useTranslation } from 'react-i18next';
import { Contract, NewContract } from '../../../types/Employee';
import dayjs from 'dayjs';
import { Text, View } from '@react-pdf/renderer';

type ContractSummaryProps = {
  contract: Contract | NewContract;
};

const getContractBase = (
  contract: Contract | NewContract
): 'hours' | 'appointments' => {
  return contract.appointmentsPerWeek && contract.appointmentsPerWeek > 0
    ? 'appointments'
    : 'hours';
};

const getTargetTimePerDay = (contract: Contract | NewContract) => {
  return (
    ((contract && contract[`${getContractBase(contract)}PerWeek`]) || 0) /
    ((contract && contract.workdaysPerWeek) || 0)
  );
};
export const ContractSummary = ({ contract }: ContractSummaryProps) => {
  const { t } = useTranslation();
  const contractBase: 'hours' | 'appointments' = getContractBase(contract);
  const targetTimePerDay = getTargetTimePerDay(contract);
  const activeWorkdays = contract.activeWorkdays.split(',');
  const activeWorkdayNames =
    activeWorkdays.length !== 5
      ? activeWorkdays
          .map((day) => dayjs().day(parseInt(day)).format('dddd'))
          .join(', ')
      : undefined;

  const leaveWorthPerDay = targetTimePerDay;
  return (
    <div className="contract">
      {t('employee.contract.summary', {
        numberOfUnits: contract[`${contractBase}PerWeek`] || 0,
        contractBase: t(`employee.contract.${contractBase}`),
        workdaysPerWeek: contract.workdaysPerWeek,
      })}
      <br />
      {activeWorkdayNames ? (
        <>
          {t('employee.contract.activeWorkdays', {
            activeWorkdayNames,
          })}
          <br />
        </>
      ) : undefined}
      {t('employee.contract.leaveWorthDescription', {
        leaveWorthPerDay,
        contractBase: t(`employee.contract.${contractBase}`),
      })}
    </div>
  );
};

export const ContractSummaryDoc = ({ contract }: ContractSummaryProps) => {
  const { t } = useTranslation();
  const contractBase: 'hours' | 'appointments' = getContractBase(contract);
  const targetTimePerDay = getTargetTimePerDay(contract);
  const activeWorkdays = contract.activeWorkdays.split(',');
  const activeWorkdayNames =
    activeWorkdays.length !== 5
      ? activeWorkdays
          .map((day) => dayjs().day(parseInt(day)).format('dddd'))
          .join(', ')
      : undefined;

  const leaveWorthPerDay = targetTimePerDay;
  return (
    <View style={{ display: 'flex', flexDirection: 'column' }}>
      <Text>
        {t('employee.contract.summary', {
          numberOfUnits: contract[`${contractBase}PerWeek`] || 0,
          contractBase: t(`employee.contract.${contractBase}`),
          workdaysPerWeek: contract.workdaysPerWeek,
        })}
      </Text>
      <Text>
        {activeWorkdayNames ? (
          <>
            {t('employee.contract.activeWorkdays', {
              activeWorkdayNames,
            })}
          </>
        ) : undefined}
      </Text>
      <Text>
        {t('employee.contract.leaveWorthDescription', {
          leaveWorthPerDay,
          contractBase: t(`employee.contract.${contractBase}`),
        })}
      </Text>
    </View>
  );
};

// export default ContractSummary;
