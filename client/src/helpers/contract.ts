import dayjs from 'dayjs';
import { Contract, Employee } from '../types/Employee';

export const getContractOfCurrentMonth = (
  employee: Employee,
  year: number,
  month: number
): Contract => {
  const currentMonth = dayjs().year(year).month(month);
  const contract = employee.contract.find(
    (contract) =>
      (dayjs(contract.validFrom).isBefore(currentMonth, 'month') ||
        dayjs(contract.validFrom).isSame(currentMonth, 'month')) &&
      (dayjs(contract.validUntil).isAfter(currentMonth, 'month') ||
        dayjs(contract.validUntil).isSame(currentMonth, 'month'))
  );
  if (!contract) {
    // FIXME: handle error when no contract is found
    throw new Error('No contract found for current month');
  }
  return contract;
};
