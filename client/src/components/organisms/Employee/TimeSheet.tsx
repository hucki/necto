import React, { useContext, useEffect, useMemo } from 'react';
import TimesheetView from '../../molecules/DataDisplay/TimesheetView';
import { Employee } from '../../../types/Employee';
import { getDisplayName } from '../../../helpers/displayNames';
import { UserDateContext } from '../../../providers/UserDate';
import { Event, Leave, isLeave } from '../../../types/Event';
import { IconButton } from '../../atoms/Buttons';
import { CgPushChevronLeft, CgPushChevronRight } from 'react-icons/cg';
import { FullPageSpinner } from '../../atoms/LoadingSpinner';
import dayjs from 'dayjs';
import { useEmployeeEventsPerMonth } from '../../../hooks/events';
import { getCurrentContract } from '../../../helpers/contract';
import { useHolidays } from '../../../hooks/useHolidays';

export type EventsOfDay = {
  leaves: number;
  hours: {
    done: number;
    planned: number;
  };
  appointments: {
    done: number;
    planned: number;
  };
  leaveStates: {
    leaveType: Leave['leaveType'];
    leaveStatus: Leave['leaveStatus'];
  }[];
};

export type TimesheetDay = {
  /**
   * current day of the current month
   */
  dayOfMonth: number;
  /**
   * localized name of current weekday
   */
  weekdayName: string;
  /**
   * localized name of the current public Holiday or undefined
   */
  publicHolidayName: string | undefined;
  isWeekend: boolean;
  eventsOfDay: EventsOfDay | undefined;
  targetTimeOfDay: number;
  /**
   * difference between targetTime and timeOfDay (times with `isDone === false` are ecxcluded)
   */
  timeDiffOfDay: number;
  /**
   * sum of all appointments, hours or leaves of the day
   * with state `isDone === true`
   */
  timeOfDay: number;
  /**
   * sum of all appointments, hours or leaves of the day
   */
  plannedTimeOfDay: number;
};
export type CurrentTimesheet = TimesheetDay[];

interface TimeSheetProps {
  employee: Employee;
}
export const TimeSheet = ({ employee }: TimeSheetProps) => {
  const { isPublicHoliday, isWeekend } = useHolidays();
  const { currentDate, goTo } = useContext(UserDateContext);
  const year = currentDate.year();
  const month = currentDate.month();
  const currentMonth = dayjs().year(year).month(month);
  const daysInMonth = currentMonth.daysInMonth();
  const {
    employeeEvents,
    refetch,
    status: eventLoadingStatus,
  } = useEmployeeEventsPerMonth(
    employee.uuid || '',
    currentDate.year(),
    currentDate.month()
  );
  const currentMonthString = currentMonth.format('MMM');
  const currentTimesheet: CurrentTimesheet = [];
  useEffect(() => {
    if (employee.uuid && currentMonthString) {
      refetch();
    }
  }, [employee, currentMonthString]);
  const contract = getCurrentContract(employee);

  const filteredEvents = useMemo(
    () =>
      employeeEvents
        ?.filter((event) => event.type !== 'note')
        ?.filter((event) => !event.isCancelled)
        .filter(
          (event) =>
            (dayjs(event.startTime).year() === year &&
              dayjs(event.startTime).month() === month) ||
            (dayjs(event.endTime).year() === year &&
              dayjs(event.endTime).month() === month)
        ),
    [employeeEvents]
  );

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
      ?.filter((event: Event) =>
        dayjs(event.startTime).isSame(`${year}-${month + 1}-${i}`, 'day')
      )
      .reduce(
        (prev: EventsOfDay, cur: Event) => {
          if (isLeave(cur)) {
            prev.leaveStates.push({
              leaveType: cur.leaveType,
              leaveStatus: cur.leaveStatus,
            });
            prev.leaves++;
          }
          if (!cur.leaveType) {
            const state = cur.isDone ? 'done' : 'planned';
            prev.appointments[state]++;
            prev.hours[state] +=
              dayjs(cur.endTime).diff(dayjs(cur.startTime), 'minutes') / 60;
          }
          return prev;
        },
        {
          leaves: 0,
          hours: {
            done: 0,
            planned: 0,
          },
          appointments: {
            done: 0,
            planned: 0,
          },
          leaveStates: [],
        }
      );

    const date = dayjs(`${year}-${month + 1}-${i}`);
    const weekDay = date.format('dd');
    const isWorkday =
      contract &&
      contract.activeWorkdays
        .split(',')
        .find((day) => parseInt(day) === date.day());
    const publicHoliday = isPublicHoliday({
      date,
    });
    const weekend = isWeekend({
      date,
    });
    const noTargetTime = publicHoliday || weekend || !isWorkday;
    const targetTimeOfDay = noTargetTime ? 0 : targetTimePerDay;
    const timeOfDay =
      noTargetTime || !eventsOfDay
        ? 0
        : // leaves override `contractBase` times
          eventsOfDay.leaves * leaveWorthPerDay ||
          eventsOfDay[contractBase].done;
    const plannedTimeOfDay =
      noTargetTime || !eventsOfDay
        ? 0
        : // leaves override `contractBase` times
          eventsOfDay.leaves * leaveWorthPerDay ||
          eventsOfDay[contractBase].done + eventsOfDay[contractBase].planned;
    const timeDiffOfDay = timeOfDay - targetTimeOfDay;
    const currentTimesheetDay = {
      dayOfMonth: i,
      eventsOfDay: eventsOfDay,
      timeOfDay,
      plannedTimeOfDay,
      timeDiffOfDay,
      targetTimeOfDay,
      isWeekend: weekend,
      publicHolidayName: (publicHoliday && publicHoliday.join()) || undefined,
      weekdayName: weekDay,
    };
    currentTimesheet.push(currentTimesheetDay);
  }
  const timesheetSum = currentTimesheet.reduce(
    (prev, curr) => {
      prev.timeOfDay += curr.timeOfDay;
      prev.timeDiffOfDay += curr.timeDiffOfDay;
      prev.targetTimeOfDay += curr.targetTimeOfDay;
      return prev;
    },
    {
      dayOfMonth: 99,
      eventsOfDay: undefined,
      timeOfDay: 0,
      plannedTimeOfDay: 0,
      timeDiffOfDay: 0,
      targetTimeOfDay: 0,
      isWeekend: false,
      publicHolidayName: undefined,
      weekdayName: 'Sum',
    }
  );
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
