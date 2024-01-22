import React, { useContext, useEffect, useState } from 'react';
import { Employee } from '../../../types/Employee';
import { ControlWrapper } from '../../atoms/Wrapper';
import { FormControl, FormLabel, Select } from '../../Library';
import { useAllActiveEmployees } from '../../../hooks/employees';
import { useTranslation } from 'react-i18next';
import { TimeSheetYear } from './TimeSheetYear';
import { getDisplayName } from '../../../helpers/displayNames';
import { getCurrentContract } from '../../../helpers/contract';
import { Button } from '@chakra-ui/react';
import { UserDateContext } from '../../../providers/UserDate';
import dayjs from 'dayjs';
import { IconButton } from '../../atoms/Buttons';
import { CgPushChevronLeft, CgPushChevronRight } from 'react-icons/cg';

const SingleYearView = () => {
  const { t } = useTranslation();
  const [showTimesheet, setShowTimesheet] = useState(false);
  const { currentDate, goTo } = useContext(UserDateContext);
  const year = (currentDate.year() || dayjs().year()).toString();

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
    setShowTimesheet(false);
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
        <IconButton
          colorScheme="blackAlpha"
          marginRight={2}
          aria-label="previous month"
          leftIcon={<CgPushChevronLeft size="2rem" />}
          onClick={() => {
            setShowTimesheet(false);
            goTo('previousYear');
          }}
        />
        <span style={{ display: 'flex', alignItems: 'center' }}>
          {currentDate.format('YYYY')}
        </span>
        <IconButton
          colorScheme="blackAlpha"
          marginLeft={2}
          marginRight={2}
          aria-label="next month"
          leftIcon={<CgPushChevronRight size="2rem" />}
          onClick={() => {
            setShowTimesheet(false);
            goTo('nextYear');
          }}
        />
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
        <Button
          onClick={() => setShowTimesheet(true)}
          isDisabled={showTimesheet}
          colorScheme={!showTimesheet ? 'green' : 'gray'}
        >
          Go
        </Button>
      </ControlWrapper>
      {showTimesheet && (
        <TimeSheetYear
          employeeId={currentEmployee.uuid}
          name={getDisplayName({ person: currentEmployee, type: 'full' })}
          contract={contract}
          year={year}
        />
      )}
    </>
  );
};

export default SingleYearView;
