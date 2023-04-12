import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Employee } from '../../../types/Employee';
import { FullPageSpinner } from '../../atoms/LoadingSpinner';
import { ControlWrapper } from '../../atoms/Wrapper';
import { FormControl, FormLabel, Select } from '../../Library';
import { useAllEmployeesWithMonthEvents } from '../../../hooks/employees';
import { useTranslation } from 'react-i18next';
import Timesheet from '../../molecules/DataDisplay/Timesheet';
import { getCurrentContract } from '../../../helpers/contract';
import { UserDateContext } from '../../../providers/UserDate';
import { useHolidays } from '../../../hooks/useHolidays';
import dayjs from 'dayjs';

export type EventsOfDay = {
  leaves: number;
  hours: number;
  appointments: number;
};
export type TimesheetDay = {
  dayOfMonth: number;
  weekdayName: string;
  publicHolidayName: string | undefined;
  isWeekend: boolean;
  eventsOfDay: EventsOfDay | undefined;
  targetTimeOfDay: number;
  timeDiffOfDay: number;
  timeOfDay: number;
};
export type CurrentTimesheet = TimesheetDay[];

const SingleView = () => {
  const { t } = useTranslation();
  const { isPublicHoliday, isWeekend } = useHolidays();

  const { currentDate } = useContext(UserDateContext);
  const { data: employees, isLoading } = useAllEmployeesWithMonthEvents(
    currentDate.year(),
    currentDate.month()
  );
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
  const contract =
    (currentEmployee && getCurrentContract(currentEmployee)) || undefined;

  console.log({ currentEmployee });

  const currentTimesheet: CurrentTimesheet = [];
  const year = currentDate.year();
  const month = currentDate.month();
  const filteredEvents = useMemo(
    () =>
      currentEmployee?.events?.filter(
        (event) =>
          (!event.isCancelled &&
            dayjs(event.startTime).year() === year &&
            dayjs(event.startTime).month() === month) ||
          (dayjs(event.endTime).year() === year &&
            dayjs(event.endTime).month() === month)
      ),
    [currentEmployee?.events]
  );

  const currentMonth = dayjs().year(year).month(month);
  const daysInMonth = currentMonth.daysInMonth();

  const contractBase: 'hours' | 'appointments' =
    contract?.appointmentsPerWeek && contract?.appointmentsPerWeek > 0
      ? 'appointments'
      : 'hours';

  const targetTimePerDay =
    ((contract && contract[`${contractBase}PerWeek`]) || 0) /
    ((contract && contract.workdaysPerWeek) || 0);
  const leaveWorthPerDay = targetTimePerDay;

  for (let i = 1; i <= daysInMonth; i++) {
    const eventsOfDay = filteredEvents
      ?.filter(
        (event) =>
          dayjs(event.startTime).isSame(`${year}-${month + 1}-${i}`, 'day') ||
          dayjs(event.endTime).isSame(`${year}-${month + 1}-${i}`, 'day')
      )
      .reduce(
        (prev, cur) => {
          if (cur.leaveType) {
            prev.leaves++;
          }
          if (!cur.leaveType) {
            prev.appointments++;
            prev.hours += dayjs(cur.endTime).diff(
              dayjs(cur.startTime),
              'hours'
            );
          }
          return prev;
        },
        { leaves: 0, hours: 0, appointments: 0 }
      );

    const date = dayjs(`${year}-${month + 1}-${i}`);
    const weekDay = date.format('dd');
    const publicHoliday = isPublicHoliday({
      date,
    });
    const weekend = isWeekend({
      date,
    });
    const targetTimeOfDay = publicHoliday || weekend ? 0 : targetTimePerDay;
    const timeOfDay = eventsOfDay
      ? eventsOfDay[contractBase] || eventsOfDay.leaves * leaveWorthPerDay
      : 0;
    const timeDiffOfDay = timeOfDay - targetTimeOfDay;

    currentTimesheet.push({
      dayOfMonth: i,
      eventsOfDay: eventsOfDay,
      timeOfDay,
      timeDiffOfDay,
      targetTimeOfDay,
      isWeekend: weekend,
      publicHolidayName: (publicHoliday && publicHoliday.join()) || undefined,
      weekdayName: weekDay,
    });
  }
  return !currentEmployee || !employees ? null : (
    <>
      <ControlWrapper>
        <FormControl id="employee" style={{ margin: 'auto 1rem' }}>
          <Select
            name="employee"
            value={currentEmployee.uuid}
            onChange={onEmployeeChangeHandler}
          >
            {employees.map((t, i) => (
              <option key={i} value={t.uuid}>
                {t.firstName + ' ' + t.lastName}
              </option>
            ))}
          </Select>
          <FormLabel>{t('label.employeeSelect')}</FormLabel>
        </FormControl>
      </ControlWrapper>
      {!currentTimesheet || !contract ? (
        <FullPageSpinner />
      ) : (
        <>
          <Timesheet
            contract={contract}
            year={currentDate.year()}
            month={currentDate.month()}
            currentTimesheet={currentTimesheet}
          />
        </>
      )}
    </>
  );
};

export default SingleView;
