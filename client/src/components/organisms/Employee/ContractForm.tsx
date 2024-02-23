import React, { ChangeEvent } from 'react';
import { Contract, NewContract } from '../../../types/Employee';
import { useTranslation } from 'react-i18next';
import { useAllRooms } from '../../../hooks/rooms';
import {
  Checkbox,
  FormControl,
  FormLabel,
  LabelledInput,
  Select,
} from '../../Library';
import { Heading, Stack } from '@chakra-ui/react';
import { ContractSummary } from '../../molecules/DataDisplay/ContractSummary';
import { colors } from '../../../config/colors';
import dayjs from 'dayjs';

interface ContractFormProps {
  contract: Contract | NewContract;
  disabled: boolean;
  handleChangeContract: ({
    // eslint-disable-next-line no-unused-vars
    targetName,
    // eslint-disable-next-line no-unused-vars
    targetValue,
  }: {
    targetName: keyof Contract;
    targetValue: string;
  }) => void;
}
export const ContractForm = ({
  contract,
  handleChangeContract,
  disabled = true,
}: ContractFormProps) => {
  const { t } = useTranslation();
  const { rooms } = useAllRooms();
  const bgColor = contract.bgColor || 'green';
  const activeWorkdays = contract.activeWorkdays.split(',');
  const handleContractChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    e.preventDefault();
    const newdate = dayjs(e.target.value).endOf('month');
    handleChangeContract({
      targetName: e.target.name as keyof Contract,
      targetValue: newdate.format('YYYY-MM-DD'),
    });
  };

  const ActiveWorkdaysCheckboxes = () => {
    const allWorkdays = ['1', '2', '3', '4', '5'];
    const handleActiveWorkdayChange = (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const day = e.currentTarget.name;
      const checked = e.currentTarget.checked;
      const newActiveWorkdays = checked
        ? [...activeWorkdays, day].sort((a, b) => parseInt(a) - parseInt(b))
        : [...activeWorkdays.filter((activeDay) => activeDay !== day)].sort(
            (a, b) => parseInt(a) - parseInt(b)
          );
      handleChangeContract({
        targetName: 'activeWorkdays',
        targetValue: newActiveWorkdays.join(),
      });
    };
    return (
      <>
        {allWorkdays.map((day) => (
          <Checkbox
            disabled={disabled}
            key={day}
            name={day}
            isChecked={Boolean(activeWorkdays.find((item) => item === day))}
            onChange={handleActiveWorkdayChange}
          >
            {dayjs().day(parseInt(day)).format('ddd')}
          </Checkbox>
        ))}
      </>
    );
  };
  return (
    <>
      <Heading as="h2" size="sm" mb="3" mt="5">
        {t('label.contractData')}
      </Heading>
      <ContractSummary contract={contract} />
      <Stack direction="row">
        <ActiveWorkdaysCheckboxes />
      </Stack>
      <LabelledInput
        id="workdaysPerWeek"
        disabled={disabled}
        type="number"
        name="workdaysPerWeek"
        value={contract.workdaysPerWeek || 0}
        onChangeHandler={handleContractChange}
        label={t('label.workdaysPerWeek')}
      />
      <LabelledInput
        id="appointmentsPerWeek"
        disabled={disabled}
        type="number"
        name="appointmentsPerWeek"
        value={contract.appointmentsPerWeek || 0}
        onChangeHandler={handleContractChange}
        label={t('label.appointmentsPerWeek')}
      />
      <LabelledInput
        id="hoursPerWeek"
        disabled={disabled || Boolean(contract.appointmentsPerWeek)}
        type="number"
        name="hoursPerWeek"
        value={contract.hoursPerWeek || 0}
        onChangeHandler={handleContractChange}
        label={t('label.hoursPerWeek')}
        errorMessage={
          contract.appointmentsPerWeek && contract.appointmentsPerWeek > 0
            ? t('employee.contract.hours') +
              ' ' +
              t('employee.contract.overruledBy') +
              t('employee.contract.appointments')
            : undefined
        }
      />
      <FormControl id="bgColor" m={'15px auto 10px auto'}>
        <Select
          disabled={disabled}
          name="bgColor"
          value={contract.bgColor || 'green'}
          style={{
            backgroundColor: `var(--bg${
              bgColor[0].toUpperCase() + bgColor.substring(1)
            })`,
          }}
          onChange={handleContractChange}
        >
          {colors.map((color, i) => (
            <option key={i} value={color}>
              {color}
            </option>
          ))}
        </Select>
        <FormLabel>{t('label.bgColor')}</FormLabel>
      </FormControl>
      <FormControl id="roomId">
        <Select
          disabled={disabled}
          name="roomId"
          style={{
            backgroundColor: contract.roomId ? undefined : 'var(--bgNote)',
          }}
          value={contract.roomId || ''}
          onChange={handleContractChange}
        >
          <option value="">{t('label.noRoom')}</option>
          {rooms.map((room, i) => (
            <option key={i} value={room.uuid}>
              {room.displayName} (
              {room.building.displayName + ': ' + room.description})
            </option>
          ))}
        </Select>
        <FormLabel>{t('label.room')}</FormLabel>
      </FormControl>
      <LabelledInput
        id="validUntil"
        disabled={disabled}
        type="month"
        name="validUntil"
        autoComplete="valid-until"
        value={
          contract.validUntil
            ? dayjs(contract.validUntil).format('YYYY-MM')
            : ''
        }
        onChangeHandler={handleContractChange}
        label={t('label.validUntil')}
      />
    </>
  );
};
