import { useQuery, QueryResult } from 'react-query';
import { useAuthenticatedClient } from '../services/ApiClient';
import { Employee, Contract, Team } from '../types/Employee';

export function useEmployee(
  uuid: string
): QueryResult<Employee> & { employee: Employee | undefined } {
  const client = useAuthenticatedClient<Employee>();
  const employeeQuery = useQuery(['employee', uuid], async () => {
    return client(`employees/${uuid}`);
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
  const client = useAuthenticatedClient<Employee[]>();

  const employeesQuery = useQuery('employees', async () => {
    return client('employees');
  });

  const employees = employeesQuery.data ?? [];

  return {
    employees,
    ...employeesQuery,
  };
}
