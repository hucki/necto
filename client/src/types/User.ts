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
