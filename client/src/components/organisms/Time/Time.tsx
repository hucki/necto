import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Employee } from '../../../types/Employee';
import TimeInputForm, { Times } from './TimeInputForm';

type NewTimeBooking = {
  employeeId: Employee['uuid'];
  unit: string;
  value: number;
  info: string;
  startTime: string;
  endTime: string;
};

type TimeBooking = {
  uuid: string;
  accountId: string;
  creatadAt: string;
  updatedAt: string;
} & NewTimeBooking;

interface TimeProps {
  employeeId: string;
}
const Time = ({ employeeId }: TimeProps) => {
  const [bookings, setBookings] = useState<NewTimeBooking[]>([]);
  const now = new Date();
  const newTimeBooking: NewTimeBooking = {
    employeeId,
    unit: 'minutes',
    value: 0,
    info: '',
    startTime: dayjs(now).toISOString(),
    endTime: dayjs(now).toISOString(),
  };

  const handleAddBooking = ({ currentTimes }: { currentTimes: Times }) => {
    const value = Math.round(
      dayjs(currentTimes.endTime).diff(
        dayjs(currentTimes.startTime),
        'seconds'
      ) / 60
    );
    const newBooking: NewTimeBooking = {
      ...newTimeBooking,
      info: currentTimes.type,
      value,
      startTime: currentTimes.startTime,
      endTime: currentTimes.endTime,
    };
    setBookings((current) => [...current, newBooking]);
  };

  return (
    <>
      <TimeInputForm onAddBooking={handleAddBooking} type="workingHours" />
      <TimeInputForm onAddBooking={handleAddBooking} type="break" />
      {bookings?.length
        ? bookings.map((t, i) => (
            <pre key={i}>
              {t.info + ': ' + t.value + ' ' + t.startTime + ' - ' + t.endTime}
            </pre>
          ))
        : null}
    </>
  );
};

export default Time;
