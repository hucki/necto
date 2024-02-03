import { BgColor } from './Colors';
import { UserSettings, UserToPermissions } from './UserSettings';

export type User = {
  uuid?: string;
  a0Id?: string;
  firstName: string;
  lastName: string;
  email?: string;
  validUntil?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  userSettings?: UserSettings[];
  permissions?: UserToPermissions[];
};

export type EmployeeUser = Pick<
  User,
  'createdAt' | 'updatedAt' | 'validUntil'
> & { id: string; userId: string };

export type TeamMember = {
  uuid: string;
  a0Id?: string;
  firstName: string;
  lastName: string;
  validUntil: Date;
  createdAt: Date;
  updatedAt: Date;
  hoursPerWeek: number | null;
  appointmentsPerWeek: number | null;
  bgColor: BgColor;
  planningProgress?: number;
};

// Typeguard
export const isUser = (data: unknown): data is User => {
  return (data as User).hasOwnProperty('password');
};

// Typeguard
export const isEmployeeUser = (data: unknown): data is EmployeeUser => {
  return (data as EmployeeUser).hasOwnProperty('userId');
};
