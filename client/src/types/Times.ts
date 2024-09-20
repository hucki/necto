import { Employee } from './Employee';

export type NewTimesheetEntry = {
  employeeId: Employee['uuid'];
  accountId: string;
  value: number;
  info: string;
  startTime: string;
  endTime: string;
};

export type TimesheetEntry = {
  uuid: string;
  accountId: string;
  creatadAt: string;
  updatedAt: string;
} & NewTimesheetEntry;
