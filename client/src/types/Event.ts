import { Dayjs } from 'dayjs';
import { BgColor } from './Colors';
import { Employee } from './Employee';
import { Patient } from './Patient';
import { Room } from './Rooms';

export type EventType =
  | 'custom'
  | 'note'
  | 'appointment'
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
  uuid: string;
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
  room?: Room;
};
export type NewEvent = Pick<
  Event,
  | 'userId'
  | 'ressourceId'
  | 'title'
  | 'type'
  | 'leaveType'
  | 'leaveStatus'
  | 'isDiagnostic'
  | 'isHomeVisit'
  | 'isAllDay'
  | 'isRecurring'
  | 'isCancelled'
  | 'isDone'
  | 'isCancelledReason'
  | 'rrule'
  | 'startTime'
  | 'endTime'
  | 'patientId'
  | 'roomId'
  | 'bgColor'
  | 'parentEventId'
>;
export type CancellationReason = {
  id: string;
  description: string;
  tenantId?: string;
};
