import { Model, DataTypes, Optional } from 'sequelize';

export interface ContractAttributes {
  id: number;
  userId: number;
  hoursPerWeek: number;
  appointmentsPerWeek: number;
  validUntil: Date;
  createdAt: Date;
  updatedAt: Date;
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
  validUntil: {
    type: DataTypes.DATE,
    allowNull: false,
    secondaryKey: true,
    validate: {
      notEmpty: true,
      isDate: true,
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notEmpty: true,
      isDate: true,
    },
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notEmpty: true,
      isDate: true,
    },
  },
};
