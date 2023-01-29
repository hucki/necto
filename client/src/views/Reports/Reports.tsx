import React, { useContext } from 'react';
import { FullPageSpinner } from '../../components/atoms/LoadingSpinner';
import EmployeeReport from '../../components/organisms/List/EmployeeReport';
import { useAllEmployeesWithWeeksEvents } from '../../hooks/employees';
import { UserDateContext } from '../../providers/UserDate';

const Reports = () => {
  const { currentDate } = useContext(UserDateContext);
  const { data, isLoading } = useAllEmployeesWithWeeksEvents(
    currentDate.year(),
    currentDate.week()
  );
  return (
    <>
      current week: {currentDate.week() + '/' + currentDate.year()}
      {(!data || isLoading) && <FullPageSpinner />}
      {data && <EmployeeReport employees={data} />}
    </>
  );
};

export default Reports;
