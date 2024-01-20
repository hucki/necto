import React, { useContext } from 'react';
import { Contract, Employee } from '../../../types/Employee';
import { UserDateContext } from '../../../providers/UserDate';
import { useTimesheet } from '../../../hooks/timesheet';
import dayjs from 'dayjs';
import { IconButton } from '../../atoms/Buttons';
import { CgPushChevronLeft, CgPushChevronRight } from 'react-icons/cg';
import { TimesheetYearDoc } from '../Documents/TimesheetDoc';
import { FullPageSpinner } from '../../atoms/LoadingSpinner';

type TimeSheetYearProps = {
  employeeId: Employee['uuid'];
  name: string;
  contract: Contract;
};

export const TimeSheetYear = ({
  employeeId,
  name,
  contract,
}: TimeSheetYearProps) => {
  const { currentDate, goTo } = useContext(UserDateContext);
  const year = (currentDate.year() || dayjs().year()).toString();

  const { getTimesheetPerYear, status } = useTimesheet({
    employeeId,
    year,
  });
  const timesheet = getTimesheetPerYear();
  return (
    <>
      <IconButton
        colorScheme="blackAlpha"
        marginRight={2}
        aria-label="previous month"
        leftIcon={<CgPushChevronLeft size="2rem" />}
        onClick={() => goTo('previousYear')}
      />
      {currentDate.format('YYYY')}
      <IconButton
        colorScheme="blackAlpha"
        marginLeft={2}
        marginRight={2}
        aria-label="next month"
        leftIcon={<CgPushChevronRight size="2rem" />}
        onClick={() => goTo('nextYear')}
      />
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
