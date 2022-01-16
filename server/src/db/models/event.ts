import { Model, DataTypes, Optional } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { commonFieldsWithoutValidity } from './commonFields';

export interface EventAttributes {
  id: number;
  userId: number;
  ressourceId: number;
  title: string;
  type: string;
  isHomeVisit: boolean;
  isAllDay: boolean;
  isRecurring: boolean;
  isCancelled: boolean;
  isCancelledReason: string;
  rrule: string;
  startTime: Date;
  endTime: Date;
  bgColor: string;
  createdAt: Date;
  updatedAt: Date;
  tenantId: typeof uuidv4;
}

export interface EventCreationAttributes
  extends Optional<EventAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Event
  extends Model<EventAttributes, EventCreationAttributes>
  implements EventAttributes
{
  public readonly id!: number;
  public userId!: number;
  public ressourceId!: number;
  public title!: string;
  public type!: string;
  public isHomeVisit!: boolean;
  public isAllDay!: boolean;
  public isRecurring!: boolean;
  public isCancelled!: boolean;
  public isCancelledReason!: string;
  public rrule!: string;
  public bgColor!: string;
  public startTime!: Date;
  public endTime!: Date;
  public tenantId!: typeof uuidv4;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const eventFields = {
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
  ressourceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isHomeVisit: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  isAllDay: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  isRecurring: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  isCancelled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  isCancelledReason: {
    type: DataTypes.STRING,
    defaultValue: null,
    allowNull: true,
  },
  bgColor: {
    type: DataTypes.STRING,
    defaultValue: null,
    allowNull: true,
  },
  rrule: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notEmpty: true,
      isDate: true,
    },
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notEmpty: true,
      isDate: true,
    },
  },
  ...commonFieldsWithoutValidity,
};
