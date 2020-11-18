import { Model, DataTypes, Optional } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { commonFields } from './commonFields';

export interface UserSettingsAttributes {
  id: number;
  userId: number;
  bgColor: string;
  validUntil: Date;
  createdAt: Date;
  updatedAt: Date;
  tenantId: typeof uuidv4;
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
  public tenantId!: typeof uuidv4;
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
  ...commonFields
};
