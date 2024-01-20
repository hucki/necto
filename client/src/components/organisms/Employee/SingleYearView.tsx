import React, { useEffect, useState } from 'react';
import { Employee } from '../../../types/Employee';
import { ControlWrapper } from '../../atoms/Wrapper';
import { FormControl, FormLabel, Select } from '../../Library';
import { useAllActiveEmployees } from '../../../hooks/employees';
import { useTranslation } from 'react-i18next';
import { TimeSheetYear } from './TimeSheetYear';
import { getDisplayName } from '../../../helpers/displayNames';
import { getCurrentContract } from '../../../helpers/contract';

const SingleYearView = () => {
  const { t } = useTranslation();

  const { data: employees, isLoading } = useAllActiveEmployees();
  const [currentEmployee, setCurrentEmployee] = useState<Employee | undefined>(
    () => (employees && employees[0]) || undefined
  );

  useEffect(() => {
    if (!isLoading && employees?.length && !currentEmployee) {
      setCurrentEmployee(employees[0]);
    }
  }, [isLoading]);

  const onEmployeeChangeHandler = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedEmployee = employees?.filter(
      (t) => t.uuid === event.target.value
    )[0];
    if (selectedEmployee?.uuid) {
      setCurrentEmployee(selectedEmployee);
    }
  };
  const contract = currentEmployee
    ? getCurrentContract(currentEmployee)
    : undefined;

  return !currentEmployee || !contract || !employees ? null : (
    <>
      <ControlWrapper>
        <FormControl id="employee">
          <Select
            name="employee"
            value={currentEmployee.uuid}
            onChange={onEmployeeChangeHandler}
          >
            {employees
              .sort((a, b) => (a.lastName < b.lastName ? -1 : 1))
              .map((t, i) => (
                <option key={i} value={t.uuid}>
                  {t.firstName + ' ' + t.lastName}
                </option>
              ))}
          </Select>
          <FormLabel>{t('label.employeeSelect')}</FormLabel>
        </FormControl>
      </ControlWrapper>
      <TimeSheetYear
        employeeId={currentEmployee.uuid}
        name={getDisplayName({ person: currentEmployee, type: 'full' })}
        contract={contract}
      />
    </>
  );
};

export default SingleYearView;
