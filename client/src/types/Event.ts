import { Dayjs } from 'dayjs';
import { BgColor } from './Colors';
import { Employee } from './Employee';
import { Patient } from './Patient';

export type EventType =
  | 'custom'
  | 'note'
  | 'Appointment'
  | 'leave'
  | 'roomBooking';

export type LeaveType =
  | 'sick'
  | 'sickChild'
  | 'paidVacation'
  | 'unpaidLeave'
  | 'parentalLeave'
  | 'special';

export type LeaveStatus = 'requested' | 'cancelled' | 'approved';

export type Event = {
  uuid?: string;
  userId: string;
  ressourceId: string;
  title: string;
  type: EventType;
  leaveStatus?: LeaveStatus;
  leaveType?: LeaveType;
  isDiagnostic: boolean;
  isHomeVisit: boolean;
  isAllDay: boolean;
  isRecurring: boolean;
  isCancelled: boolean;
  isDone: boolean;
  /** @deprecated */
  isCancelledReason: string;
  cancellationReasonId?: string;
  cancellationReason?: CancellationReason;
  rrule: string;
  startTime: Dayjs;
  endTime: Dayjs;
  roomId?: string;
  patientId?: string;
  parentEventId?: string;
  parentEvent?: Event;
  childEvents?: Event[];
  createdAt?: Date;
  updatedAt?: Date;
  bgColor?: BgColor;
  patient?: Patient;
  employee?: Employee;
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

export type CancellationReason = {
  id: string;
  description: string;
  tenantId?: string;
};
