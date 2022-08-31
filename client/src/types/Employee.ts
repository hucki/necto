import { BgColor } from './Colors';
import { UserSettings } from './UserSettings';

export type Team = {
  uuid: string;
  displayName: string;
  description: string;
  employees?: [
    {employee: Employee}
  ];
};

export type Employee = {
  uuid: string;
  firstName: string;
  lastName: string;
  alias?: string;
  validUntil?: Date;
  contract: Contract[];
  teams?: [
    {team: Team}
  ];
  createdAt?: Date;
  updatedAt?: Date;
  user?: UserSettings;
};

export type Contract = {
  id?: number;
  userId: string;
  hoursPerWeek: number;
  appointmentsPerWeek: number;
  bgColor: BgColor;
  validUntil: null | Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Employee2Team = {
  employee: Employee
  team: Team
}
