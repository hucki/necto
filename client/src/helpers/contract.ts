import { Contract, Employee } from '../types/Employee';

export const getCurrentContract = (employee: Employee): Contract =>
  employee.contract[0];
