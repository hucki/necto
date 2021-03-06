import { v4 as uuidv4 } from 'uuid';
import { Model, DataTypes, Optional } from 'sequelize';

export interface CompanyAttributes {
  id: number;
  name: string;
  tenantId: typeof uuidv4;
  validUntil: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface CompanyCreationAttributes
  extends Optional<CompanyAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Company
  extends Model<CompanyAttributes, CompanyCreationAttributes>
  implements CompanyAttributes {
  public id!: number;
  public name!: string;
  public tenantId!: typeof uuidv4;
  public validUntil!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const companyFields = {
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
  tenantId: {
    type: DataTypes.UUID,
    allowNull: false,
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
