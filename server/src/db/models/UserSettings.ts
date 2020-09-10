import { Model, DataTypes, Optional } from 'sequelize';

export interface UserSettingsAttributes {
  id: number;
  userId: number;
  bgColor: string;
  validUntil: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface UserSettingsCreationAttributes
  extends Optional<UserSettingsAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class UserSettings
  extends Model<UserSettingsAttributes, UserSettingsCreationAttributes>
  implements UserSettingsAttributes {
  public id!: number;
  public userId!: number;
  public bgColor!: string;
  public validUntil!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const userSettingsFields = {
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
  bgColor: {
    type: DataTypes.STRING,
  },
  validUntil: {
    type: DataTypes.DATE,
    allowNull: false,
    primaryKey: true,
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
