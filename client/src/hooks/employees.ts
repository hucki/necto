import {
  useQuery,
  QueryResult,
  queryCache,
  useMutation,
  MutationResultPair,
} from 'react-query';
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

export function useUpdateEmployee(): MutationResultPair<
  Employee,
  Error,
  { employee: Employee },
  string
> {
  const updateEmployee = async ({
    employee,
  }: {
    employee: Employee;
  }): Promise<Employee> => {
    return client<Employee>('employees', { data: employee, method: 'PATCH' });
  };
  return useMutation(updateEmployee, {
    onSuccess: () => {
      queryCache.invalidateQueries('employees');
    },
  });
}

export function useAllEmployees(): QueryResult<Employee[]> & {
  employees: Employee[];
} {
  const employeesQuery = useQuery('employees/all', async () => {
    return client<Employee[]>('employees/all');
  });

  const employees = employeesQuery.data ?? [];

  return {
    employees,
    ...employeesQuery,
  };
}
