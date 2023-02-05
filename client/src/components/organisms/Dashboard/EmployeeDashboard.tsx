import styled from '@emotion/styled/macro';
import React from 'react';
import { Employee } from '../../../types/Employee';
import { EmployeeCard } from '../../molecules/Cards/EmployeeCard';

const DashboardWrapper = styled.div({
  display: 'grid',
  gap: '0.5rem',
  gridAutoColumns: 'auto',
});

interface EmployeeDashboardProps {
  employees: Employee[];
}
/**
 * Report for Event states of Employees
 * @param employees
 * @returns JSX.Element
 */
const EmployeeDashboard = ({ employees }: EmployeeDashboardProps) => {
  const employeeCards = employees.map((employee) => {
    return (
      <>
        <EmployeeCard employee={employee} />
      </>
    );
  });

  return <DashboardWrapper>{employeeCards}</DashboardWrapper>;
};

export default EmployeeDashboard;
