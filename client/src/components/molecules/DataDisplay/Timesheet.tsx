import React from 'react';
import { Contract, Employee } from '../../../types/Employee';
import { useEmployeeEvents } from '../../../hooks/events';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useHolidays } from '../../../hooks/useHolidays';

type TimesheetProps = {
  year: number;
  /**
   * zero based month -> 0 = January
   */
  month: number;
  employeeId: Employee['uuid'];
  contract: Contract;
};
const Timesheet = ({ year, month, employeeId, contract }: TimesheetProps) => {
  const { data: events } = useEmployeeEvents(employeeId);
  const { t } = useTranslation();
  const { isPublicHoliday, isWeekend } = useHolidays();

  const filteredEvents = events?.filter(
    (event) =>
      (!event.isCancelled &&
        dayjs(event.startTime).year() === year &&
        dayjs(event.startTime).month() === month) ||
      (dayjs(event.endTime).year() === year &&
        dayjs(event.endTime).month() === month)
  );

  const currentMonth = dayjs().year(year).month(month);
  const daysInMonth = currentMonth.daysInMonth();
  const monthName = currentMonth.format('MMM');

  const contractBase: 'hours' | 'appointments' =
    contract.appointmentsPerWeek && contract.appointmentsPerWeek > 0
      ? 'appointments'
      : 'hours';

  const leaveWorthPerDay =
    (contract[`${contractBase}PerWeek`] || 0) / contract.workdaysPerWeek;

  const rows = [];
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

    // .map((event) => (
    //   <div key={event.uuid}>
    //     {dayjs(event.startTime).toISOString() +
    //       ' - ' +
    //       dayjs(event.endTime).toISOString()}
    //   </div>
    // ));
    const date = dayjs(`${year}-${month + 1}-${i}`);
    const weekDay = date.format('dd');
    const publicHoliday = isPublicHoliday({
      date,
    });

    rows.push(
      <div
        key={i}
        style={{
          backgroundColor: isWeekend({
            date,
          })
            ? 'lightgray'
            : publicHoliday
            ? 'lightskyblue'
            : undefined,
        }}
      >
        <b>{i}</b> ({weekDay} {publicHoliday && ' / ' + publicHoliday.join()}){' '}
        <pre>{JSON.stringify(eventsOfDay)}</pre>
      </div>
    );
  }

  return (
    <>
      <div className="header">
        <div className="timeframe">{`${year} / ${monthName}`}</div>
        <div className="contract">
          {t('employee.contract.label')}:{' '}
          {t('employee.contract.summary', {
            numberOfUnits: contract[`${contractBase}PerWeek`] || 0,
            contractBase: t(`employee.contract.${contractBase}`),
            workdaysPerWeek: contract.workdaysPerWeek,
          })}{' '}
          {t('employee.contract.leaveWorthDescription', {
            leaveWorthPerDay,
            contractBase: t(`employee.contract.${contractBase}`),
          })}
        </div>
      </div>
      {rows}
    </>
  );
};

export default Timesheet;
