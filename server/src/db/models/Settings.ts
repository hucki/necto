import { Model, DataTypes } from 'sequelize';

export interface SettingsAttributes {
  calDays: string;
  calHoursStart: number;
  calHoursEnd: number;
  timescaleWidth: number;
}
export class Settings
  extends Model<SettingsAttributes>
  implements SettingsAttributes {
  public calDays!: string;
  public calHoursStart!: number;
  public calHoursEnd!: number;
  public timescaleWidth!: number;
}

export const settingsFields = {
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
};
