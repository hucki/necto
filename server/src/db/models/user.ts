import {
  Model,
  DataTypes,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  Association,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  Optional,
} from 'sequelize';
import { Event } from './Event';

export interface UserAttributes {
  id: number;
  firstName: string;
  lastName: string;
  validUntil: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface UserCreationAttributes
  extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: number;
  public firstName!: string;
  public lastName!: string;

  // timestamps!
  public validUntil!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getEvents!: HasManyGetAssociationsMixin<Event>;
  public addEvent!: HasManyAddAssociationMixin<Event, number>;
  public hasEvent!: HasManyHasAssociationMixin<Event, number>;
  public countEvents!: HasManyCountAssociationsMixin;
  public createEvent!: HasManyCreateAssociationMixin<Event>;

  public static associations: {
    events: Association<User, Event>;
  };
}

export const userFields = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING(64),
  },
  lastName: {
    type: DataTypes.STRING(64),
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
