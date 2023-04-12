import React from 'react';
import { useTranslation } from 'react-i18next';
import { Contract, NewContract } from '../../../types/Employee';

type ContractSummaryProps = {
  contract: Contract | NewContract;
};
const ContractSummary = ({ contract }: ContractSummaryProps) => {
  const { t } = useTranslation();
  const contractBase: 'hours' | 'appointments' =
    contract?.appointmentsPerWeek && contract?.appointmentsPerWeek > 0
      ? 'appointments'
      : 'hours';

  const targetTimePerDay =
    ((contract && contract[`${contractBase}PerWeek`]) || 0) /
    ((contract && contract.workdaysPerWeek) || 0);
  const leaveWorthPerDay = targetTimePerDay;
  return (
    <div className="contract">
      {t('employee.contract.summary', {
        numberOfUnits: contract[`${contractBase}PerWeek`] || 0,
        contractBase: t(`employee.contract.${contractBase}`),
        workdaysPerWeek: contract.workdaysPerWeek,
      })}{' '}
      {t('employee.contract.leaveWorthDescription', {
        leaveWorthPerDay,
        contractBase: t(`employee.contract.${contractBase}`),
      })}
    </div>
  );
};

export default ContractSummary;
