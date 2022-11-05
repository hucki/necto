import { BgColor } from './Colors';
import { Company } from './Company';
import { UserSettings } from './UserSettings';

export type Team = {
  uuid: string;
  displayName: string;
  description: string;
  employees?: [{ employee: Employee }];
};

export type Employee = {
  uuid: string;
  firstName: string;
  lastName: string;
  alias?: string;
  validUntil?: Date;
  contract: Contract[];
  teams?: [{ team: Team }];
  createdAt?: Date;
  updatedAt?: Date;
  user?: UserSettings;
  companyId: Company['uuid'];
};

export type NewEmployee = Pick<
  Employee,
  'firstName' | 'lastName' | 'companyId'
>;

export type Contract = {
  id: number;
  employeeId: string;
  hoursPerWeek?: number;
  appointmentsPerWeek?: number;
  bgColor?: BgColor;
  validUntil?: null | Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export type NewContract = Pick<
  Contract,
  'employeeId' | 'hoursPerWeek' | 'appointmentsPerWeek' | 'bgColor'
>;

export type Employee2Team = {
  employee: Employee;
  team: Team;
};
