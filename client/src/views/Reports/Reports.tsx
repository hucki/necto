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
  const dateRange =
    currentDate.startOf('week').format('DD.MM.') +
    ' - ' +
    currentDate.endOf('week').format('DD.MM.YY');
  return (
    <>
      current week: {dateRange + ' (KW ' + currentDate.week() + ')'}
      {(!data || isLoading) && <FullPageSpinner />}
      {data && <EmployeeReport employees={data} dateRange={dateRange} />}
    </>
  );
};

export default Reports;
