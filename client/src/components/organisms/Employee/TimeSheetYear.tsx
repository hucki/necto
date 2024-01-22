import React from 'react';
import { Contract, Employee } from '../../../types/Employee';
import { useTimesheet } from '../../../hooks/timesheet';
import { TimesheetYearDoc } from '../Documents/TimesheetDoc';
import { FullPageSpinner } from '../../atoms/LoadingSpinner';

type TimeSheetYearProps = {
  employeeId: Employee['uuid'];
  name: string;
  contract: Contract;
  year: string;
};

export const TimeSheetYear = ({
  employeeId,
  name,
  contract,
  year,
}: TimeSheetYearProps) => {
  const { getTimesheetPerYear, status } = useTimesheet({
    employeeId,
    year,
  });
  const timesheet = getTimesheetPerYear();
  return (
    <>
      {(status !== 'success' || !timesheet) && <FullPageSpinner />}
      {timesheet && (
        <TimesheetYearDoc
          timesheet={timesheet}
          year={year}
          name={name}
          contract={contract}
        />
      )}
    </>
  );
};
