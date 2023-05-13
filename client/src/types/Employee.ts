import { BgColor } from './Colors';
import { Company } from './Company';
import { Event } from './Event';
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
  events?: Event[];
};

export type NewEmployee = Pick<
  Employee,
  'firstName' | 'lastName' | 'companyId'
>;

export type Contract = {
  id: number;
  employeeId: string;
  roomId?: string;
  hoursPerWeek?: number;
  appointmentsPerWeek?: number;
  workdaysPerWeek: number;
  activeWorkdays: string;
  bgColor?: BgColor;
  validUntil?: null | Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export type NewContract = Pick<
  Contract,
  | 'employeeId'
  | 'hoursPerWeek'
  | 'appointmentsPerWeek'
  | 'workdaysPerWeek'
  | 'activeWorkdays'
  | 'bgColor'
  | 'roomId'
>;

export type Employee2Team = {
  employee: Employee;
  team: Team;
};

export type AddEmployeeToTeamVariables = {
  employeeId: Employee['uuid'];
  teamId: Team['uuid'];
};

export type RemoveEmployeeToTeamVariables = AddEmployeeToTeamVariables;

export type TeamEmployeeRelation = {
  teamId: Team['uuid'];
  employeeId: Employee['uuid'];
};
