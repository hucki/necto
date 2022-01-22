import { BgColor } from './Colors';

export type User = {
  uuid?: string;
  a0Id: string;
  firstName: string;
  lastName: string;
  validUntil?: Date;
  createdAt?: Date;
  updatedAt?: Date;
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
