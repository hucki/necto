import { Model, DataTypes, Optional } from 'sequelize';

export interface EventAttributes {
  id: number;
  userId: number;
  name: string;
  type: string;
  homeVisit: boolean;
  rrule: string;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface EventCreationAttributes
  extends Optional<EventAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Event
  extends Model<EventAttributes, EventCreationAttributes>
  implements EventAttributes {
  public id!: number;
  public userId!: number;
  public name!: string;
  public type!: string;
  public homeVisit!: boolean;
  public rrule!: string;
  public startTime!: Date;
  public endTime!: Date;
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
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  homeVisit: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
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
