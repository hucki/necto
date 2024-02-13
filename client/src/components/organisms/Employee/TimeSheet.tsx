import React, { useContext, useEffect } from 'react';
import TimesheetView from '../../molecules/DataDisplay/TimesheetView';
import { Employee } from '../../../types/Employee';
import { getDisplayName } from '../../../helpers/displayNames';
import { UserDateContext } from '../../../providers/UserDate';
import { IconButton } from '../../atoms/Buttons';
import { CgPushChevronLeft, CgPushChevronRight } from 'react-icons/cg';
import { FullPageSpinner } from '../../atoms/LoadingSpinner';
import dayjs from 'dayjs';
import { useEvents } from '../../../hooks/events';
import { useTimesheet } from '../../../hooks/timesheet';

interface TimeSheetProps {
  employee: Employee;
}
export const TimeSheet = ({ employee }: TimeSheetProps) => {
  const { currentDate, goTo } = useContext(UserDateContext);
  const year = currentDate.year();
  const month = currentDate.month();

  const { getTimesheetPerMonth, getTimesheetSumPerMonth } = useTimesheet({
    employeeId: employee.uuid,
    year: (year || dayjs().year()).toString(),
  });

  const currentMonth = dayjs().year(year).month(month);
  const {
    rawEvents: employeeEvents,
    refetch,
    status: eventLoadingStatus,
  } = useEvents({
    employeeId: employee.uuid || undefined,
    year: currentDate.year(),
    month: currentDate.month(),
  });
  const currentMonthString = currentMonth.format('MMM');
  useEffect(() => {
    if (employee.uuid && currentMonthString) {
      refetch();
    }
  }, [employee, currentMonthString]);

  const { currentTimesheet, contract } = getTimesheetPerMonth({
    month: month.toString(),
    year: year.toString(),
  });
  const timesheetSum = getTimesheetSumPerMonth({
    timesheetOfMonth: currentTimesheet,
  });
  currentTimesheet.push(timesheetSum);
  return (
    <>
      <IconButton
        colorScheme="blackAlpha"
        marginRight={2}
        aria-label="previous month"
        leftIcon={<CgPushChevronLeft size="2rem" />}
        onClick={() => goTo('previousMonth')}
      />
      {currentDate.format('MMM')}
      <IconButton
        colorScheme="blackAlpha"
        marginLeft={2}
        marginRight={2}
        aria-label="next month"
        leftIcon={<CgPushChevronRight size="2rem" />}
        onClick={() => goTo('nextMonth')}
      />
      {currentDate.format('YYYY')}
      {eventLoadingStatus !== 'success' || !currentTimesheet || !contract ? (
        <FullPageSpinner />
      ) : (
        <>
          <TimesheetView
            contract={contract}
            name={getDisplayName({ person: employee, type: 'full' })}
            year={currentDate.year()}
            month={currentDate.month()}
            currentTimesheet={currentTimesheet}
          />
        </>
      )}
    </>
  );
};
