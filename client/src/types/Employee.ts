import { BgColor } from './Colors';

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
  contract: Contract[];
  teams: [
    {team: Team}
  ];
  createdAt: Date;
  updatedAt: Date;
};

export type Contract = {
  id?: number;
  userId: number;
  hoursPerWeek: number;
  appointmentsPerWeek: number;
  bgColor: BgColor;
  validUntil: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Employee2Team = {
  employee: Employee
  team: Team
}
