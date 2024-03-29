import React from 'react';
import { useTranslation } from 'react-i18next';
import { Contract, NewContract } from '../../../types/Employee';
import dayjs from 'dayjs';
import { Text, View } from '@react-pdf/renderer';

type ContractSummaryProps = {
  contract: Contract | NewContract;
  variant?: 'full' | 'short';
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

export const ContractSummary = ({
  contract,
  variant = 'full',
}: ContractSummaryProps) => {
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

  return variant === 'full' ? (
    <div className="contract">
      <b>
        {(contract as Contract).validFrom
          ? `${t('label.from')}: ${dayjs(
              (contract as Contract).validFrom
            ).format('L')} `
          : ''}
        {`${t('label.validUntil')}: ${dayjs(contract.validUntil).format('L')}`}
      </b>
      <br />
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
  ) : (
    <div className="contract">{getShortContractSummary({ contract })}</div>
  );
};

export const getShortContractSummary = ({
  contract,
}: {
  contract: Contract | NewContract;
}) => {
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

  return `${t('employee.contractShortform.summary', {
    numberOfUnits: contract[`${contractBase}PerWeek`] || 0,
    contractBase: t(`employee.contractShortform.${contractBase}`),
    workdaysPerWeek: contract.workdaysPerWeek,
  })} - ${
    activeWorkdayNames
      ? t('employee.contractShortform.activeWorkdays', {
          activeWorkdayNames,
        })
      : ''
  } ${t('employee.contractShortform.leaveWorthDescription', {
    leaveWorthPerDay,
    contractBase: t(`employee.contractShortform.${contractBase}`),
  })}`;
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
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #3333',
        padding: '2pt',
        backgroundColor: '#f5f5f5', // whitesmoke
        lineHeight: '1.5pt',
      }}
    >
      <Text style={{ width: '100%', fontWeight: 'bold' }}>
        {t('employee.timesheet.model')}
        {(contract as Contract).validFrom
          ? ` - ${dayjs((contract as Contract).validFrom).format('L')}`
          : ''}
        {` - ${
          !(contract as Contract).validFrom ? t('label.validUntil') + ': ' : ''
        }${dayjs(contract.validUntil).format('L')}`}
        :
      </Text>
      <Text style={{ width: '100%' }}>
        {t('employee.contract.summary', {
          numberOfUnits: contract[`${contractBase}PerWeek`] || 0,
          contractBase: t(`employee.contract.${contractBase}`),
          workdaysPerWeek: contract.workdaysPerWeek,
        })}
      </Text>
      <Text style={{ width: '100%' }}>
        {activeWorkdayNames ? (
          <>
            {t('employee.contract.activeWorkdays', {
              activeWorkdayNames,
            })}
          </>
        ) : undefined}
      </Text>
      <Text style={{ width: '100%' }}>
        {t('employee.contract.leaveWorthDescription', {
          leaveWorthPerDay,
          contractBase: t(`employee.contract.${contractBase}`),
        })}
      </Text>
    </View>
  );
};

// export default ContractSummary;
