import { v4 as uuidv4 } from 'uuid';

export type Event = {
  id?: number;
  userId: number;
  title: string;
  type: string;
  isHomeVisit: boolean;
  isAllDay: boolean;
  isRecurring: boolean;
  isCancelled: boolean;
  isCancelledReason: string;
  rrule: string;
  startTime: Date;
  endTime: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Appointment = {
  id?: number;
  rowId: string;
  title: string;
  startTime: Date;
  endTime: Date;
  rrule: string;
  bgColor: string;
  isHomeVisit: boolean;
};
