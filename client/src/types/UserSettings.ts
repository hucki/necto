import { Employee } from './Employee';
import { User } from './User';

export type UserSettings = {
  id?: number;
  userId: string;
  employeeId?: string;
  bgColor?: string;
  validUntil?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  user?: User;
  employee?: Employee;
};

export type UserToPermissions = {
  userId: string;
  permissionId: string;
  tenantId?: string;
  permission?: PermissionLevel;
};

export type PermissionLevel = {
  uuid: string;
  displayName: string;
  description: string;
};
