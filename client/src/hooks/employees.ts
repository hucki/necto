import {
  useQuery,
  UseQueryResult,
  useQueryClient,
  useMutation,
  UseMutationResult,
} from '@tanstack/react-query';
import { client } from '../services/ApiClient';
import { Employee, NewEmployee } from '../types/Employee';

export function useEmployee(
  uuid: string
): UseQueryResult<Employee> & { employee: Employee | undefined } {
  const employeeQuery = useQuery(['employee', uuid], async () => {
    return client<Employee>(`employees/${uuid}`);
  });
  const employee = employeeQuery.data;
  return {
    employee,
    ...employeeQuery,
  };
}

export function useCreateEmployee(): UseMutationResult<
  Employee,
  Error,
  { employee: NewEmployee },
  string
> {
  const queryClient = useQueryClient();

  const createEmployee = async ({
    employee,
  }: {
    employee: NewEmployee;
  }): Promise<Employee> => {
    return client<NewEmployee, Employee>('employees', { data: employee });
  };
  return useMutation(createEmployee, {
    onSuccess: () => {
      queryClient.invalidateQueries(['employees']);
    },
  });
}

export function useUpdateEmployee(): UseMutationResult<
  Employee,
  Error,
  { employee: Employee },
  string
> {
  const queryClient = useQueryClient();
  const updateEmployee = async ({
    employee,
  }: {
    employee: Employee;
  }): Promise<Employee> => {
    return client<Employee>('employees', { data: employee, method: 'PATCH' });
  };
  return useMutation(updateEmployee, {
    onSuccess: () => {
      queryClient.invalidateQueries(['employees']);
    },
  });
}

export function useAllEmployees(): UseQueryResult<Employee[]> & {
  employees: Employee[];
} {
  const employeesQuery = useQuery(['employees/all'], async () => {
    return client<Employee[]>('employees/all');
  });

  const employees = employeesQuery.data ?? [];

  return {
    employees,
    ...employeesQuery,
  };
}

export function useAllEmployeesWithWeeksEvents(
  year: number,
  week: number
): UseQueryResult<Employee[]> & { employees: Employee[] } {
  const employeesQuery = useQuery(['employees', year, week], async () => {
    return client<Employee[]>(`employees/w/${year}/${week}`);
  });

  const employees = employeesQuery.data ?? [];
  return {
    employees,
    ...employeesQuery,
  };
}

export function useAllEmployeesWithMonthEvents(
  year: number,
  month: number
): UseQueryResult<Employee[]> & { employees: Employee[] } {
  const employeesQuery = useQuery(['employees', year, month], async () => {
    return client<Employee[]>(`employees/m/${year}/${month}`);
  });

  const employees = employeesQuery.data ?? [];
  return {
    employees,
    ...employeesQuery,
  };
}
