import { Dayjs } from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { BgColor } from './Colors';

export type Event = {
  id?: number;
  userId: number;
  ressourceId: number;
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
  roomId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  bgColor?: BgColor;
};

export type Appointment = {
  id?: number;
  rowId: string;
  ressourceId: number;
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
  roomId?: number;
};
