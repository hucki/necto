import { v4 as uuidv4 } from 'uuid';
import { Model, DataTypes } from 'sequelize';

export interface AppSettingsAttributes {
  calDays: string;
  calHoursStart: number;
  calHoursEnd: number;
  timescaleWidth: number;
  companyId: number;
  tenantId: typeof uuidv4;
  createdAt: Date;
  updatedAt: Date;
}
export class AppSettings
extends Model<AppSettingsAttributes>
implements AppSettingsAttributes {
  public calDays!: string;
  public calHoursStart!: number;
  public calHoursEnd!: number;
  public timescaleWidth!: number;
  public companyId: number;
  public tenantId: typeof uuidv4;;
  public createdAt: Date;
  public updatedAt: Date;
}

export const appSettingsFields = {
  calDays: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  calHoursStart: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  calHoursEnd: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  timescaleWidth: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tenantId: {
    type: DataTypes.UUID,
    allowNull: false,
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
    }
  }
};
