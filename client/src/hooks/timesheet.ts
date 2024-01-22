import { useCallback, useMemo } from 'react';
import { getCurrentContract } from '../helpers/contract';
import { Event, Leave, isLeave } from '../types/Event';
import { Employee } from '../types/Employee';
import { useOneEmployeeWithMonthEvents } from './employees';
import dayjs from 'dayjs';
import { useHolidays } from './useHolidays';

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
  leaveStates: LeaveStateEvaluated[];
};
export type LeaveStateEvaluated = {
  leaveType: Leave['leaveType'];
  leaveStatus: Leave['leaveStatus'];
  valueInHours: number;
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
  /**
   * sum of evaluated leaves
   */
  leaveStates: LeaveStateEvaluated[];
};
export type CurrentTimesheet = TimesheetDay[];
type UseTimesheetProps = {
  employeeId: Employee['uuid'];
  year: string;
};

type TimeSheetPerMonthProps = {
  year: string;
  month: string;
};
type GetTimesheetSumPerMonthProps = {
  timesheetOfMonth: TimesheetDay[];
};
type GetTimesheetSumPerYearProps = {
  timesheetOfYear: TimesheetDay[];
};
export type TimesheetPerYear = {
  [year: string]: {
    [month: number]: {
      daysInMonth: number;
      // events: Event[];
      timesheetDays: TimesheetDay[];
      timesheetSum: TimesheetDay | undefined;
    };
  };
};

export const useTimesheet = ({ employeeId, year }: UseTimesheetProps) => {
  const { employee, status } = useOneEmployeeWithMonthEvents(employeeId, year);
  const events = employee.events;
  const contract = employee.contract ? getCurrentContract(employee) : undefined;
  const isPending = status !== 'success' || !contract;
  const filteredEvents = useMemo(
    () =>
      events
        ?.filter((event) => event.type !== 'note')
        ?.filter((event) => !event.isCancelled),
    [events]
  );

  const getTimesheetPerYear = useCallback((): TimesheetPerYear | undefined => {
    const timesheetPerYear: TimesheetPerYear = {
      [year]: {
        ...new Array(12).fill('').map((_, i) => ({
          daysInMonth: dayjs().year(parseInt(year)).month(i).daysInMonth(),
          timesheetDays: [],
          timesheetSum: undefined,
        })),
      },
    };
    Object.keys(timesheetPerYear).forEach((year) =>
      Object.keys(timesheetPerYear[year]).forEach((month) => {
        const timesheetDays = getTimesheetPerMonth({
          year,
          month,
        });
        timesheetPerYear[year][parseInt(month)].timesheetDays = [
          ...timesheetDays,
        ];

        timesheetPerYear[year][parseInt(month)].timesheetSum =
          getTimesheetSumPerMonth({
            timesheetOfMonth: timesheetDays,
          });
      })
    );

    const timesheetDaysSumsPerMonth = Object.keys(timesheetPerYear[year]).map(
      (month) =>
        getTimesheetSumPerMonth({
          timesheetOfMonth:
            timesheetPerYear[year][parseInt(month)].timesheetDays,
        })
    );
    const timesheetDaysSumPerYear = getTimesheetSumPerYear({
      timesheetOfYear: timesheetDaysSumsPerMonth,
    });
    timesheetPerYear[year][99] = {
      daysInMonth: 0,
      timesheetDays: timesheetDaysSumsPerMonth,
      timesheetSum: timesheetDaysSumPerYear,
    };
    return !isPending ? timesheetPerYear : undefined;
  }, [employee, status, year]);

  const getTimesheetPerMonth = ({ year, month }: TimeSheetPerMonthProps) => {
    const thisYear = dayjs().year(parseInt(year));
    const thisMonth = dayjs().year(parseInt(year)).month(parseInt(month));
    const daysInMonth = thisMonth.daysInMonth();
    const eventsOfMonth = filteredEvents?.filter(
      (e) =>
        dayjs(e.startTime).isSame(thisYear, 'year') &&
        dayjs(e.startTime).isSame(thisMonth, 'month')
    );
    const { isPublicHoliday, isWeekend } = useHolidays();
    const currentTimesheet: CurrentTimesheet = [];
    const contractBase: 'hours' | 'appointments' =
      contract?.appointmentsPerWeek && contract?.appointmentsPerWeek > 0
        ? 'appointments'
        : 'hours';

    const targetTimePerDay =
      ((contract && contract[`${contractBase}PerWeek`]) || 0) /
      ((contract && contract.workdaysPerWeek) || 0);
    const leaveWorthPerDay = targetTimePerDay;
    for (let i = 1; i <= daysInMonth; i++) {
      const date = dayjs(`${year}-${parseInt(month) + 1}-${i}`);
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
      const eventsOfDay = eventsOfMonth
        ?.filter((event: Event) =>
          dayjs(event.startTime).isSame(
            `${year}-${parseInt(month) + 1}-${i}`,
            'day'
          )
        )
        .reduce(
          (prev: EventsOfDay, cur: Event) => {
            if (isLeave(cur)) {
              prev.leaveStates.push({
                leaveType: cur.leaveType,
                leaveStatus: cur.leaveStatus,
                valueInHours: targetTimeOfDay,
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
      const currentTimesheetDay: TimesheetDay = {
        dayOfMonth: i,
        eventsOfDay: eventsOfDay,
        timeOfDay,
        plannedTimeOfDay,
        timeDiffOfDay,
        targetTimeOfDay,
        isWeekend: weekend,
        publicHolidayName: (publicHoliday && publicHoliday.join()) || undefined,
        weekdayName: weekDay,
        leaveStates: eventsOfDay?.leaveStates || [],
      };
      currentTimesheet.push(currentTimesheetDay);
    }
    return currentTimesheet;
  };

  const getTimesheetSumPerMonth = ({
    timesheetOfMonth,
  }: GetTimesheetSumPerMonthProps) => {
    return timesheetOfMonth.reduce(
      (prev, curr) => {
        prev.timeOfDay += curr.timeOfDay;
        prev.timeDiffOfDay += curr.timeDiffOfDay;
        prev.targetTimeOfDay += curr.targetTimeOfDay;
        prev.plannedTimeOfDay += curr.plannedTimeOfDay;
        prev.leaveStates.push(...curr.leaveStates);
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
        leaveStates: [],
      }
    );
  };
  const getTimesheetSumPerYear = ({
    timesheetOfYear,
  }: GetTimesheetSumPerYearProps) => {
    return timesheetOfYear.reduce(
      (prev, curr) => {
        prev.timeOfDay += curr.timeOfDay;
        prev.timeDiffOfDay += curr.timeDiffOfDay;
        prev.targetTimeOfDay += curr.targetTimeOfDay;
        prev.plannedTimeOfDay += curr.plannedTimeOfDay;
        prev.leaveStates.push(...curr.leaveStates);
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
        leaveStates: [],
      }
    );
  };

  return {
    getTimesheetPerMonth,
    getTimesheetPerYear,
    status,
    getTimesheetSumPerMonth,
    getTimesheetSumPerYear,
  };
};
