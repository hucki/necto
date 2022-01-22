import { Dayjs } from 'dayjs';
import { BgColor } from './Colors';

export type Event = {
  uuid?: string;
  userId: string;
  ressourceId: string;
  title: string;
  type: string;
  isHomeVisit: boolean;
  isAllDay: boolean;
  isRecurring: boolean;
  isCancelled: boolean;
  isCancelledReason: string;
  rrule: string;
  startTime: Dayjs;
  endTime: Dayjs;
  roomId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  bgColor?: BgColor;
};

export type Appointment = {
  uuid?: string;
  rowId: string;
  ressourceId: string;
  duration: number;
  isRecurring: boolean;
  frequency: string;
  count: number;
  title: string;
  startTime: Dayjs;
  endTime: Dayjs;
  rrule: string;
  rruleString: string;
  bgColor: BgColor;
  isHomeVisit: boolean;
  roomId?: string;
};
