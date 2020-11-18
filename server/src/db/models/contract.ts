import { Model, DataTypes, Optional } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { commonFields } from './commonFields';

export interface ContractAttributes {
  id: number;
  userId: number;
  hoursPerWeek: number;
  appointmentsPerWeek: number;
  validUntil: Date;
  createdAt: Date;
  updatedAt: Date;
  tenantId: typeof uuidv4;
}

interface ContractCreationAttributes
  extends Optional<ContractAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Contract
  extends Model<ContractAttributes, ContractCreationAttributes>
  implements ContractAttributes {
  public id!: number;
  public userId!: number;
  public hoursPerWeek!: number;
  public appointmentsPerWeek!: number;

  public validUntil!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public tenantId!: typeof uuidv4;
}

export const contractFields = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  hoursPerWeek: {
    type: DataTypes.INTEGER,
  },
  appointmentsPerWeek: {
    type: DataTypes.INTEGER,
  },
  ...commonFields
};
