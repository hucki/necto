import { v4 as uuidv4 } from 'uuid';
import { Model, DataTypes, Optional } from 'sequelize';

export interface TenantAttributes {
  id: typeof uuidv4;
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
  public id!: typeof uuidv4;
  public name!: string;
  public description!: string;

  public validUntil!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const tenantFields = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
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
    allowNull: true,
    secondaryKey: true,
    validate: {
      isDate: true,
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    validate: {
      notEmpty: true,
      isDate: true,
    },
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    validate: {
      notEmpty: true,
      isDate: true,
    },
  },
};
