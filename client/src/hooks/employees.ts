import { useQuery, QueryResult } from 'react-query';
import { client } from '../services/ApiClient';
import { Employee } from '../types/Employee';

export function useEmployee(
  uuid: string
): QueryResult<Employee> & { employee: Employee | undefined } {
  const employeeQuery = useQuery(['employee', uuid], async () => {
    return client<Employee>(`employees/${uuid}`);
  });
  const employee = employeeQuery.data;
  return {
    employee,
    ...employeeQuery,
  };
}

export function useAllEmployees(): QueryResult<Employee[]> & {
  employees: Employee[];
  } {

  const employeesQuery = useQuery('employees', async () => {
    return client<Employee[]>('employees');
  });

  const employees = employeesQuery.data ?? [];

  return {
    employees,
    ...employeesQuery,
  };
}
