import { Model, DataTypes, Optional } from 'sequelize';

export interface TenantAttributes {
  id: number;
  name: string;
  description: string;
  validUntil: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface TenantCreationAttributes
  extends Optional<TenantAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Tenant
  extends Model<TenantAttributes, TenantCreationAttributes>
  implements TenantAttributes {
  public id!: number;
  public name!: string;
  public description!: string;

  public validUntil!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const tenantFields = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
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
