import { BgColor } from './Colors';
import { UserSettings } from './UserSettings';

export type User = {
  uuid?: string;
  a0Id: string;
  firstName: string;
  lastName: string;
  validUntil?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  userSettings?: UserSettings[];
};

export type TeamMember = {
  uuid: string;
  a0Id: string;
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
