import React, { useState } from 'react';
import dayjs from 'dayjs';
import TimeInputForm from './TimeInputForm';
import { NewTimesheetEntry } from '../../../types/Times';
import { useCreateTimsheetEntry, useTimes } from '../../../hooks/times';
import TimeInput from './TimeInput';

interface TimeProps {
  employeeId: string;
}
export type TimeType = 'workingHours' | 'break';
export type Times = {
  type: string;
  start: string;
  end: string;
};
const Time = ({ employeeId }: TimeProps) => {
  const { rawTimes: times } = useTimes({
    employeeId,
  });
  const { mutateAsync: createTimesheetEntry } = useCreateTimsheetEntry();

  const [bookings, setBookings] = useState<NewTimesheetEntry[]>([]);
  const now = new Date();
  const newTimeBooking: NewTimesheetEntry = {
    employeeId,
    accountId: '0',
    value: 0,
    info: '',
    startTime: dayjs(now).toISOString(),
    endTime: dayjs(now).toISOString(),
  };

  const handleAddBooking = async ({
    currentTimes,
  }: {
    currentTimes: Times;
  }) => {
    const value = Math.round(
      dayjs(currentTimes.end).diff(dayjs(currentTimes.start), 'seconds') / 60
    );
    const newBooking: NewTimesheetEntry = {
      ...newTimeBooking,
      info: currentTimes.type,
      value,
      startTime: currentTimes.start,
      endTime: currentTimes.end,
    };
    const createdTimesheetEntry = await createTimesheetEntry({
      timesheetEntry: newBooking,
    });
    if (createdTimesheetEntry.uuid) {
      console.log('🍕 success');
    }
    setBookings((current) => [...current, newBooking]);
  };
  return (
    <>
      <TimeInputForm onAddBooking={handleAddBooking} type="workingHours" />
      <TimeInput onAddBooking={handleAddBooking} type="workingHours" />
      <TimeInputForm onAddBooking={handleAddBooking} type="break" />
      {bookings?.length
        ? bookings.map((t, i) => (
            <pre key={i}>
              {t.info + ': ' + t.value + ' ' + t.startTime + ' - ' + t.endTime}
            </pre>
          ))
        : null}
      {times?.length
        ? times.map((t, i) => (
            <pre key={i}>
              {t.info + ': ' + t.value + ' ' + t.startTime + ' - ' + t.endTime}
            </pre>
          ))
        : null}
    </>
  );
};

export default Time;
